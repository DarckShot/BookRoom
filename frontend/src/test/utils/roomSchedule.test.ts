import { describe, expect, it } from 'vitest';
import { createBookingFixture } from '../fixtures/booking';
import {
  getAvailableRoomScheduleSlots,
  getBookingPlacement,
  getMinimumBookingStartTime,
  getRoomScheduleHourPosition,
  getRoomScheduleInterval,
  isValidRoomScheduleDate,
} from '../../utils/roomSchedule';

const booking = createBookingFixture();

describe('roomSchedule', () => {
  it('рассчитывает положение часовых линий относительно рабочего дня', () => {
    expect(getRoomScheduleHourPosition(9)).toBe('0%');
    expect(getRoomScheduleHourPosition(14.5)).toBe('50%');
    expect(getRoomScheduleHourPosition(20)).toBe('100%');
  });

  it('создаёт границы локального дня офиса', () => {
    expect(getRoomScheduleInterval('2026-08-30', 'Europe/Moscow')).toEqual({
      from: '2026-08-29T21:00:00.000Z',
      to: '2026-08-30T21:00:00.000Z',
    });
  });

  it('позиционирует встречу относительно рабочих часов офиса', () => {
    expect(getBookingPlacement(booking, 'Europe/Moscow')).toEqual({
      booking,
      top: 18.181818181818183,
      height: 9.090909090909092,
    });
  });

  it('создаёт кликабельные 15-минутные слоты только для свободного времени', () => {
    const slots = getAvailableRoomScheduleSlots([booking], 'Europe/Moscow');
    const startTimes = slots.map(({ startTime }) => startTime);

    expect(startTimes).toHaveLength(40);
    expect(startTimes).toContain('10:45');
    expect(startTimes).not.toContain('11:00');
    expect(startTimes).not.toContain('11:45');
    expect(startTimes).toContain('12:00');
  });

  it('не создаёт кликабельные слоты для уже прошедшего времени', () => {
    const slots = getAvailableRoomScheduleSlots([], 'Europe/Moscow', '15:15');
    const startTimes = slots.map(({ startTime }) => startTime);

    expect(startTimes).not.toContain('15:00');
    expect(startTimes).toContain('15:15');
  });

  it('определяет ближайшее доступное время относительно выбранной даты', () => {
    const now = new Date('2026-08-29T12:01:00.000Z');

    expect(getMinimumBookingStartTime('2026-08-29', now, 'Europe/Moscow')).toBe('15:15');
    expect(getMinimumBookingStartTime('2026-08-30', now, 'Europe/Moscow')).toBe('09:00');
  });

  it('отклоняет несуществующую календарную дату', () => {
    expect(isValidRoomScheduleDate('2026-02-30')).toBe(false);
    expect(isValidRoomScheduleDate('2026-08-30')).toBe(true);
  });
});
