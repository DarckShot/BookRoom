import type { Booking } from '../../../types/booking';

export interface BookingSuccessToastProps {
  booking: Booking;
  onClose: () => void;
}
