import { AlertTriangleIcon } from '../../assets/icons/ui';
import { ConnectionStatusBanner } from '../../components/layout/ConnectionStatusBanner/ConnectionStatusBanner';
import type { RealtimeConnectionStatus } from '../../types/realtime';
import styles from './RoomsPage.module.css';

interface RoomsErrorStateProps {
  connectionStatus: RealtimeConnectionStatus;
  onRetry: () => void;
}

export const RoomsErrorState = ({ connectionStatus, onRetry }: RoomsErrorStateProps) => (
  <>
    {connectionStatus === 'reconnecting' ? <ConnectionStatusBanner /> : null}
    <main className={styles.errorState} role="alert">
      <div className={styles.errorIconCircle}>
        <AlertTriangleIcon className={styles.errorIcon} />
      </div>
      <h1 className={styles.errorTitle}>Не удалось загрузить данные</h1>
      <p className={styles.errorDescription}>Произошла ошибка при загрузке списка переговорных</p>
      <button className={styles.retryButton} type="button" onClick={onRetry}>
        Попробовать снова
      </button>
    </main>
  </>
);
