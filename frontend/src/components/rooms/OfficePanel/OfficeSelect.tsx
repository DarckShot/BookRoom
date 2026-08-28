import type { Office } from '../../../types/office';
import { CustomSelect } from '../../ui/CustomSelect/CustomSelect';
import styles from './OfficePanel.module.css';

interface OfficeSelectProps {
  offices: Office[];
  selectedOffice?: Office;
  onChange: (officeId: string) => void;
}

export const OfficeSelect = ({ offices, selectedOffice, onChange }: OfficeSelectProps) => (
  <CustomSelect
    className={styles.officeSelect}
    triggerClassName={styles.officeTrigger}
    menuClassName={styles.officeMenu}
    placeholderClassName={styles.officePlaceholder}
    ariaLabel="Выберите офис"
    value={selectedOffice?.id ?? ''}
    options={offices.map((office) => ({ value: office.id, label: office.name }))}
    placeholder="Выберите офис"
    onChange={onChange}
  />
);
