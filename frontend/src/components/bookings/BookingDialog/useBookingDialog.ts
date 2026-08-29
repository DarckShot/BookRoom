import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createBooking } from '../../../api/bookings';
import { isApiError } from '../../../api/errors';
import { queryKeys } from '../../../api/queryKeys';
import { BOOKING_MAX_ADVANCE_DAYS } from '../../../constants/booking';
import type { CreateBookingInput } from '../../../types/booking';
import { addDaysToIsoDate, getIsoDateInTimeZone } from '../../../utils/roomFilters';
import {
  BOOKING_CONFLICT_CODE,
  BOOKING_CONFLICT_STATUS,
  BOOKING_CONFLICT_VIEW,
  BOOKING_FORM_VIEW,
} from './constants';
import { createBookingFormSchema } from './schema';
import type { BookingDialogProps, BookingDialogView, BookingFormValues } from './types';
import { createBookingInterval, getBookingFormDefaults } from './utils';

export const useBookingDialog = ({
  room,
  selectedDate,
  initialStartTime,
  search,
  onClose,
  onCreated,
}: BookingDialogProps) => {
  const queryClient = useQueryClient();
  const [now] = useState(() => new Date());
  const [view, setView] = useState<BookingDialogView>(BOOKING_FORM_VIEW);
  const minDate = getIsoDateInTimeZone(now, room.office.timezone);
  const maxDate = addDaysToIsoDate(minDate, BOOKING_MAX_ADVANCE_DAYS);
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(
      createBookingFormSchema({ getNow: () => new Date(), timeZone: room.office.timezone }),
    ),
    defaultValues: getBookingFormDefaults({
      date: selectedDate,
      initialStartTime,
      search,
      timeZone: room.office.timezone,
      now,
    }),
  });
  const mutation = useMutation({
    mutationFn: (input: CreateBookingInput) => createBooking(input),
    onSuccess: (booking) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.roomsRoot });
      onCreated(booking);
    },
    onError: (error) => {
      if (isApiError(error, BOOKING_CONFLICT_STATUS, BOOKING_CONFLICT_CODE)) {
        setView(BOOKING_CONFLICT_VIEW);
        void queryClient.invalidateQueries({ queryKey: queryKeys.roomsRoot });
        return;
      }

      form.setError('root.server', {
        message: 'Не удалось создать бронирование. Попробуйте ещё раз',
      });
    },
  });

  const submit = form.handleSubmit((values) => {
    const interval = createBookingInterval(values, room.office.timezone);

    if (!interval) {
      form.setError('root.server', { message: 'Проверьте выбранные дату и время' });
      return;
    }

    mutation.reset();
    mutation.mutate({
      roomId: room.id,
      title: values.title.trim(),
      comment: values.comment.trim() || null,
      startsAt: interval.from,
      endsAt: interval.to,
    });
  });

  const cancel = () => {
    if (!mutation.isPending) {
      onClose();
    }
  };

  const chooseAnotherTime = () => {
    mutation.reset();
    setView(BOOKING_FORM_VIEW);
  };

  return {
    form,
    data: {
      view,
      minDate,
      maxDate,
    },
    status: {
      isPending: mutation.isPending,
    },
    actions: {
      submit,
      cancel,
      chooseAnotherTime,
    },
  };
};
