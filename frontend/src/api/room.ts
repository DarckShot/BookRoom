import type { CollectionResponse } from '../types/api';
import type { Booking } from '../types/booking';
import type { Room } from '../types/room';
import { apiClient } from './client';

export interface RoomScheduleQuery {
  from: string;
  to: string;
}

export const getRoom = async (roomId: string) => {
  const response = await apiClient.get<Room>(`/rooms/${roomId}`);

  return response.data;
};

export const getRoomSchedule = async (roomId: string, query: RoomScheduleQuery) => {
  const response = await apiClient.get<CollectionResponse<Booking>>(`/rooms/${roomId}/bookings`, {
    params: query,
  });

  return response.data.items;
};
