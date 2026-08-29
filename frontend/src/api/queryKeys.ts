import type { RoomsQuery } from './rooms';
import type { RoomScheduleQuery } from './room';
import type { BookingsQuery } from './bookings';

export const queryKeys = {
  offices: ['offices'],
  currentUser: ['current-user'],
  roomsRoot: ['rooms'],
  roomListsRoot: ['rooms', 'list'],
  rooms: (query?: RoomsQuery) => ['rooms', 'list', query],
  room: (roomId: string) => ['rooms', 'detail', roomId],
  roomSchedulesRoot: ['rooms', 'schedule'],
  roomSchedule: (roomId: string, query?: RoomScheduleQuery) => ['rooms', 'schedule', roomId, query],
  bookingsRoot: ['bookings'],
  bookings: (query: BookingsQuery) => ['bookings', query],
};
