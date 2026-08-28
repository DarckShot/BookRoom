import { useSearchParams } from 'react-router-dom';
import { ROOM_FILTER_PARAM_NAMES, ROOM_FILTER_PARAMS } from '../constants/roomFilters';
import type { Office } from '../types/office';

export const useOfficeSelection = (offices: Office[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOfficeId = searchParams.get(ROOM_FILTER_PARAMS.officeId);
  const selectedOffice = offices.find((office) => office.id === selectedOfficeId);

  const selectOffice = (officeId: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    ROOM_FILTER_PARAM_NAMES.forEach((name) => nextSearchParams.delete(name));

    if (officeId) {
      nextSearchParams.set(ROOM_FILTER_PARAMS.officeId, officeId);
    } else {
      nextSearchParams.delete(ROOM_FILTER_PARAMS.officeId);
    }

    setSearchParams(nextSearchParams, { replace: true });
  };

  return { selectedOffice, selectOffice };
};
