import type { Booking } from '../types/booking';
import type { AvailableRoomScheduleSlot, BookingPlacement } from '../types/roomSchedule';
import {
  BOOKING_TIME_STEP_MINUTES,
  BOOKING_WORKDAY_END,
  BOOKING_WORKDAY_END_MINUTES,
  BOOKING_WORKDAY_DURATION_MINUTES,
  BOOKING_WORKDAY_START,
  BOOKING_WORKDAY_START_MINUTES,
} from '../constants/booking';
import { capitalize } from './string';
import {
  formatMinutesAsTime,
  getDateTimePartsInTimeZone,
  getDefaultRoomFilters,
  getRoomFilterInterval,
} from './roomFilters';
import {
  ROOM_SCHEDULE_DATE_FORMATTER,
  ROOM_SCHEDULE_DATE_PATTERN,
  ROOM_SCHEDULE_DAY_DURATION_MINUTES,
} from './roomSchedule.constants';

export const getRoomScheduleInterval = (date: string, timeZone: string) =>
  getRoomFilterInterval({
    date,
    startTime: '00:00',
    durationMinutes: ROOM_SCHEDULE_DAY_DURATION_MINUTES,
    timeZone,
  });

export const isValidRoomScheduleDate = (date: string | null): date is string => {
  if (!date || !ROOM_SCHEDULE_DATE_PATTERN.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T12:00:00.000Z`);

  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date;
};

export const formatRoomScheduleDate = (date: string) =>
  capitalize(ROOM_SCHEDULE_DATE_FORMATTER.format(new Date(`${date}T12:00:00.000Z`)));

export const getRoomScheduleHourPosition = (hour: number) =>
  `${((hour * 60 - BOOKING_WORKDAY_START_MINUTES) / BOOKING_WORKDAY_DURATION_MINUTES) * 100}%`;

const getMinutesInTimeZone = (timestamp: string, timeZone: string) => {
  const parts = getDateTimePartsInTimeZone(new Date(timestamp), timeZone);

  return parts.hour * 60 + parts.minute;
};

export const getAvailableRoomScheduleSlots = (
  bookings: Booking[],
  timeZone: string,
  minimumStartTime = BOOKING_WORKDAY_START,
): AvailableRoomScheduleSlot[] => {
  const slotCount = BOOKING_WORKDAY_DURATION_MINUTES / BOOKING_TIME_STEP_MINUTES;
  const slotHeight = 100 / slotCount;
  const occupiedIntervals = bookings.map((booking) => ({
    startsAt: getMinutesInTimeZone(booking.startsAt, timeZone),
    endsAt: getMinutesInTimeZone(booking.endsAt, timeZone),
  }));

  return Array.from({ length: slotCount }, (_, index) => {
    const startsAt = BOOKING_WORKDAY_START_MINUTES + index * BOOKING_TIME_STEP_MINUTES;
    const startTime = formatMinutesAsTime(startsAt);
    const endsAt = startsAt + BOOKING_TIME_STEP_MINUTES;
    const isOccupied = occupiedIntervals.some(
      (booking) => booking.startsAt < endsAt && booking.endsAt > startsAt,
    );

    return isOccupied || startTime < minimumStartTime
      ? []
      : [
          {
            startTime,
            top: index * slotHeight,
            height: slotHeight,
          },
        ];
  }).flat();
};

export const getBookingPlacement = (
  booking: Booking,
  timeZone: string,
): BookingPlacement | undefined => {
  const startsAt = Math.max(
    getMinutesInTimeZone(booking.startsAt, timeZone),
    BOOKING_WORKDAY_START_MINUTES,
  );
  const endsAt = Math.min(
    getMinutesInTimeZone(booking.endsAt, timeZone),
    BOOKING_WORKDAY_END_MINUTES,
  );

  if (endsAt <= startsAt) {
    return undefined;
  }

  return {
    booking,
    top: ((startsAt - BOOKING_WORKDAY_START_MINUTES) / BOOKING_WORKDAY_DURATION_MINUTES) * 100,
    height: ((endsAt - startsAt) / BOOKING_WORKDAY_DURATION_MINUTES) * 100,
  };
};

export const getMinimumBookingStartTime = (date: string, now: Date, timeZone: string) => {
  const defaults = getDefaultRoomFilters(now, timeZone);

  if (date < defaults.date) {
    return BOOKING_WORKDAY_END;
  }

  return date === defaults.date ? defaults.startTime : BOOKING_WORKDAY_START;
};
