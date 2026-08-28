import { useOutletContext } from 'react-router-dom';
import type { Office } from '../types/office';

export interface RoomsLayoutContextValue {
  selectedOffice?: Office;
}

export const useRoomsLayoutContext = () => useOutletContext<RoomsLayoutContextValue>();
