import type { SelectOption } from '../types/select';
import { BOOKING_TIME_STEP_MINUTES, BOOKING_WORKDAY_START } from './booking';

export const ROOM_TIME_STEP_MINUTES = BOOKING_TIME_STEP_MINUTES;
export const ROOM_WORKING_DAY_START = BOOKING_WORKDAY_START;

export const ROOM_FILTER_PARAMS = {
  officeId: 'officeId',
  date: 'date',
  startTime: 'start',
  duration: 'duration',
  minCapacity: 'minCapacity',
};

export const ROOM_FILTER_PARAM_NAMES = [
  ROOM_FILTER_PARAMS.date,
  ROOM_FILTER_PARAMS.startTime,
  ROOM_FILTER_PARAMS.duration,
  ROOM_FILTER_PARAMS.minCapacity,
];

export const DURATION_OPTIONS: readonly SelectOption[] = [
  { value: '15', label: '15 мин' },
  { value: '30', label: '30 мин' },
  { value: '45', label: '45 мин' },
  { value: '60', label: '1 час' },
  { value: '75', label: '1 ч 15 мин' },
  { value: '90', label: '1 ч 30 мин' },
  { value: '105', label: '1 ч 45 мин' },
  { value: '120', label: '2 часа' },
];

export const CAPACITY_OPTIONS: readonly SelectOption[] = [2, 4, 6, 8, 10, 12].map((capacity) => ({
  value: String(capacity),
  label: `${capacity} чел.`,
  displayLabel: `Мин. ${capacity} чел.`,
}));
