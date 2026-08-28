import { NoResultsIcon } from '../../../assets/icons/rooms';
import styles from './RoomsEmptyState.module.css';

interface RoomsEmptyStateProps {
  onReset: () => void;
}

export const RoomsEmptyState = ({ onReset }: RoomsEmptyStateProps) => (
  <main className={styles.state}>
    <div className={styles.iconCircle}>
      <NoResultsIcon className={styles.icon} />
    </div>
    <h1 className={styles.title}>Нет доступных переговорных</h1>
    <p className={styles.description}>
      Попробуйте изменить параметры фильтрации или выбрать другой офис
    </p>
    <button className={styles.resetButton} type="button" onClick={onReset}>
      Сбросить фильтры
    </button>
  </main>
);
