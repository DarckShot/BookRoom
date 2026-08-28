import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { RealtimeContext } from '../../contexts/realtime';
import type { RealtimeConnectionStatus } from '../../types/realtime';

interface RenderAppOptions {
  connectionStatus?: RealtimeConnectionStatus;
  onReconnect?: () => void;
}

const keepConnection = () => undefined;

export const renderApp = (path: string, options: RenderAppOptions = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const realtimeController = {
    status: options.connectionStatus ?? 'connected',
    reconnect: options.onReconnect ?? keepConnection,
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <RealtimeContext.Provider value={realtimeController}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </RealtimeContext.Provider>
    </QueryClientProvider>,
  );
};
