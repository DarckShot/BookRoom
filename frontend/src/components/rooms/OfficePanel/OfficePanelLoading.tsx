import { OfficePanelFrame } from './OfficePanelFrame';
import styles from './OfficePanel.module.css';

export const OfficePanelLoading = () => (
  <OfficePanelFrame ariaLabel="Выбор офиса">
    <p className={styles.status} role="status">
      Загрузка офисов…
    </p>
  </OfficePanelFrame>
);
