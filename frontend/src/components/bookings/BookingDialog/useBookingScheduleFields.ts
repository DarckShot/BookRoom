import { useFormContext, useWatch } from 'react-hook-form';
import {
  BOOKING_DEFAULT_DURATION_MINUTES,
  BOOKING_WORKDAY_END_MINUTES,
  BOOKING_WORKDAY_START,
} from '../../../constants/booking';
import { getTimeAsMinutes } from '../../../utils/roomFilters';
import type { BookingFormValues } from './types';
import { getBookingDurationOptions, getBookingOccurrenceOptions } from './utils';

export const useBookingScheduleFields = (maxDate: string) => {
  const { control, getValues, setValue, formState } = useFormContext<BookingFormValues>();
  const [watchedStartTime, watchedDurationMinutes] = useWatch({
    control,
    name: ['startTime', 'durationMinutes'],
  });
  const startTime = watchedStartTime ?? BOOKING_WORKDAY_START;
  const durationMinutes = watchedDurationMinutes ?? BOOKING_DEFAULT_DURATION_MINUTES;

  const changeStartTime = (nextStartTime: string) => {
    const startMinutes = getTimeAsMinutes(nextStartTime) ?? BOOKING_WORKDAY_END_MINUTES;
    const maximumDuration = BOOKING_WORKDAY_END_MINUTES - startMinutes;
    setValue('startTime', nextStartTime, { shouldValidate: formState.isSubmitted });

    if (durationMinutes > maximumDuration) {
      setValue('durationMinutes', maximumDuration, { shouldValidate: formState.isSubmitted });
    }
  };

  const changeDate = (nextDate: string) => {
    setValue('date', nextDate, { shouldValidate: formState.isSubmitted });
    const occurrenceOptions = getBookingOccurrenceOptions(nextDate, maxDate);
    const maximumOccurrenceCount = Number(occurrenceOptions.at(-1)?.value ?? 1);

    if (getValues('isRecurring') && maximumOccurrenceCount === 1) {
      setValue('isRecurring', false);
      setValue('occurrenceCount', 1);
      return;
    }

    if (getValues('occurrenceCount') > maximumOccurrenceCount) {
      setValue('occurrenceCount', maximumOccurrenceCount, {
        shouldValidate: formState.isSubmitted,
      });
    }
  };

  return {
    control,
    data: {
      durationOptions: getBookingDurationOptions(startTime),
    },
    status: {
      errors: formState.errors,
    },
    actions: {
      changeStartTime,
      changeDate,
    },
  };
};
