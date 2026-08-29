import { CalendarIcon } from '../../assets/icons/rooms';
import { CustomSelect } from '../../components/ui/CustomSelect/CustomSelect';
import type { BookingPeriod } from '../../types/booking';
import type { SelectOption } from '../../types/select';
import { BOOKING_PERIOD_OPTIONS } from './constants';
import styles from './BookingsPage.module.css';
import { parseBookingPeriod } from './utils';

interface BookingsToolbarProps {
  officeId: string;
  officeOptions: SelectOption[];
  period: BookingPeriod;
  onOfficeChange: (value: string) => void;
  onPeriodChange: (value: BookingPeriod) => void;
}

export const BookingsToolbar = ({
  officeId,
  officeOptions,
  period,
  onOfficeChange,
  onPeriodChange,
}: BookingsToolbarProps) => (
  <div className={styles.toolbar}>
    <h1>Мои бронирования</h1>
    <div className={styles.filters} aria-label="Фильтры бронирований">
      <CustomSelect
        ariaLabel="Офис"
        value={officeId}
        options={officeOptions}
        placeholder="Все офисы"
        triggerClassName={styles.officeFilter}
        menuClassName={styles.officeMenu}
        onChange={onOfficeChange}
      />
      <CustomSelect
        ariaLabel="Период"
        value={period}
        options={BOOKING_PERIOD_OPTIONS}
        placeholder="За все время"
        prefix={<CalendarIcon className={styles.calendarIcon} />}
        chevronVisibility="never"
        triggerClassName={styles.periodFilter}
        menuClassName={styles.periodMenu}
        onChange={(value) => onPeriodChange(parseBookingPeriod(value))}
      />
    </div>
  </div>
);
