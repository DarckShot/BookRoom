import { queryOptions } from '@tanstack/react-query';
import { getOffices } from './offices';
import { queryKeys } from './queryKeys';
import { getRooms, type RoomsQuery } from './rooms';

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
