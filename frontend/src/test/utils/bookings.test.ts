import { describe, expect, it } from 'vitest';
import { PAST_BOOKINGS_TAB, UPCOMING_BOOKINGS_TAB } from '../../constants/bookings';
import {
  filterBookings,
  formatBookingConfirmationDate,
  formatBookingTimeRange,
  isUpcomingBooking,
} from '../../utils/bookings';
import { createBookingFixture } from '../fixtures/booking';

const now = new Date('2026-08-29T09:00:00.000Z');
const futureBooking = createBookingFixture({
  id: 'future',
  startsAt: '2026-08-30T08:00:00.000Z',
  endsAt: '2026-08-30T09:00:00.000Z',
});
const pastBooking = createBookingFixture({
  id: 'past',
  startsAt: '2026-08-28T12:00:00.000Z',
  endsAt: '2026-08-28T13:00:00.000Z',
});

describe('bookings utilities', () => {
  it('разделяет бронирования относительно текущего времени', () => {
    expect(isUpcomingBooking(futureBooking, now)).toBe(true);
    expect(isUpcomingBooking(pastBooking, now)).toBe(false);
    expect(filterBookings([pastBooking, futureBooking], UPCOMING_BOOKINGS_TAB, 'all', now)).toEqual(
      [futureBooking],
    );
    expect(filterBookings([pastBooking, futureBooking], PAST_BOOKINGS_TAB, 'all', now)).toEqual([
      pastBooking,
    ]);
  });

  it('фильтрует выбранный период в локальной дате офиса', () => {
    expect(filterBookings([futureBooking], UPCOMING_BOOKINGS_TAB, 'today', now)).toEqual([]);
    expect(filterBookings([futureBooking], UPCOMING_BOOKINGS_TAB, 'seven-days', now)).toEqual([
      futureBooking,
    ]);
  });

  it('форматирует время в часовом поясе офиса', () => {
    expect(formatBookingTimeRange(futureBooking)).toBe('11:00 - 12:00');
    expect(formatBookingConfirmationDate(futureBooking)).toBe(
      'Воскресенье, 30 августа, 11:00 - 12:00',
    );
  });
});
