import { Controller } from 'react-hook-form';
import { DatePicker } from '../../rooms/DatePicker/DatePicker';
import { TimeInput } from '../../rooms/TimeInput/TimeInput';
import { CustomSelect } from '../../ui/CustomSelect/CustomSelect';
import { BOOKING_LATEST_START, BOOKING_WORKDAY_START } from '../../../constants/booking';
import { classNames } from '../../../utils/classNames';
import { formatRoomFilterDate } from '../../../utils/roomFilters';
import styles from './BookingForm.module.css';
import { useBookingScheduleFields } from './useBookingScheduleFields';

interface BookingScheduleFieldsProps {
  minDate: string;
  maxDate: string;
}

export const BookingScheduleFields = ({ minDate, maxDate }: BookingScheduleFieldsProps) => {
  const { control, data, status, actions } = useBookingScheduleFields(maxDate);
  const errors = status.errors;

  return (
    <>
      <div className={styles.inlineFields}>
        <div className={styles.field}>
          <span>Дата</span>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker
                className={classNames(styles.datePicker, errors.date && styles.invalidPicker)}
                value={field.value}
                min={minDate}
                max={maxDate}
                formattedValue={formatRoomFilterDate(field.value)}
                ariaInvalid={Boolean(errors.date)}
                ariaDescribedBy={errors.date ? 'booking-date-error' : undefined}
                onChange={actions.changeDate}
              />
            )}
          />
          {errors.date ? (
            <small className={styles.fieldError} id="booking-date-error">
              {errors.date.message}
            </small>
          ) : null}
        </div>

        <div className={styles.field}>
          <span>Время начала</span>
          <Controller
            control={control}
            name="startTime"
            render={({ field }) => (
              <TimeInput
                className={classNames(styles.timeInput, errors.startTime && styles.invalidControl)}
                value={field.value}
                min={BOOKING_WORKDAY_START}
                max={BOOKING_LATEST_START}
                ariaInvalid={Boolean(errors.startTime)}
                ariaDescribedBy={errors.startTime ? 'booking-start-time-error' : undefined}
                onChange={actions.changeStartTime}
              />
            )}
          />
          {errors.startTime ? (
            <small className={styles.fieldError} id="booking-start-time-error">
              {errors.startTime.message}
            </small>
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <span>Продолжительность</span>
        <Controller
          control={control}
          name="durationMinutes"
          render={({ field }) => (
            <CustomSelect
              ariaLabel="Продолжительность бронирования"
              className={styles.durationSelect}
              triggerClassName={classNames(
                styles.durationTrigger,
                errors.durationMinutes && styles.invalidControl,
              )}
              menuClassName={styles.durationMenu}
              value={String(field.value)}
              options={data.durationOptions}
              placeholder="Выберите продолжительность"
              ariaInvalid={Boolean(errors.durationMinutes)}
              ariaDescribedBy={errors.durationMinutes ? 'booking-duration-error' : undefined}
              onChange={(value) => field.onChange(Number(value))}
            />
          )}
        />
        {errors.durationMinutes ? (
          <small className={styles.fieldError} id="booking-duration-error">
            Проверьте продолжительность бронирования
          </small>
        ) : null}
      </div>
    </>
  );
};
