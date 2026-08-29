import { AlertTriangleIcon } from '../../../assets/icons/ui';
import styles from './BookingConflict.module.css';

interface BookingConflictProps {
  onChooseAnotherTime: () => void;
}

export const BookingConflict = ({ onChooseAnotherTime }: BookingConflictProps) => (
  <section className={styles.conflict} role="alert">
    <span className={styles.icon} aria-hidden="true">
      <AlertTriangleIcon />
    </span>
    <h2 id="booking-conflict-title">Время уже занято</h2>
    <p>Выбранный интервал был забронирован другим сотрудником. Расписание обновлено.</p>
    <button type="button" autoFocus onClick={onChooseAnotherTime}>
      Выбрать другое время
    </button>
  </section>
);
