import type { ReactNode } from 'react';
import { OfficePanelEmpty } from './states/OfficePanelEmpty';
import { OfficePanelError } from './states/OfficePanelError';
import { OfficePanelLoading } from './states/OfficePanelLoading';
import { OfficePanelReady } from './states/OfficePanelReady';
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
