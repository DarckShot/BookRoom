export const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
export const TIME_PATTERN = /^(\d{2}):(\d{2})$/;
export const ZONED_DATE_TIME_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
export const DAY_AND_MONTH_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});
export const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'short',
  timeZone: 'UTC',
});
