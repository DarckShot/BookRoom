import { ROOM_TIME_STEP_MINUTES } from '../constants/roomFilters';
import {
  DAY_AND_MONTH_FORMATTER,
  DEFAULT_DURATION_MINUTES,
  ISO_DATE_PATTERN,
  TIME_PATTERN,
  WEEKDAY_FORMATTER,
  WORKING_DAY_END_MINUTES,
  WORKING_DAY_START_MINUTES,
  ZONED_DATE_TIME_FORMATTERS,
} from './roomFilters.constants';
import { capitalize } from './string';

export interface RoomFilterDefaults {
  date: string;
  startTime: string;
  durationMinutes: number;
  minCapacity: number;
}

const padTimePart = (value: number) => String(value).padStart(2, '0');

const formatMinutesAsTime = (minutes: number) =>
  `${padTimePart(Math.floor(minutes / 60))}:${padTimePart(minutes % 60)}`;

export const isValidRoomStartTime = (value: string, min: string, max: string) => {
  const match = TIME_PATTERN.exec(value);

  if (!match) {
    return false;
  }

  const [, hours, minutes] = match;
  const numericHours = Number(hours);
  const numericMinutes = Number(minutes);

  return (
    numericHours <= 23 &&
    numericMinutes <= 59 &&
    numericMinutes % ROOM_TIME_STEP_MINUTES === 0 &&
    value >= min &&
    value <= max
  );
};

export const addDaysToIsoDate = (date: string, days: number) => {
  const value = new Date(`${date}T12:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);

  return value.toISOString().slice(0, 10);
};

const getZonedDateTimeFormatter = (timeZone: string) => {
  const cachedFormatter = ZONED_DATE_TIME_FORMATTERS.get(timeZone);

  if (cachedFormatter) {
    return cachedFormatter;
  }

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  ZONED_DATE_TIME_FORMATTERS.set(timeZone, formatter);

  return formatter;
};

const getZonedDateTimeParts = (date: Date, timeZone: string) => {
  const parts = getZonedDateTimeFormatter(timeZone).formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: getPart('year'),
    month: getPart('month'),
    day: getPart('day'),
    hour: getPart('hour'),
    minute: getPart('minute'),
    second: getPart('second'),
  };
};

export const getDefaultRoomFilters = (now: Date, timeZone: string): RoomFilterDefaults => {
  const officeDateTime = getZonedDateTimeParts(now, timeZone);
  let date = `${officeDateTime.year}-${padTimePart(officeDateTime.month)}-${padTimePart(officeDateTime.day)}`;
  let startMinutes = Math.floor((officeDateTime.hour * 60 + officeDateTime.minute) / 15) * 15 + 15;

  if (startMinutes < WORKING_DAY_START_MINUTES) {
    startMinutes = WORKING_DAY_START_MINUTES;
  }

  if (startMinutes + DEFAULT_DURATION_MINUTES > WORKING_DAY_END_MINUTES) {
    date = addDaysToIsoDate(date, 1);
    startMinutes = WORKING_DAY_START_MINUTES;
  }

  return {
    date,
    startTime: formatMinutesAsTime(startMinutes),
    durationMinutes: DEFAULT_DURATION_MINUTES,
    minCapacity: 4,
  };
};

export const getLatestStartTime = (durationMinutes: number) =>
  formatMinutesAsTime(WORKING_DAY_END_MINUTES - durationMinutes);

export const formatRoomFilterDate = (date: string) => {
  const value = new Date(`${date}T12:00:00.000Z`);
  const dayAndMonth = DAY_AND_MONTH_FORMATTER.format(value);
  const [day, ...monthParts] = dayAndMonth.split(' ');
  const month = monthParts.join(' ');
  const weekday = WEEKDAY_FORMATTER.format(value).replace('.', '');
  return `${day} ${capitalize(month)}, ${capitalize(weekday)}`;
};

export const formatDuration = (durationMinutes: number) => {
  if (durationMinutes < 60) {
    return `${durationMinutes} мин.`;
  }

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (minutes === 0) {
    return hours === 1 ? '1 час' : `${hours} часа`;
  }

  return `${hours} ч. ${minutes} мин.`;
};

interface RoomFilterIntervalInput {
  date: string;
  startTime: string;
  durationMinutes: number;
  timeZone: string;
}

export const getRoomFilterInterval = ({
  date,
  startTime,
  durationMinutes,
  timeZone,
}: RoomFilterIntervalInput) => {
  const dateMatch = ISO_DATE_PATTERN.exec(date);
  const timeMatch = TIME_PATTERN.exec(startTime);

  if (
    !dateMatch ||
    !timeMatch ||
    !Number.isFinite(durationMinutes) ||
    durationMinutes <= 0 ||
    durationMinutes % ROOM_TIME_STEP_MINUTES !== 0
  ) {
    return undefined;
  }

  const [, year, month, day] = dateMatch;
  const [, hour, minute] = timeMatch;
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const numericDay = Number(day);
  const numericHour = Number(hour);
  const numericMinute = Number(minute);

  if (numericHour > 23 || numericMinute > 59 || numericMinute % ROOM_TIME_STEP_MINUTES !== 0) {
    return undefined;
  }

  const localTimestamp = Date.UTC(
    numericYear,
    numericMonth - 1,
    numericDay,
    numericHour,
    numericMinute,
  );
  const normalizedLocalDate = new Date(localTimestamp);

  if (
    normalizedLocalDate.getUTCFullYear() !== numericYear ||
    normalizedLocalDate.getUTCMonth() !== numericMonth - 1 ||
    normalizedLocalDate.getUTCDate() !== numericDay
  ) {
    return undefined;
  }

  const zonedParts = getZonedDateTimeParts(new Date(localTimestamp), timeZone);
  const zonedTimestamp = Date.UTC(
    zonedParts.year,
    zonedParts.month - 1,
    zonedParts.day,
    zonedParts.hour,
    zonedParts.minute,
    zonedParts.second,
  );
  const startsAt = new Date(localTimestamp - (zonedTimestamp - localTimestamp));
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);

  return { from: startsAt.toISOString(), to: endsAt.toISOString() };
};
