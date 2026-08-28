import type { Room } from '../../types/room';
import type { RealtimeConnectionStatus } from '../../types/realtime';

export type RoomsContentStatus = 'noOffice' | 'loading' | 'error' | 'empty' | 'ready';

export interface RoomsContentProps {
  status: RoomsContentStatus;
  rooms: Room[];
  search: string;
  connectionStatus: RealtimeConnectionStatus;
  onRetry: () => void;
  onReset: () => void;
}
