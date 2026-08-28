export type RealtimeConnectionStatus = 'connecting' | 'connected' | 'reconnecting';

export interface RealtimeController {
  status: RealtimeConnectionStatus;
  reconnect: () => void;
}
