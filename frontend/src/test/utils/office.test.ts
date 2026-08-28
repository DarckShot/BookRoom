import { describe, expect, it } from 'vitest';
import { formatOfficeAddress, formatOfficeTime, getTimeZoneLabel } from '../../utils/office';

describe('office formatting', () => {
  it('приводит адрес офиса к формату макета', () => {
    expect(formatOfficeAddress('Москва, ул. Лесная, 7')).toBe('ул. Лесная 7');
  });

  it('форматирует время в часовом поясе офиса', () => {
    expect(formatOfficeTime(new Date('2026-08-26T12:00:00.000Z'), 'Europe/Moscow')).toBe('15:00');
  });

  it('использует короткое обозначение Москвы и IANA-имя остальных зон', () => {
    expect(getTimeZoneLabel('Europe/Moscow')).toBe('MSK');
    expect(getTimeZoneLabel('Asia/Yekaterinburg')).toBe('Asia/Yekaterinburg');
  });
});
