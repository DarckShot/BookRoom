import type { SelectOption } from '../../../types/select';
import {
  BOOKING_DEFAULT_DURATION_MINUTES,
  BOOKING_LATEST_START,
  BOOKING_MIN_DURATION_MINUTES,
  BOOKING_TIME_STEP_MINUTES,
  BOOKING_WORKDAY_END_MINUTES,
  BOOKING_WORKDAY_START,
} from '../../../constants/booking';
import {
  formatDuration,
  formatMinutesAsTime,
  getDefaultRoomFilters,
  getRoomFilterInterval,
  getTimeAsMinutes,
  isValidRoomStartTime,
} from '../../../utils/roomFilters';
import { formatRoomScheduleDate } from '../../../utils/roomSchedule';
import { ROOM_FILTER_PARAMS } from '../../../constants/roomFilters';
import type { BookingFormValues, BookingIntervalValues } from './types';

interface BookingDefaultsInput {
  date: string;
  initialStartTime?: string;
  search: string;
  timeZone: string;
  now: Date;
}

export const getBookingFormDefaults = ({
  date,
  initialStartTime,
  search,
  timeZone,
  now,
}: BookingDefaultsInput): BookingFormValues => {
  const filterDefaults = getDefaultRoomFilters(now, timeZone);
  const searchParams = new URLSearchParams(search);
  const selectedDate = date >= filterDefaults.date ? date : filterDefaults.date;
  const minimumStartTime =
    selectedDate === filterDefaults.date ? filterDefaults.startTime : BOOKING_WORKDAY_START;
  const requestedStartTime =
    initialStartTime ?? searchParams.get(ROOM_FILTER_PARAMS.startTime) ?? '';
  const startTime = isValidRoomStartTime(requestedStartTime, minimumStartTime, BOOKING_LATEST_START)
    ? requestedStartTime
    : minimumStartTime;
  const startMinutes = getTimeAsMinutes(startTime) ?? BOOKING_WORKDAY_END_MINUTES;
  const maximumDuration = BOOKING_WORKDAY_END_MINUTES - startMinutes;
  const requestedDuration = Number(searchParams.get(ROOM_FILTER_PARAMS.duration));
  const durationMinutes =
    Number.isInteger(requestedDuration) &&
    requestedDuration >= BOOKING_MIN_DURATION_MINUTES &&
    requestedDuration % BOOKING_TIME_STEP_MINUTES === 0 &&
    requestedDuration <= maximumDuration
      ? requestedDuration
      : Math.min(BOOKING_DEFAULT_DURATION_MINUTES, maximumDuration);

  return {
    title: '',
    date: selectedDate,
    startTime,
    durationMinutes,
    comment: '',
  };
};

export const getBookingDurationOptions = (startTime: string): readonly SelectOption[] => {
  const startMinutes = getTimeAsMinutes(startTime) ?? BOOKING_WORKDAY_END_MINUTES;
  const maximumDuration = Math.max(0, BOOKING_WORKDAY_END_MINUTES - startMinutes);
  const optionCount = Math.floor(maximumDuration / BOOKING_TIME_STEP_MINUTES);

  return Array.from({ length: optionCount }, (_, index) => {
    const durationMinutes = (index + 1) * BOOKING_TIME_STEP_MINUTES;
    const endsAt = formatMinutesAsTime(startMinutes + durationMinutes);

    return {
      value: String(durationMinutes),
      label: `${formatDuration(durationMinutes)} (до ${endsAt})`,
    };
  });
};

export const getBookingEndTime = (startTime: string, durationMinutes: number) => {
  const startMinutes = getTimeAsMinutes(startTime);

  return startMinutes === undefined ? '—:—' : formatMinutesAsTime(startMinutes + durationMinutes);
};

export const formatBookingSummary = (values: BookingIntervalValues) =>
  `Бронирование на ${formatRoomScheduleDate(values.date)}, ${values.startTime} - ${getBookingEndTime(values.startTime, values.durationMinutes)} (${formatDuration(values.durationMinutes)})`;

export const createBookingInterval = (values: BookingIntervalValues, timeZone: string) =>
  getRoomFilterInterval({
    date: values.date,
    startTime: values.startTime,
    durationMinutes: values.durationMinutes,
    timeZone,
  });
