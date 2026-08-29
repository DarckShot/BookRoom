import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { BOOKING_MAX_ADVANCE_DAYS } from '../../constants/booking';
import {
  currentUserQueryOptions,
  roomQueryOptions,
  roomScheduleQueryOptions,
} from '../../api/queryOptions';
import { useRealtime } from '../../hooks/useRealtime';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import { addDaysToIsoDate, getIsoDateInTimeZone } from '../../utils/roomFilters';
import { getRoomScheduleInterval, isValidRoomScheduleDate } from '../../utils/roomSchedule';
import { getRoomPageStatus, getRoomScheduleStatus } from './utils';
import type { CreatedBookingSeries } from '../../types/booking';

export const useRoomPage = () => {
  const { roomId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const realtime = useRealtime();
  const now = useCurrentTime();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStartTime, setBookingStartTime] = useState<string>();
  const [createdSeries, setCreatedSeries] = useState<CreatedBookingSeries>();
  const roomQuery = useQuery(roomQueryOptions(roomId));
  const currentUserQuery = useQuery(currentUserQueryOptions);
  const today = roomQuery.data ? getIsoDateInTimeZone(now, roomQuery.data.office.timezone) : '';
  const requestedDate = searchParams.get('date');
  const maxDate = today ? addDaysToIsoDate(today, BOOKING_MAX_ADVANCE_DAYS) : '';
  const date =
    isValidRoomScheduleDate(requestedDate) && requestedDate >= today && requestedDate <= maxDate
      ? requestedDate
      : today;
  const interval =
    roomQuery.data && date
      ? getRoomScheduleInterval(date, roomQuery.data.office.timezone)
      : undefined;
  const scheduleQuery = useQuery(roomScheduleQueryOptions(roomId, interval));

  const changeDate = (nextDate: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('date', nextDate);
    setSearchParams(nextSearchParams);
  };

  const retryPage = () => {
    void roomQuery.refetch();
    void currentUserQuery.refetch();
  };

  const retrySchedule = () => {
    if (realtime.status === 'reconnecting') {
      realtime.reconnect();
    }

    void scheduleQuery.refetch();
  };

  const openBooking = () => {
    setCreatedSeries(undefined);
    setBookingStartTime(undefined);
    setIsBookingOpen(true);
  };

  const openBookingAt = (startTime: string) => {
    setCreatedSeries(undefined);
    setBookingStartTime(startTime);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
  };

  const finishBooking = (series: CreatedBookingSeries) => {
    setIsBookingOpen(false);
    setCreatedSeries(series);
  };

  const dismissBookingSuccess = () => {
    setCreatedSeries(undefined);
  };

  return {
    data: {
      room: roomQuery.data,
      bookings: scheduleQuery.data ?? [],
      currentUserId: currentUserQuery.data?.id ?? '',
      date,
      minDate: today,
      maxDate,
      search: searchParams.toString(),
      isBookingOpen,
      bookingStartTime,
      createdSeries,
      now,
    },
    status: {
      page: getRoomPageStatus(roomQuery.status, currentUserQuery.status),
      schedule: getRoomScheduleStatus(scheduleQuery.status),
    },
    actions: {
      changeDate,
      retryPage,
      retrySchedule,
      openBooking,
      openBookingAt,
      closeBooking,
      finishBooking,
      dismissBookingSuccess,
    },
  };
};
