import { z } from 'zod';
import {
  BOOKING_COMMENT_MAX_LENGTH,
  BOOKING_MAX_ADVANCE_MS,
  BOOKING_MIN_DURATION_MINUTES,
  BOOKING_TIME_STEP_MINUTES,
  BOOKING_TITLE_MAX_LENGTH,
  BOOKING_WORKDAY_END_MINUTES,
  BOOKING_WORKDAY_START_MINUTES,
} from '../../../constants/booking';
import { getIsoDateInTimeZone, getTimeAsMinutes } from '../../../utils/roomFilters';
import { isValidRoomScheduleDate } from '../../../utils/roomSchedule';
import type { BookingFormValues } from './types';
import { createBookingInterval } from './utils';

interface BookingFormSchemaInput {
  getNow: () => Date;
  timeZone: string;
}

export const createBookingFormSchema = ({
  getNow,
  timeZone,
}: BookingFormSchemaInput): z.ZodType<BookingFormValues, BookingFormValues> =>
  z
    .object({
      title: z
        .string()
        .trim()
        .min(1, 'Обязательное поле')
        .max(BOOKING_TITLE_MAX_LENGTH, `Не более ${BOOKING_TITLE_MAX_LENGTH} символов`),
      date: z.string(),
      startTime: z.string(),
      durationMinutes: z
        .number()
        .int()
        .min(BOOKING_MIN_DURATION_MINUTES)
        .refine((value) => value % BOOKING_TIME_STEP_MINUTES === 0),
      comment: z
        .string()
        .trim()
        .max(BOOKING_COMMENT_MAX_LENGTH, `Не более ${BOOKING_COMMENT_MAX_LENGTH} символов`),
    })
    .superRefine((values, context) => {
      const startMinutes = getTimeAsMinutes(values.startTime);

      if (!isValidRoomScheduleDate(values.date)) {
        context.addIssue({ code: 'custom', path: ['date'], message: 'Укажите корректную дату' });
        return;
      }

      if (startMinutes === undefined) {
        context.addIssue({
          code: 'custom',
          path: ['startTime'],
          message: 'Укажите корректное время',
        });
        return;
      }

      const interval = createBookingInterval(values, timeZone);

      if (!interval) {
        context.addIssue({
          code: 'custom',
          path: ['startTime'],
          message: 'Проверьте выбранное время и продолжительность',
        });
        return;
      }

      const now = getNow();
      const startsAt = new Date(interval.from);

      if (startsAt.getTime() <= now.getTime()) {
        const officeToday = getIsoDateInTimeZone(now, timeZone);
        const errorPath = values.date < officeToday ? 'date' : 'startTime';
        const errorMessage =
          errorPath === 'date' ? 'Нельзя создать бронирование в прошлом' : 'Выберите будущее время';

        context.addIssue({
          code: 'custom',
          path: [errorPath],
          message: errorMessage,
        });
      }

      if (startsAt.getTime() - now.getTime() > BOOKING_MAX_ADVANCE_MS) {
        context.addIssue({
          code: 'custom',
          path: ['date'],
          message: 'Бронирование доступно не более чем на 30 дней вперёд',
        });
      }

      if (
        startMinutes < BOOKING_WORKDAY_START_MINUTES ||
        startMinutes + values.durationMinutes > BOOKING_WORKDAY_END_MINUTES
      ) {
        context.addIssue({
          code: 'custom',
          path: ['startTime'],
          message: 'Выберите время в рабочих часах с 09:00 до 20:00',
        });
      }
    });
