import { InfoCircleIcon } from '../../../assets/icons/ui';
import styles from './ConnectionStatusBanner.module.css';

export const ConnectionStatusBanner = () => (
  <div className={styles.banner} data-connection-status-banner="" role="status" aria-live="polite">
    <InfoCircleIcon className={styles.icon} />
    <span>Соединение потеряно. Переподключение...</span>
  </div>
);
