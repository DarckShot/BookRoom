import type { RoomsQuery } from './rooms';
import type { RoomScheduleQuery } from './room';
import type { BookingsQuery } from './bookings';

export const queryKeys = {
  offices: ['offices'],
  currentUser: ['current-user'],
  roomsRoot: ['rooms'],
  rooms: (query?: RoomsQuery) => ['rooms', query],
  room: (roomId: string) => ['rooms', 'detail', roomId],
  roomSchedule: (roomId: string, query?: RoomScheduleQuery) => ['rooms', 'schedule', roomId, query],
  bookingsRoot: ['bookings'],
  bookings: (query: BookingsQuery) => ['bookings', query],
};
