import type { Booking, CreateBookingInput } from '../types/booking';
import { apiClient } from './client';

export const createBooking = async (input: CreateBookingInput) => {
  const response = await apiClient.post<Booking>('/bookings', input);

  return response.data;
};
