import { AlertTriangleIcon } from '../../assets/icons/ui';
import styles from './BookingsPage.module.css';

interface BookingsErrorStateProps {
  onRetry: () => void;
}

export const BookingsErrorState = ({ onRetry }: BookingsErrorStateProps) => (
  <section className={styles.state} role="alert">
    <div className={styles.errorIconCircle}>
      <AlertTriangleIcon className={styles.errorIcon} />
    </div>
    <h2 className={styles.stateTitle}>Не удалось загрузить данные</h2>
    <p className={styles.stateDescription}>Произошла ошибка при загрузке ваших бронирований</p>
    <button className={styles.primaryButton} type="button" onClick={onRetry}>
      Попробовать снова
    </button>
  </section>
);
