import type { BookingPeriod, BookingsTab, BookingScope } from '../types/booking';

export const UPCOMING_BOOKINGS_TAB: BookingsTab = 'upcoming';
export const PAST_BOOKINGS_TAB: BookingsTab = 'past';
export const ALL_BOOKINGS_SCOPE: BookingScope = 'all';
export const DEFAULT_BOOKING_PERIOD: BookingPeriod = 'all';
export const BOOKING_PERIODS: BookingPeriod[] = [
  DEFAULT_BOOKING_PERIOD,
  'today',
  'seven-days',
  'thirty-days',
];
export const BOOKING_PERIOD_DAYS: Partial<Record<BookingPeriod, number>> = {
  'seven-days': 7,
  'thirty-days': 30,
};
export const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
export const BOOKING_TIME_ZONE_LABELS: Record<string, string> = {
  'Europe/Moscow': 'MSK',
};
