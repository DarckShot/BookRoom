import type { Booking } from '../types/booking';

const escapeCalendarText = (value: string) =>
  value
    .replaceAll('\\', '\\\\')
    .replaceAll('\n', '\\n')
    .replaceAll(',', '\\,')
    .replaceAll(';', '\\;');

const formatCalendarDateTime = (value: string) =>
  new Date(value).toISOString().replaceAll('-', '').replaceAll(':', '').replace('.000', '');

export const createBookingCalendar = (booking: Booking) => {
  const location = `${booking.office.name}, ${booking.office.address}, ${booking.room.name}`;
  const description = booking.comment ? `DESCRIPTION:${escapeCalendarText(booking.comment)}` : null;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Meeting Rooms//Booking//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escapeCalendarText(booking.id)}@meeting-rooms`,
    `DTSTAMP:${formatCalendarDateTime(booking.createdAt)}`,
    `DTSTART:${formatCalendarDateTime(booking.startsAt)}`,
    `DTEND:${formatCalendarDateTime(booking.endsAt)}`,
    `SUMMARY:${escapeCalendarText(booking.title)}`,
    `LOCATION:${escapeCalendarText(location)}`,
    description,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter((line) => line !== null);

  return `${lines.join('\r\n')}\r\n`;
};

export const downloadBookingCalendar = (booking: Booking) => {
  const calendar = createBookingCalendar(booking);
  const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');

  link.href = url;
  link.download = `booking-${booking.startsAt.slice(0, 10)}-${booking.id}.ics`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
