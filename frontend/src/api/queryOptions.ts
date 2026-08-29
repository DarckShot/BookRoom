import { queryOptions } from '@tanstack/react-query';
import { getOffices } from './offices';
import { queryKeys } from './queryKeys';
import { getRoom, getRoomSchedule, type RoomScheduleQuery } from './room';
import { getRooms, type RoomsQuery } from './rooms';
import { getCurrentUser } from './users';

export const officesQueryOptions = queryOptions({
  queryKey: queryKeys.offices,
  queryFn: getOffices,
});

export const roomsQueryOptions = (query?: RoomsQuery) =>
  queryOptions({
    queryKey: queryKeys.rooms(query),
    queryFn: () => (query ? getRooms(query) : Promise.resolve([])),
    enabled: query !== undefined,
  });

export const currentUserQueryOptions = queryOptions({
  queryKey: queryKeys.currentUser,
  queryFn: getCurrentUser,
});

export const roomQueryOptions = (roomId: string) =>
  queryOptions({
    queryKey: queryKeys.room(roomId),
    queryFn: () => getRoom(roomId),
    enabled: roomId.length > 0,
  });

export const roomScheduleQueryOptions = (roomId: string, query?: RoomScheduleQuery) =>
  queryOptions({
    queryKey: queryKeys.roomSchedule(roomId, query),
    queryFn: () => (query ? getRoomSchedule(roomId, query) : Promise.resolve([])),
    enabled: roomId.length > 0 && query !== undefined,
  });
