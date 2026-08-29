import type { Office } from './office';
import type { RoomDetails } from './room';
import type { User } from './user';

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  title: string;
  comment: string | null;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  room: RoomDetails;
  office: Office;
  owner: User;
}

export interface CreateBookingInput {
  roomId: string;
  title: string;
  comment: string | null;
  startsAt: string;
  endsAt: string;
}

export type BookingScope = 'upcoming' | 'past' | 'all';
export type BookingsTab = Exclude<BookingScope, 'all'>;
export type BookingPeriod = 'all' | 'today' | 'seven-days' | 'thirty-days';
