import type { Office } from '../../../types/office';

export type OfficePanelStatus = 'loading' | 'error' | 'empty' | 'ready';

export interface OfficePanelProps {
  status: OfficePanelStatus;
  offices: Office[];
  selectedOffice?: Office;
  onOfficeChange: (officeId: string) => void;
  onRetry: () => void;
}
