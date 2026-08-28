import type { Office } from '../../../types/office';
import { OfficeMetadata } from './OfficeMetadata';
import styles from './OfficePanel.module.css';
import { OfficePanelFrame } from './OfficePanelFrame';
import { OfficeSelect } from './OfficeSelect';

interface OfficePanelReadyProps {
  offices: Office[];
  selectedOffice?: Office;
  onOfficeChange: (officeId: string) => void;
}

export const OfficePanelReady = ({
  offices,
  selectedOffice,
  onOfficeChange,
}: OfficePanelReadyProps) => (
  <OfficePanelFrame ariaLabel={selectedOffice?.name ?? 'Выбор офиса'}>
    <div className={styles.info}>
      <OfficeSelect offices={offices} selectedOffice={selectedOffice} onChange={onOfficeChange} />
      <OfficeMetadata office={selectedOffice} />
    </div>
  </OfficePanelFrame>
);
