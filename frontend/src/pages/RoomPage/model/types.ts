import type { CreatedBookingSeries } from '../../../types/booking';

export type RoomPageStatus = 'loading' | 'error' | 'ready';

export type BookingFlowState =
  | { status: 'idle' }
  | { status: 'booking'; startTime?: string }
  | { status: 'created'; series: CreatedBookingSeries };
