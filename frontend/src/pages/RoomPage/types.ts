import type { Booking } from '../../types/booking';

export type RoomPageStatus = 'loading' | 'error' | 'ready';
export type RoomScheduleStatus = 'loading' | 'error' | 'ready';

export interface RoomScheduleProps {
  bookings: Booking[];
  currentUserId: string;
  date: string;
  minDate: string;
  maxDate: string;
  timeZone: string;
  now: Date;
  status: RoomScheduleStatus;
  onDateChange: (date: string) => void;
  onRetry: () => void;
  onBook: () => void;
  onTimeSelect: (startTime: string) => void;
}
