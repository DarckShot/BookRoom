import { format } from 'date-fns/format';
import { isAfter } from 'date-fns/isAfter';
import { isBefore } from 'date-fns/isBefore';
import { isSameDay } from 'date-fns/isSameDay';
import { isSameMonth } from 'date-fns/isSameMonth';
import { ru } from 'date-fns/locale/ru';
import { CalendarIcon } from '../../../assets/icons/rooms';
import { ChevronDownIcon } from '../../../assets/icons/ui';
import { classNames } from '../../../utils/classNames';
import { capitalize } from '../../../utils/string';
import { WEEKDAYS } from './constants';
import styles from './DatePicker.module.css';
import type { DatePickerProps } from './types';
import { useDatePicker } from './useDatePicker';

export const DatePicker = ({
  value,
  min,
  max,
  formattedValue,
  onChange,
  disabled = false,
  className,
  placeholder = 'Выберите дату',
  ariaInvalid = false,
  ariaDescribedBy,
}: DatePickerProps) => {
  const { rootRef, triggerRef, state, calendar, actions } = useDatePicker({
    value,
    min,
    max,
    onChange,
  });

  return (
    <div
      className={classNames(styles.root, className)}
      ref={rootRef}
      onKeyDown={actions.handleRootKeyDown}
    >
      <button
        className={styles.trigger}
        ref={triggerRef}
        type="button"
        aria-label="Дата бронирования"
        aria-expanded={state.isOpen}
        aria-haspopup="dialog"
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        onClick={actions.toggleCalendar}
      >
        <CalendarIcon className={styles.icon} />
        <span className={classNames(styles.value, disabled && styles.placeholder)}>
          {disabled ? placeholder : formattedValue}
        </span>
      </button>

      {state.isOpen ? (
        <div className={styles.calendar} role="dialog" aria-label="Выбор даты">
          <div className={styles.calendarHeader}>
            <strong>{capitalize(format(state.visibleMonth, 'LLLL yyyy', { locale: ru }))}</strong>
            <div className={styles.navigation}>
              <button
                className={styles.navigationButton}
                type="button"
                aria-label="Предыдущий месяц"
                disabled={!calendar.canGoPrevious}
                onClick={actions.goToPreviousMonth}
              >
                <ChevronDownIcon className={styles.previousIcon} />
              </button>
              <button
                className={styles.navigationButton}
                type="button"
                aria-label="Следующий месяц"
                disabled={!calendar.canGoNext}
                onClick={actions.goToNextMonth}
              >
                <ChevronDownIcon className={styles.nextIcon} />
              </button>
            </div>
          </div>

          <div className={styles.weekdays} aria-hidden="true">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          <div className={styles.days}>
            {calendar.days.map((date) => {
              const isoDate = format(date, 'yyyy-MM-dd');
              const isUnavailable =
                isBefore(date, calendar.minDate) || isAfter(date, calendar.maxDate);
              const isSelected = isSameDay(date, calendar.selectedDate);

              return (
                <button
                  className={classNames(
                    styles.day,
                    !isSameMonth(date, state.visibleMonth) && styles.outsideMonth,
                    isSelected && styles.selectedDay,
                  )}
                  key={isoDate}
                  type="button"
                  aria-label={format(date, 'd MMMM yyyy', { locale: ru })}
                  aria-pressed={isSelected}
                  disabled={isUnavailable}
                  onClick={() => actions.selectDate(date)}
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
