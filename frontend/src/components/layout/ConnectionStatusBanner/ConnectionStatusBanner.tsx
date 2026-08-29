import { InfoCircleIcon } from '../../../assets/icons/ui';
import styles from './ConnectionStatusBanner.module.css';

interface ConnectionStatusBannerProps {
  onReconnect: () => void;
}

export const ConnectionStatusBanner = ({ onReconnect }: ConnectionStatusBannerProps) => (
  <div className={styles.banner} data-connection-status-banner="" role="status" aria-live="polite">
    <InfoCircleIcon className={styles.icon} />
    <span>Соединение потеряно. Переподключение...</span>
    <button type="button" onClick={onReconnect}>
      Повторить сейчас
    </button>
  </div>
);
