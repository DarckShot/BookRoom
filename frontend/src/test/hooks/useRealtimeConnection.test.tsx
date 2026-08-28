// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REALTIME_RECONNECT_DELAY_MS } from '../../api/realtime.constants';
import { useRealtimeConnection } from '../../hooks/useRealtimeConnection';

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
  it('переходит в reconnecting после закрытия WebSocket и восстанавливает соединение', () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(useRealtimeConnection, { wrapper });
    const firstSocket = MockWebSocket.instances[0];

    expect(firstSocket.url).toBe('ws://localhost:3000/api/v1/ws');
    expect(result.current.status).toBe('connecting');

    act(() => firstSocket.dispatchEvent(new Event('open')));
    expect(result.current.status).toBe('connected');

    act(() => firstSocket.dispatchEvent(new Event('close')));
    expect(result.current.status).toBe('reconnecting');

    act(() => vi.advanceTimersByTime(REALTIME_RECONNECT_DELAY_MS));
    const reconnectedSocket = MockWebSocket.instances[1];

    act(() => reconnectedSocket.dispatchEvent(new Event('open')));
    expect(result.current.status).toBe('connected');
  });
});
