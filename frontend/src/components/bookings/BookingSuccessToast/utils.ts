import type { Booking } from '../../../types/booking';
import { getTimeZoneLabel } from '../../../utils/office';
import { formatMinutesAsTime, getDateTimePartsInTimeZone } from '../../../utils/roomFilters';
import { BOOKING_SUCCESS_DATE_FORMATTER } from './constants';

export const formatCreatedBooking = (booking: Booking) => {
  const start = getDateTimePartsInTimeZone(new Date(booking.startsAt), booking.office.timezone);
  const end = getDateTimePartsInTimeZone(new Date(booking.endsAt), booking.office.timezone);
  const date = `${start.year}-${String(start.month).padStart(2, '0')}-${String(start.day).padStart(2, '0')}`;
  const startsAt = formatMinutesAsTime(start.hour * 60 + start.minute);
  const endsAt = formatMinutesAsTime(end.hour * 60 + end.minute);

  return `Комната ${booking.room.name}, ${BOOKING_SUCCESS_DATE_FORMATTER.format(new Date(`${date}T12:00:00.000Z`))}, ${startsAt}–${endsAt} ${getTimeZoneLabel(booking.office.timezone)}`;
};
