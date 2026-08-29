// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REALTIME_RECONNECT_DELAY_MS } from '../../api/realtime.constants';
import { useRealtimeConnection } from '../../hooks/useRealtimeConnection';

interface RealtimeEventExpectation {
  eventType: string;
  queryKeys: string[][];
}

const REALTIME_EVENT_EXPECTATIONS: RealtimeEventExpectation[] = [
  { eventType: 'booking.created', queryKeys: [['rooms'], ['bookings']] },
  { eventType: 'booking.cancelled', queryKeys: [['rooms'], ['bookings']] },
  { eventType: 'room.availability_changed', queryKeys: [['rooms']] },
  { eventType: 'data.reset', queryKeys: [['offices'], ['rooms'], ['bookings']] },
];

class MockWebSocket extends EventTarget {
  static instances: MockWebSocket[] = [];

  readonly url: string;

  constructor(url: string) {
    super();
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  close = () => {
    this.dispatchEvent(new Event('close'));
  };
}

const renderRealtimeConnection = () => {
  const queryClient = new QueryClient();
  const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const hook = renderHook(useRealtimeConnection, { wrapper });

  return { ...hook, invalidateQueries };
};

beforeEach(() => {
  MockWebSocket.instances = [];
  vi.useFakeTimers();
  vi.stubGlobal('WebSocket', MockWebSocket);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('useRealtimeConnection', () => {
  it('закрывает ошибочный сокет и позволяет переподключиться вручную', () => {
    const { result, unmount } = renderRealtimeConnection();
    const firstSocket = MockWebSocket.instances[0];
    const close = vi.spyOn(firstSocket, 'close');

    act(() => firstSocket.dispatchEvent(new Event('error')));
    expect(close).toHaveBeenCalledOnce();
    expect(result.current.status).toBe('reconnecting');

    act(() => result.current.reconnect());
    expect(MockWebSocket.instances).toHaveLength(2);

    const secondSocket = MockWebSocket.instances[1];
    const secondClose = vi.spyOn(secondSocket, 'close');
    unmount();
    expect(secondClose).toHaveBeenCalledOnce();
  });

  it('не планирует несколько reconnect для повторных close-событий', () => {
    renderRealtimeConnection();
    const socket = MockWebSocket.instances[0];

    act(() => {
      socket.dispatchEvent(new Event('close'));
      socket.dispatchEvent(new Event('close'));
      vi.advanceTimersByTime(REALTIME_RECONNECT_DELAY_MS);
    });

    expect(MockWebSocket.instances).toHaveLength(2);
  });

  it('переходит в reconnecting после закрытия WebSocket и восстанавливает соединение', () => {
    const { result, invalidateQueries } = renderRealtimeConnection();
    const firstSocket = MockWebSocket.instances[0];

    expect(firstSocket.url).toBe('ws://localhost:3000/api/v1/ws');
    expect(result.current.status).toBe('connecting');

    act(() => firstSocket.dispatchEvent(new Event('open')));
    expect(result.current.status).toBe('connected');

    invalidateQueries.mockClear();
    act(() => firstSocket.dispatchEvent(new Event('close')));
    expect(result.current.status).toBe('reconnecting');

    act(() => vi.advanceTimersByTime(REALTIME_RECONNECT_DELAY_MS));
    const reconnectedSocket = MockWebSocket.instances[1];

    act(() => reconnectedSocket.dispatchEvent(new Event('open')));
    expect(result.current.status).toBe('connected');
    expect(invalidateQueries).toHaveBeenCalledTimes(3);
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['offices'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['rooms'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['bookings'] });
  });

  it.each(REALTIME_EVENT_EXPECTATIONS)(
    'обновляет нужные REST-данные после события $eventType',
    ({ eventType, queryKeys }) => {
      const { invalidateQueries } = renderRealtimeConnection();
      const socket = MockWebSocket.instances[0];

      act(() => socket.dispatchEvent(new Event('open')));
      invalidateQueries.mockClear();
      act(() =>
        socket.dispatchEvent(
          new MessageEvent('message', {
            data: JSON.stringify({ type: eventType }),
          }),
        ),
      );

      expect(invalidateQueries).toHaveBeenCalledTimes(queryKeys.length);
      queryKeys.forEach((queryKey) => {
        expect(invalidateQueries).toHaveBeenCalledWith({ queryKey });
      });
    },
  );

  it('игнорирует неизвестные и некорректные WebSocket-сообщения', () => {
    const { invalidateQueries } = renderRealtimeConnection();
    const socket = MockWebSocket.instances[0];

    act(() => socket.dispatchEvent(new Event('open')));
    invalidateQueries.mockClear();
    act(() => {
      socket.dispatchEvent(new MessageEvent('message', { data: '{broken-json' }));
      socket.dispatchEvent(
        new MessageEvent('message', { data: JSON.stringify({ type: 'unknown.event' }) }),
      );
      socket.dispatchEvent(new MessageEvent('message', { data: new Uint8Array() }));
    });

    expect(invalidateQueries).not.toHaveBeenCalled();
  });
});
