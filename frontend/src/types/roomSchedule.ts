import type { Booking } from './booking';

export interface BookingPlacement {
  booking: Booking;
  top: number;
  height: number;
}

export interface AvailableRoomScheduleSlot {
  startTime: string;
  top: number;
  height: number;
}
