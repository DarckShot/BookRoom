import { describe, expect, it } from 'vitest';
import { PAST_BOOKINGS_TAB, UPCOMING_BOOKINGS_TAB } from '../../constants/bookings';
import {
  filterBookings,
  formatBookingConfirmationDate,
  formatBookingTimeRange,
  formatBookingTimeZone,
  formatMeetingCount,
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
    const laterFutureBooking = createBookingFixture({
      id: 'later-future',
      startsAt: '2026-08-31T08:00:00.000Z',
      endsAt: '2026-08-31T09:00:00.000Z',
    });
    const earlierPastBooking = createBookingFixture({
      id: 'earlier-past',
      startsAt: '2026-08-27T12:00:00.000Z',
      endsAt: '2026-08-27T13:00:00.000Z',
    });

    expect(isUpcomingBooking(futureBooking, now)).toBe(true);
    expect(isUpcomingBooking(pastBooking, now)).toBe(false);
    expect(
      filterBookings(
        [pastBooking, laterFutureBooking, futureBooking],
        UPCOMING_BOOKINGS_TAB,
        'all',
        now,
      ),
    ).toEqual([futureBooking, laterFutureBooking]);
    expect(
      filterBookings(
        [earlierPastBooking, pastBooking, futureBooking],
        PAST_BOOKINGS_TAB,
        'all',
        now,
      ),
    ).toEqual([pastBooking, earlierPastBooking]);
  });

  it('фильтрует выбранный период в локальной дате офиса', () => {
    expect(filterBookings([futureBooking], UPCOMING_BOOKINGS_TAB, 'today', now)).toEqual([]);
    expect(
      filterBookings(
        [createBookingFixture({ startsAt: '2026-08-29T12:00:00.000Z' })],
        UPCOMING_BOOKINGS_TAB,
        'today',
        now,
      ),
    ).toHaveLength(1);
    expect(filterBookings([futureBooking], UPCOMING_BOOKINGS_TAB, 'seven-days', now)).toEqual([
      futureBooking,
    ]);
    expect(filterBookings([pastBooking], PAST_BOOKINGS_TAB, 'seven-days', now)).toEqual([
      pastBooking,
    ]);
  });

  it('форматирует время в часовом поясе офиса', () => {
    expect(formatBookingTimeRange(futureBooking)).toBe('11:00 - 12:00');
    expect(formatBookingConfirmationDate(futureBooking)).toBe(
      'Воскресенье, 30 августа, 11:00 - 12:00',
    );
    expect(formatBookingTimeZone('Europe/Moscow')).toBe('MSK');
    expect(formatBookingTimeZone('Europe/London')).toBeTruthy();
    expect(formatMeetingCount(4)).toBe('4 встречи');
    expect(formatMeetingCount(5)).toBe('5 встреч');
  });
});
