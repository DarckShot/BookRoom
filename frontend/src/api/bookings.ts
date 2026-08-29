import type { CollectionResponse } from '../types/api';
import type { Booking, BookingScope, CreateBookingInput } from '../types/booking';
import { apiClient } from './client';

export interface BookingsQuery {
  scope: BookingScope;
  officeId?: string;
}

export const getBookings = async (query: BookingsQuery) => {
  const response = await apiClient.get<CollectionResponse<Booking>>('/bookings', {
    params: query,
  });

  return response.data.items;
};

export const createBooking = async (input: CreateBookingInput) => {
  const response = await apiClient.post<Booking>('/bookings', input);

  return response.data;
};

export const createBookingSeries = async (inputs: CreateBookingInput[]) => {
  const createdBookings: Booking[] = [];

  try {
    for (const input of inputs) {
      createdBookings.push(await createBooking(input));
    }
  } catch (error) {
    await Promise.allSettled(createdBookings.map((booking) => cancelBooking(booking.id)));
    throw error;
  }

  return createdBookings;
};

export const cancelBooking = async (bookingId: string) => {
  await apiClient.delete(`/bookings/${bookingId}`);
};
