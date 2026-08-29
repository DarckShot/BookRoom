export const ROOM_SCHEDULE_DAY_DURATION_MINUTES = 24 * 60;
export const ROOM_SCHEDULE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const ROOM_SCHEDULE_DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});
