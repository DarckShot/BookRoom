import {
  BUILDING_NUMBER_PATTERN,
  CITY_PREFIX_PATTERN,
  OFFICE_TIME_FORMATTERS,
} from './office.constants';

export const formatOfficeAddress = (address: string) =>
  address.replace(CITY_PREFIX_PATTERN, '').replace(BUILDING_NUMBER_PATTERN, ' $1');

export const formatOfficeTime = (date: Date, timeZone: string) => {
  const cachedFormatter = OFFICE_TIME_FORMATTERS.get(timeZone);

  if (cachedFormatter) {
    return cachedFormatter.format(date);
  }

  const formatter = new Intl.DateTimeFormat('ru-RU', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  OFFICE_TIME_FORMATTERS.set(timeZone, formatter);

  return formatter.format(date);
};

export const getTimeZoneLabel = (timeZone: string) =>
  timeZone === 'Europe/Moscow' ? 'MSK' : timeZone;
