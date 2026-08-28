import type { OfficePanelStatus } from '../../rooms/OfficePanel/types';

type QueryStatus = 'pending' | 'error' | 'success';

export const getOfficePanelStatus = (
  queryStatus: QueryStatus,
  officeCount: number,
): OfficePanelStatus => {
  switch (queryStatus) {
    case 'pending':
      return 'loading';
    case 'error':
      return 'error';
    case 'success':
      return officeCount === 0 ? 'empty' : 'ready';
  }
};
