import type { CreatedBookingSeries } from '../../../types/booking';

export interface BookingSuccessToastProps {
  series: CreatedBookingSeries;
  onClose: () => void;
}
