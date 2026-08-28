import { createContext } from 'react';
import type { RealtimeController } from '../types/realtime';

const keepConnection = () => undefined;

export const RealtimeContext = createContext<RealtimeController>({
  status: 'connected',
  reconnect: keepConnection,
});
