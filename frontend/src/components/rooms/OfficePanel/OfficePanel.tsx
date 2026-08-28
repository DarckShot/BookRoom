import type { ReactNode } from 'react';
import { OfficePanelEmpty } from './OfficePanelEmpty';
import { OfficePanelError } from './OfficePanelError';
import { OfficePanelLoading } from './OfficePanelLoading';
import { OfficePanelReady } from './OfficePanelReady';
import type { OfficePanelProps, OfficePanelStatus } from './types';

export const OfficePanel = ({
  status,
  offices,
  selectedOffice,
  onOfficeChange,
  onRetry,
}: OfficePanelProps) => {
  const panels: Record<OfficePanelStatus, ReactNode> = {
    loading: <OfficePanelLoading />,
    error: <OfficePanelError onRetry={onRetry} />,
    empty: <OfficePanelEmpty />,
    ready: (
      <OfficePanelReady
        offices={offices}
        selectedOffice={selectedOffice}
        onOfficeChange={onOfficeChange}
      />
    ),
  };

  return panels[status];
};
