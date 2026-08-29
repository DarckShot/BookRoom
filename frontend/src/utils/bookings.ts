import {
  BOOKING_PERIOD_DAYS,
  BOOKING_TIME_ZONE_LABELS,
  MILLISECONDS_PER_DAY,
  UPCOMING_BOOKINGS_TAB,
} from '../constants/bookings';
import type { Booking, BookingPeriod, BookingsTab } from '../types/booking';
import { capitalize } from './string';
import { getIsoDateInTimeZone } from './roomFilters';

interface BookingFormatters {
  month: Intl.DateTimeFormat;
  day: Intl.DateTimeFormat;
  time: Intl.DateTimeFormat;
  confirmationDate: Intl.DateTimeFormat;
}

const bookingFormatters = new Map<string, BookingFormatters>();

const getBookingFormatters = (timeZone: string) => {
  const cachedFormatters = bookingFormatters.get(timeZone);

  if (cachedFormatters) {
    return cachedFormatters;
  }

  const formatters: BookingFormatters = {
    month: new Intl.DateTimeFormat('ru-RU', { timeZone, month: 'long' }),
    day: new Intl.DateTimeFormat('ru-RU', { timeZone, day: 'numeric' }),
    time: new Intl.DateTimeFormat('ru-RU', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }),
    confirmationDate: new Intl.DateTimeFormat('ru-RU', {
      timeZone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }),
  };
  bookingFormatters.set(timeZone, formatters);

  return formatters;
};

export const isUpcomingBooking = (booking: Booking, now: Date) =>
  new Date(booking.startsAt).getTime() > now.getTime();

const isBookingInPeriod = (
  booking: Booking,
  period: BookingPeriod,
  now: Date,
  tab: BookingsTab,
) => {
  if (period === 'all') {
    return true;
  }

  const startsAt = new Date(booking.startsAt);

  if (period === 'today') {
    return (
      getIsoDateInTimeZone(startsAt, booking.office.timezone) ===
      getIsoDateInTimeZone(now, booking.office.timezone)
    );
  }

  const periodDays = BOOKING_PERIOD_DAYS[period];

  if (periodDays === undefined) {
    return true;
  }

  const difference =
    tab === UPCOMING_BOOKINGS_TAB
      ? startsAt.getTime() - now.getTime()
      : now.getTime() - startsAt.getTime();

  return difference <= periodDays * MILLISECONDS_PER_DAY;
};

export const filterBookings = (
  bookings: Booking[],
  tab: BookingsTab,
  period: BookingPeriod,
  now: Date,
) =>
  bookings
    .filter((booking) => isUpcomingBooking(booking, now) === (tab === UPCOMING_BOOKINGS_TAB))
    .filter((booking) => isBookingInPeriod(booking, period, now, tab))
    .toSorted((left, right) => {
      const direction = tab === UPCOMING_BOOKINGS_TAB ? 1 : -1;
      return direction * (Date.parse(left.startsAt) - Date.parse(right.startsAt));
    });

export const formatBookingMonth = (booking: Booking) =>
  getBookingFormatters(booking.office.timezone)
    .month.format(new Date(booking.startsAt))
    .toUpperCase();

export const formatBookingDay = (booking: Booking) =>
  getBookingFormatters(booking.office.timezone).day.format(new Date(booking.startsAt));

export const formatBookingTimeRange = (booking: Booking) => {
  const formatter = getBookingFormatters(booking.office.timezone).time;

  return `${formatter.format(new Date(booking.startsAt))} - ${formatter.format(
    new Date(booking.endsAt),
  )}`;
};

export const formatBookingTimeZone = (timeZone: string) => {
  const configuredLabel = BOOKING_TIME_ZONE_LABELS[timeZone];

  if (configuredLabel) {
    return configuredLabel;
  }

  const name = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'short',
  })
    .formatToParts(new Date())
    .find((part) => part.type === 'timeZoneName')?.value;

  return name ?? timeZone;
};

export const formatBookingConfirmationDate = (booking: Booking) => {
  const formatter = getBookingFormatters(booking.office.timezone).confirmationDate;

  return `${capitalize(formatter.format(new Date(booking.startsAt)))}, ${formatBookingTimeRange(
    booking,
  )}`;
};

export const formatMeetingCount = (count: number) => `${count} ${count < 5 ? 'встречи' : 'встреч'}`;
