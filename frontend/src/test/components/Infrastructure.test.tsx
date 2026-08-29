// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, renderHook, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppProviders } from '../../components/app/AppProviders/AppProviders';
import { RealtimeProvider } from '../../components/app/RealtimeProvider/RealtimeProvider';
import { PageShell } from '../../components/ui/PageShell/PageShell';
import { RealtimeContext } from '../../contexts/realtime';
import { useRealtime } from '../../hooks/useRealtime';
import { useRealtimeConnection } from '../../hooks/useRealtimeConnection';
import type { RealtimeController } from '../../types/realtime';

vi.mock('../../hooks/useRealtimeConnection', () => ({
  useRealtimeConnection: vi.fn(() => ({ status: 'connected', reconnect: vi.fn() })),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('application infrastructure', () => {
  it('собирает общие providers и отображает дочерний маршрут', () => {
    render(
      <AppProviders>
        <p>Приложение готово</p>
      </AppProviders>,
    );

    expect(screen.getByText('Приложение готово')).toBeVisible();
    expect(useRealtimeConnection).toHaveBeenCalled();
  });

  it('передаёт realtime controller через provider', () => {
    const reconnect = vi.fn();
    vi.mocked(useRealtimeConnection).mockReturnValueOnce({ status: 'reconnecting', reconnect });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RealtimeProvider>{children}</RealtimeProvider>
    );
    const { result } = renderHook(useRealtime, { wrapper });

    expect(result.current).toEqual({ status: 'reconnecting', reconnect });
  });

  it('предоставляет безопасное значение realtime по умолчанию', () => {
    const { result } = renderHook(useRealtime);

    expect(result.current.status).toBe('connected');
    expect(() => result.current.reconnect()).not.toThrow();
  });

  it('рендерит семантическую оболочку страницы', () => {
    render(
      <PageShell>
        <h1>Страница</h1>
      </PageShell>,
    );

    expect(screen.getByRole('main')).toHaveTextContent('Страница');
  });

  it('позволяет передать controller напрямую через контекст', () => {
    const controller: RealtimeController = { status: 'connected', reconnect: vi.fn() };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RealtimeContext.Provider value={controller}>{children}</RealtimeContext.Provider>
    );
    const { result } = renderHook(useRealtime, { wrapper });

    result.current.reconnect();
    expect(controller.reconnect).toHaveBeenCalledOnce();
  });
});
