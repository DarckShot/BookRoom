import type { ReactNode } from 'react';
import { RealtimeContext } from '../../../contexts/realtime';
import { useRealtimeConnection } from '../../../hooks/useRealtimeConnection';

interface RealtimeProviderProps {
  children: ReactNode;
}

export const RealtimeProvider = ({ children }: RealtimeProviderProps) => {
  const controller = useRealtimeConnection();

  return <RealtimeContext.Provider value={controller}>{children}</RealtimeContext.Provider>;
};
