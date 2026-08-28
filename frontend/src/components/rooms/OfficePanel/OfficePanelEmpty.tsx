import { OfficePanelFrame } from './OfficePanelFrame';
import styles from './OfficePanel.module.css';

export const OfficePanelEmpty = () => (
  <OfficePanelFrame ariaLabel="Выбор офиса">
    <p className={styles.status} role="status">
      Офисы не найдены
    </p>
  </OfficePanelFrame>
);
