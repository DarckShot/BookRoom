import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { CustomSelect } from '../../../ui/CustomSelect/CustomSelect';
import type { BookingFormValues } from '../model/types';
import { getBookingOccurrenceOptions } from '../model/utils';
import styles from './BookingForm.module.css';

interface BookingRecurrenceFieldsProps {
  maxDate: string;
}

export const BookingRecurrenceFields = ({ maxDate }: BookingRecurrenceFieldsProps) => {
  const { control, setValue, formState } = useFormContext<BookingFormValues>();
  const [date, isRecurring] = useWatch({ control, name: ['date', 'isRecurring'] });
  const options = getBookingOccurrenceOptions(date, maxDate);
  const canRepeat = options.length > 0;
  const error = formState.errors.occurrenceCount;

  return (
    <div className={styles.recurrence}>
      <Controller
        control={control}
        name="isRecurring"
        render={({ field }) => (
          <label className={styles.recurrenceToggle}>
            <input
              type="checkbox"
              checked={field.value}
              disabled={!canRepeat}
              onChange={(event) => {
                const checked = event.target.checked;
                field.onChange(checked);
                setValue('occurrenceCount', checked ? Number(options[0]?.value) : 1, {
                  shouldValidate: formState.isSubmitted,
                });
              }}
            />
            <span>Повторять еженедельно</span>
          </label>
        )}
      />

      {isRecurring ? (
        <Controller
          control={control}
          name="occurrenceCount"
          render={({ field }) => (
            <CustomSelect
              ariaLabel="Количество встреч"
              className={styles.occurrenceSelect}
              triggerClassName={styles.occurrenceTrigger}
              menuClassName={styles.occurrenceMenu}
              value={String(field.value)}
              options={options}
              placeholder="Количество встреч"
              ariaInvalid={Boolean(error)}
              ariaDescribedBy={error ? 'booking-occurrence-error' : undefined}
              onChange={(value) => field.onChange(Number(value))}
            />
          )}
        />
      ) : (
        <span className={styles.recurrenceHint}>
          {canRepeat ? 'В пределах 30 дней' : 'Для этой даты повтор недоступен'}
        </span>
      )}

      {error ? (
        <small className={styles.fieldError} id="booking-occurrence-error">
          {error.message}
        </small>
      ) : null}
    </div>
  );
};
