import { useFormContext, useWatch } from 'react-hook-form';
import { InfoCircleIcon } from '../../../assets/icons/ui';
import {
  BOOKING_DEFAULT_DURATION_MINUTES,
  BOOKING_WORKDAY_START,
} from '../../../constants/booking';
import type { Room } from '../../../types/room';
import { classNames } from '../../../utils/classNames';
import styles from './BookingForm.module.css';
import { BookingScheduleFields } from './BookingScheduleFields';
import type { BookingFormValues } from './types';
import { formatBookingSummary } from './utils';

interface BookingFormProps {
  room: Room;
  minDate: string;
  maxDate: string;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const BookingForm = ({
  room,
  minDate,
  maxDate,
  isPending,
  onCancel,
  onSubmit,
}: BookingFormProps) => {
  const { register, control, formState } = useFormContext<BookingFormValues>();
  const [watchedDate, watchedStartTime, watchedDurationMinutes] = useWatch({
    control,
    name: ['date', 'startTime', 'durationMinutes'],
  });
  const date = watchedDate ?? minDate;
  const startTime = watchedStartTime ?? BOOKING_WORKDAY_START;
  const durationMinutes = watchedDurationMinutes ?? BOOKING_DEFAULT_DURATION_MINUTES;
  const errors = formState.errors;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.header}>
        <h2 id="booking-dialog-title">Новое бронирование</h2>
        <p>
          Переговорная: <strong>{room.name}</strong> ({room.office.name}, {room.floor} этаж)
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.field}>
          <label htmlFor="booking-title">Тема встречи *</label>
          <input
            id="booking-title"
            className={classNames(styles.control, errors.title && styles.invalidControl)}
            type="text"
            placeholder="Укажите тему встречи"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'booking-title-error' : undefined}
            {...register('title')}
          />
          {errors.title ? (
            <small className={styles.fieldError} id="booking-title-error">
              {errors.title.message}
            </small>
          ) : null}
        </div>

        <BookingScheduleFields minDate={minDate} maxDate={maxDate} />

        <div className={styles.field}>
          <label htmlFor="booking-comment">Комментарий</label>
          <textarea
            id="booking-comment"
            className={classNames(
              styles.control,
              styles.comment,
              errors.comment && styles.invalidControl,
            )}
            placeholder="Дополнительная информация для участников встречи..."
            aria-invalid={Boolean(errors.comment)}
            aria-describedby={errors.comment ? 'booking-comment-error' : undefined}
            {...register('comment')}
          />
          {errors.comment ? (
            <small className={styles.fieldError} id="booking-comment-error">
              {errors.comment.message}
            </small>
          ) : null}
        </div>

        <p className={styles.summary}>
          <InfoCircleIcon />
          {formatBookingSummary({
            date,
            startTime,
            durationMinutes,
          })}
        </p>

        {errors.root?.server ? (
          <p className={styles.submissionError} role="alert">
            {errors.root.server.message}
          </p>
        ) : null}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.cancelButton}
          type="button"
          disabled={isPending}
          onClick={onCancel}
        >
          Отмена
        </button>
        <button className={styles.submitButton} type="submit" disabled={isPending}>
          {isPending ? 'Бронируем…' : 'Забронировать'}
        </button>
      </div>
    </form>
  );
};
