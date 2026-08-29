import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cancelBooking } from '../../api/bookings';
import { getApiErrorMessage } from '../../api/errors';
import { queryKeys } from '../../api/queryKeys';
import { bookingsQueryOptions, officesQueryOptions } from '../../api/queryOptions';
import {
  ALL_BOOKINGS_SCOPE,
  DEFAULT_BOOKING_PERIOD,
  UPCOMING_BOOKINGS_TAB,
} from '../../constants/bookings';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import type { Booking, BookingPeriod, BookingsTab } from '../../types/booking';
import { filterBookings } from '../../utils/bookings';
import {
  BOOKINGS_OFFICE_PARAM,
  BOOKINGS_PERIOD_PARAM,
  BOOKINGS_SCOPE_PARAM,
  CANCELLATION_ERROR_MESSAGE,
} from './constants';
import {
  createOfficeOptions,
  getBookingsPageStatus,
  parseBookingPeriod,
  parseBookingsTab,
} from './utils';

export const useBookingsPage = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBooking, setSelectedBooking] = useState<Booking>();
  const now = useCurrentTime();
  const tab = parseBookingsTab(searchParams.get(BOOKINGS_SCOPE_PARAM));
  const period = parseBookingPeriod(searchParams.get(BOOKINGS_PERIOD_PARAM));
  const officeId = searchParams.get(BOOKINGS_OFFICE_PARAM) ?? '';
  const officesQuery = useQuery(officesQueryOptions);
  const bookingsQuery = useQuery(
    bookingsQueryOptions({
      scope: ALL_BOOKINGS_SCOPE,
      ...(officeId ? { officeId } : {}),
    }),
  );
  const bookings = bookingsQuery.data ?? [];
  const visibleBookings = filterBookings(bookings, tab, period, now);
  const upcomingCount = filterBookings(bookings, UPCOMING_BOOKINGS_TAB, period, now).length;
  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      setSelectedBooking(undefined);
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookingsRoot });
      void queryClient.invalidateQueries({ queryKey: queryKeys.roomsRoot });
    },
  });

  const setParam = (name: string, value: string, defaultValue = '') => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (value === defaultValue) {
      nextSearchParams.delete(name);
    } else {
      nextSearchParams.set(name, value);
    }

    setSearchParams(nextSearchParams, { replace: true });
  };

  const selectTab = (nextTab: BookingsTab) => {
    setParam(BOOKINGS_SCOPE_PARAM, nextTab, UPCOMING_BOOKINGS_TAB);
  };

  const selectPeriod = (nextPeriod: BookingPeriod) => {
    setParam(BOOKINGS_PERIOD_PARAM, nextPeriod, DEFAULT_BOOKING_PERIOD);
  };

  const openCancellation = (booking: Booking) => {
    cancelMutation.reset();
    setSelectedBooking(booking);
  };

  const closeCancellation = () => {
    if (!cancelMutation.isPending) {
      setSelectedBooking(undefined);
      cancelMutation.reset();
    }
  };

  const confirmCancellation = () => {
    if (selectedBooking) {
      cancelMutation.mutate(selectedBooking.id);
    }
  };

  const retry = () => {
    void bookingsQuery.refetch();
    void officesQuery.refetch();
  };

  return {
    data: {
      bookings: visibleBookings,
      officeOptions: createOfficeOptions(officesQuery.data ?? []),
      officeId,
      period,
      tab,
      upcomingCount,
      selectedBooking,
      now,
    },
    status: {
      page: getBookingsPageStatus(bookingsQuery.status, officesQuery.status),
      isCancelling: cancelMutation.isPending,
      cancellationError: cancelMutation.isError
        ? getApiErrorMessage(cancelMutation.error, CANCELLATION_ERROR_MESSAGE)
        : undefined,
    },
    actions: {
      selectOffice: (value: string) => setParam(BOOKINGS_OFFICE_PARAM, value),
      selectPeriod,
      selectTab,
      retry,
      openCancellation,
      closeCancellation,
      confirmCancellation,
    },
  };
};
