import { describe, expect, it } from 'vitest';
import {
  formatDuration,
  formatRoomFilterDate,
  getDefaultRoomFilters,
  getLatestStartTime,
  getRoomFilterInterval,
} from '../../utils/roomFilters';

describe('room filters', () => {
  it('выбирает начало рабочего дня до открытия офиса', () => {
    expect(getDefaultRoomFilters(new Date('2026-08-26T03:00:00.000Z'), 'Europe/Moscow')).toEqual({
      date: '2026-08-26',
      startTime: '09:00',
      durationMinutes: 60,
      minCapacity: 4,
    });
  });

  it('округляет ближайшее будущее время до 15 минут', () => {
    expect(
      getDefaultRoomFilters(new Date('2026-08-26T12:02:00.000Z'), 'Europe/Moscow').startTime,
    ).toBe('15:15');
  });

  it('сокращает длительность, если до конца текущего рабочего дня помещается короткая бронь', () => {
    expect(
      getDefaultRoomFilters(new Date('2026-08-29T16:27:00.000Z'), 'Europe/Moscow'),
    ).toEqual({
      date: '2026-08-29',
      startTime: '19:30',
      durationMinutes: 30,
      minCapacity: 4,
    });
  });

  it('переносит интервал на следующий рабочий день, если не помещаются даже 15 минут', () => {
    expect(
      getDefaultRoomFilters(new Date('2026-08-29T16:50:00.000Z'), 'Europe/Moscow'),
    ).toEqual({
      date: '2026-08-30',
      startTime: '09:00',
      durationMinutes: 60,
      minCapacity: 4,
    });
  });

  it('форматирует дату и длительность как в макете', () => {
    expect(formatRoomFilterDate('2024-10-24')).toBe('24 Октября, Чт');
    expect(formatDuration(60)).toBe('1 час');
    expect(formatDuration(90)).toBe('1 ч. 30 мин.');
    expect(getLatestStartTime(60)).toBe('19:00');
  });

  it('переводит локальный интервал офиса в ISO для API', () => {
    expect(
      getRoomFilterInterval({
        date: '2026-08-27',
        startTime: '15:00',
        durationMinutes: 60,
        timeZone: 'Europe/Moscow',
      }),
    ).toEqual({
      from: '2026-08-27T12:00:00.000Z',
      to: '2026-08-27T13:00:00.000Z',
    });
  });

  it('не создаёт API-интервал из некорректной даты или времени', () => {
    expect(
      getRoomFilterInterval({
        date: '2026-02-31',
        startTime: '15:00',
        durationMinutes: 60,
        timeZone: 'Europe/Moscow',
      }),
    ).toBeUndefined();
    expect(
      getRoomFilterInterval({
        date: '2026-08-27',
        startTime: '25:00',
        durationMinutes: 60,
        timeZone: 'Europe/Moscow',
      }),
    ).toBeUndefined();
    expect(
      getRoomFilterInterval({
        date: '2026-08-27',
        startTime: '09:01',
        durationMinutes: 60,
        timeZone: 'Europe/Moscow',
      }),
    ).toBeUndefined();
    expect(
      getRoomFilterInterval({
        date: '2026-08-27',
        startTime: '09:15',
        durationMinutes: 16,
        timeZone: 'Europe/Moscow',
      }),
    ).toBeUndefined();
  });
});
