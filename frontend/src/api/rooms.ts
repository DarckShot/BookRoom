import type { CollectionResponse } from '../types/api';
import type { Room } from '../types/room';
import { apiClient } from './client';

export interface RoomsQuery {
  officeId: string;
  minCapacity?: number;
  from?: string;
  to?: string;
}

export const getRooms = async (query: RoomsQuery) => {
  const response = await apiClient.get<CollectionResponse<Room>>('/rooms', { params: query });

  return response.data.items;
};
