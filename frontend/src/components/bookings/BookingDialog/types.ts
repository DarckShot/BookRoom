import type { Booking } from '../../../types/booking';
import type { Room } from '../../../types/room';
import { BOOKING_CONFLICT_VIEW, BOOKING_FORM_VIEW } from './constants';

export type BookingDialogView = typeof BOOKING_FORM_VIEW | typeof BOOKING_CONFLICT_VIEW;

export interface BookingIntervalValues {
  date: string;
  startTime: string;
  durationMinutes: number;
}

export interface BookingFormValues extends BookingIntervalValues {
  title: string;
  comment: string;
}

export interface BookingDialogProps {
  room: Room;
  selectedDate: string;
  initialStartTime?: string;
  search: string;
  onClose: () => void;
  onCreated: (booking: Booking) => void;
}
