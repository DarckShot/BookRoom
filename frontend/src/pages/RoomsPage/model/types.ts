import type { Room } from '../../../types/room';

export type RoomsContentStatus = 'noOffice' | 'loading' | 'error' | 'empty' | 'ready';

export interface RoomsContentProps {
  status: RoomsContentStatus;
  rooms: Room[];
  search: string;
  onRetry: () => void;
  onReset: () => void;
}
