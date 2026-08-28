import { OfficePanelFrame } from './OfficePanelFrame';
import styles from './OfficePanel.module.css';

interface OfficePanelErrorProps {
  onRetry: () => void;
}

export const OfficePanelError = ({ onRetry }: OfficePanelErrorProps) => (
  <OfficePanelFrame ariaLabel="Выбор офиса">
    <div className={styles.error} role="alert">
      <p>Не удалось загрузить офисы</p>
      <button className={styles.retry} type="button" onClick={onRetry}>
        Повторить
      </button>
    </div>
  </OfficePanelFrame>
);
