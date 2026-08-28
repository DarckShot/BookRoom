export const WORKING_DAY_START_MINUTES = 9 * 60;
export const WORKING_DAY_END_MINUTES = 20 * 60;
export const DEFAULT_DURATION_MINUTES = 60;
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
