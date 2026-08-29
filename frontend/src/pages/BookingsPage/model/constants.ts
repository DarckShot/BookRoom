import { DEFAULT_BOOKING_PERIOD } from '../../../constants/bookings';
import type { SelectOption } from '../../../types/select';
export const ALL_OFFICES_VALUE = '';
export const ALL_OFFICES_OPTION: SelectOption = {
  value: ALL_OFFICES_VALUE,
  label: 'Все офисы',
};
export const BOOKING_PERIOD_OPTIONS: SelectOption[] = [
  { value: DEFAULT_BOOKING_PERIOD, label: 'За все время' },
  { value: 'today', label: 'Сегодня' },
  { value: 'seven-days', label: '7 дней' },
  { value: 'thirty-days', label: '30 дней' },
];
export const BOOKINGS_SKELETON_KEYS = ['booking-skeleton-1', 'booking-skeleton-2'];
export const BOOKINGS_SCOPE_PARAM = 'scope';
export const BOOKINGS_OFFICE_PARAM = 'officeId';
export const BOOKINGS_PERIOD_PARAM = 'period';
export const CANCELLATION_ERROR_MESSAGE = 'Не удалось отменить бронирование. Попробуйте снова';
