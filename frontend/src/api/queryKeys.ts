import type { RoomsQuery } from './rooms';

export const queryKeys = {
  offices: ['offices'],
  rooms: (query?: RoomsQuery) => ['rooms', query],
};
