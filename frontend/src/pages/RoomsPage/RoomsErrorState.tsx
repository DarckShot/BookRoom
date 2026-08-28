import styles from './RoomsPage.module.css';

interface RoomsErrorStateProps {
  onRetry: () => void;
}

export const RoomsErrorState = ({ onRetry }: RoomsErrorStateProps) => (
  <main className={styles.status} role="alert">
    <p>Не удалось загрузить переговорные</p>
    <button className={styles.retryButton} type="button" onClick={onRetry}>
      Повторить
    </button>
  </main>
);
