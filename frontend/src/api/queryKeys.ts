import type { RoomsQuery } from './rooms';

export const queryKeys = {
  offices: ['offices'],
  roomsRoot: ['rooms'],
  rooms: (query?: RoomsQuery) => ['rooms', query],
};
