import { useQuery } from '@tanstack/react-query';
import { officesQueryOptions } from '../../../api/queryOptions';
import { useOfficeSelection } from '../../../hooks/useOfficeSelection';
import { getOfficePanelStatus } from './utils';

export const useRoomsLayout = () => {
  const { data: offices = [], status, refetch } = useQuery(officesQueryOptions);
  const { selectedOffice, selectOffice } = useOfficeSelection(offices);

  return {
    selectedOffice,
    officesStatus: status,
    officePanelProps: {
      status: getOfficePanelStatus(status, offices.length),
      offices,
      selectedOffice,
      onOfficeChange: selectOffice,
      onRetry: () => void refetch(),
    },
  };
};
