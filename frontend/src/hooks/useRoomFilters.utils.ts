import { ROOM_WORKING_DAY_START } from '../constants/roomFilters';
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
