import { AlertTriangleIcon } from '../../../assets/icons/ui';
import styles from './RoomSchedule.module.css';

interface RoomScheduleErrorProps {
  onRetry: () => void;
}

export const RoomScheduleError = ({ onRetry }: RoomScheduleErrorProps) => (
  <section className={styles.card}>
    <div className={styles.error} role="alert">
      <span className={styles.errorIcon} aria-hidden="true">
        <AlertTriangleIcon />
      </span>
      <h2>Не удалось загрузить расписание</h2>
      <p>Произошла ошибка при загрузке расписания переговорной</p>
      <button type="button" onClick={onRetry}>
        Попробовать снова
      </button>
    </div>
  </section>
);
