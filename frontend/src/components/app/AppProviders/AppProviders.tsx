import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from '../../../api/queryClient';
import { RealtimeProvider } from '../RealtimeProvider/RealtimeProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RealtimeProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </RealtimeProvider>
    </QueryClientProvider>
  </StrictMode>
);
