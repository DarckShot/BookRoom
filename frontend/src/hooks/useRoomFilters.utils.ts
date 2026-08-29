import { ROOM_FILTER_PARAMS, ROOM_WORKING_DAY_START } from '../constants/roomFilters';
import type { RoomFilterValues } from '../types/roomFilters';
import { isValidRoomStartTime } from '../utils/roomFilters';

export const parsePositiveInteger = (value: string | null, fallback: number) => {
  const parsedValue = Number(value ?? fallback);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

export const parseRoomStartTime = (value: string | null, fallback: string, max: string) =>
  value !== null && isValidRoomStartTime(value, ROOM_WORKING_DAY_START, max) ? value : fallback;

export const updateSearchParam = (searchParams: URLSearchParams, name: string, value: string) => {
  const nextSearchParams = new URLSearchParams(searchParams);

  if (value) {
    nextSearchParams.set(name, value);
  } else {
    nextSearchParams.delete(name);
  }

  return nextSearchParams;
};

export const createRoomFilterSearch = (
  searchParams: URLSearchParams,
  officeId: string | undefined,
  values: RoomFilterValues,
) => {
  const normalizedSearchParams = new URLSearchParams(searchParams);

  if (officeId) {
    normalizedSearchParams.set(ROOM_FILTER_PARAMS.officeId, officeId);
  }

  normalizedSearchParams.set(ROOM_FILTER_PARAMS.date, values.date);
  normalizedSearchParams.set(ROOM_FILTER_PARAMS.startTime, values.startTime);
  normalizedSearchParams.set(ROOM_FILTER_PARAMS.duration, String(values.durationMinutes));
  normalizedSearchParams.set(ROOM_FILTER_PARAMS.minCapacity, String(values.minCapacity));

  return normalizedSearchParams.toString();
};
