import type { RoomsQuery } from './rooms';
import type { RoomScheduleQuery } from './room';

export const queryKeys = {
  offices: ['offices'],
  currentUser: ['current-user'],
  roomsRoot: ['rooms'],
  rooms: (query?: RoomsQuery) => ['rooms', query],
  room: (roomId: string) => ['rooms', 'detail', roomId],
  roomSchedule: (roomId: string, query?: RoomScheduleQuery) => ['rooms', 'schedule', roomId, query],
};
