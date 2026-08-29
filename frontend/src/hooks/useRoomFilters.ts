import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { RoomsQuery } from '../api/rooms';
import { BOOKING_MAX_ADVANCE_DAYS } from '../constants/booking';
import { ROOM_FILTER_PARAMS, ROOM_TIME_STEP_MINUTES } from '../constants/roomFilters';
import type { RoomFiltersController, RoomFilterValues } from '../types/roomFilters';
import {
  addDaysToIsoDate,
  getDefaultRoomFilters,
  getLatestStartTime,
  getRoomFilterInterval,
} from '../utils/roomFilters';
import {
  createRoomFilterSearch,
  parsePositiveInteger,
  parseRoomStartTime,
  updateSearchParam,
} from './useRoomFilters.utils';

interface UseRoomFiltersInput {
  officeId?: string;
  officeTimezone?: string;
}

export const useRoomFilters = ({ officeId, officeTimezone }: UseRoomFiltersInput) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaults = useMemo(
    () => (officeTimezone ? getDefaultRoomFilters(new Date(), officeTimezone) : undefined),
    [officeTimezone],
  );
  const durationMinutes = parsePositiveInteger(
    searchParams.get(ROOM_FILTER_PARAMS.duration),
    defaults?.durationMinutes ?? 0,
  );
  const latestStartTime = getLatestStartTime(durationMinutes || ROOM_TIME_STEP_MINUTES);
  const rawStartTime = searchParams.get(ROOM_FILTER_PARAMS.startTime);
  const startTime = parseRoomStartTime(rawStartTime, defaults?.startTime ?? '', latestStartTime);
  const values: RoomFilterValues = {
    date: searchParams.get(ROOM_FILTER_PARAMS.date) ?? defaults?.date ?? '',
    startTime,
    durationMinutes,
    minCapacity: parsePositiveInteger(
      searchParams.get(ROOM_FILTER_PARAMS.minCapacity),
      defaults?.minCapacity ?? 0,
    ),
  };

  useEffect(() => {
    if (rawStartTime !== null && rawStartTime !== startTime) {
      setSearchParams(updateSearchParam(searchParams, ROOM_FILTER_PARAMS.startTime, startTime), {
        replace: true,
      });
    }
  }, [rawStartTime, searchParams, setSearchParams, startTime]);

  const setParam = (name: string, value: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (value) {
      nextSearchParams.set(name, value);
    } else {
      nextSearchParams.delete(name);
    }

    setSearchParams(nextSearchParams, { replace: true });
  };

  const setDuration = (value: string) => {
    const latestStartTime = getLatestStartTime(Number(value));
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(ROOM_FILTER_PARAMS.duration, value);

    if (values.startTime > latestStartTime) {
      nextSearchParams.set(ROOM_FILTER_PARAMS.startTime, latestStartTime);
    }

    setSearchParams(nextSearchParams, { replace: true });
  };

  const interval = officeTimezone
    ? getRoomFilterInterval({
        date: values.date,
        startTime: values.startTime,
        durationMinutes: values.durationMinutes,
        timeZone: officeTimezone,
      })
    : undefined;
  const minCapacity = values.minCapacity || 4;
  const roomsQuery =
    officeId && interval
      ? ({ officeId, minCapacity, ...interval } satisfies RoomsQuery)
      : undefined;

  return {
    controller: {
      state: {
        values,
        isDisabled: officeTimezone === undefined,
      },
      actions: {
        setDate: (value: string) => setParam(ROOM_FILTER_PARAMS.date, value),
        setStartTime: (value: string) => setParam(ROOM_FILTER_PARAMS.startTime, value),
        setDuration,
        setMinCapacity: (value: string) => setParam(ROOM_FILTER_PARAMS.minCapacity, value),
        reset: () => setSearchParams({}, { replace: true }),
      },
      meta: {
        minDate: defaults?.date ?? '1970-01-01',
        maxDate: defaults
          ? addDaysToIsoDate(defaults.date, BOOKING_MAX_ADVANCE_DAYS)
          : '1970-01-01',
        latestStartTime,
      },
    } satisfies RoomFiltersController,
    roomsQuery,
    search: createRoomFilterSearch(searchParams, officeId, values),
  };
};
