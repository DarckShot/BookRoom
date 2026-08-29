import type { QueryStatus } from '@tanstack/react-query';
import {
  BOOKING_PERIODS,
  DEFAULT_BOOKING_PERIOD,
  PAST_BOOKINGS_TAB,
  UPCOMING_BOOKINGS_TAB,
} from '../../../constants/bookings';
import type { BookingPeriod, BookingsTab } from '../../../types/booking';
import type { Office } from '../../../types/office';
import type { SelectOption } from '../../../types/select';
import { ALL_OFFICES_OPTION } from './constants';
import type { BookingsPageStatus } from './types';

export const getBookingsPageStatus = (
  bookingsStatus: QueryStatus,
  officesStatus: QueryStatus,
): BookingsPageStatus => {
  if (bookingsStatus === 'error' || officesStatus === 'error') {
    return 'error';
  }

  return bookingsStatus === 'pending' || officesStatus === 'pending' ? 'loading' : 'ready';
};

export const parseBookingsTab = (value: string | null): BookingsTab =>
  value === PAST_BOOKINGS_TAB ? PAST_BOOKINGS_TAB : UPCOMING_BOOKINGS_TAB;

export const parseBookingPeriod = (value: string | null): BookingPeriod =>
  BOOKING_PERIODS.find((period) => period === value) ?? DEFAULT_BOOKING_PERIOD;

export const createOfficeOptions = (offices: Office[]): SelectOption[] => [
  ALL_OFFICES_OPTION,
  ...offices.map((office) => ({ value: office.id, label: office.name })),
];
