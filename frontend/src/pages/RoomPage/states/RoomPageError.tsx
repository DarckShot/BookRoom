import { AlertTriangleIcon } from '../../../assets/icons/ui';
import styles from '../RoomPage.module.css';

interface RoomPageErrorProps {
  onRetry: () => void;
}

export const RoomPageError = ({ onRetry }: RoomPageErrorProps) => (
  <main className={styles.pageError} role="alert">
    <span className={styles.errorIconCircle} aria-hidden="true">
      <AlertTriangleIcon />
    </span>
    <h1>Не удалось загрузить переговорную</h1>
    <p>Проверьте соединение и попробуйте ещё раз</p>
    <button type="button" onClick={onRetry}>
      Попробовать снова
    </button>
  </main>
);
