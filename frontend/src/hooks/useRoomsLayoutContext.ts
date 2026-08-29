import type { QueryStatus } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import type { Office } from '../types/office';

export interface RoomsLayoutContextValue {
  selectedOffice?: Office;
  officesStatus: QueryStatus;
}

export const useRoomsLayoutContext = () => useOutletContext<RoomsLayoutContextValue>();
