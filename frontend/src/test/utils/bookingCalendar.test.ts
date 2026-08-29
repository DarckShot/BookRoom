import { describe, expect, it } from 'vitest';
import { createBookingCalendar } from '../../utils/bookingCalendar';
import { createBookingFixture } from '../fixtures/booking';

describe('bookingCalendar', () => {
  it('создаёт валидное UTC-событие и экранирует пользовательский текст', () => {
    const calendar = createBookingCalendar(
      createBookingFixture({
        id: 'booking-calendar',
        title: 'Демо, релиз; итоги',
        comment: 'Строка 1\nСтрока \\ 2',
        startsAt: '2026-08-30T08:00:00.000Z',
        endsAt: '2026-08-30T09:00:00.000Z',
      }),
    );

    expect(calendar).toContain('BEGIN:VCALENDAR\r\n');
    expect(calendar).toContain('BEGIN:VEVENT\r\n');
    expect(calendar).toContain('UID:booking-calendar@meeting-rooms\r\n');
    expect(calendar).toContain('DTSTART:20260830T080000Z\r\n');
    expect(calendar).toContain('DTEND:20260830T090000Z\r\n');
    expect(calendar).toContain('SUMMARY:Демо\\, релиз\\; итоги\r\n');
    expect(calendar).toContain('DESCRIPTION:Строка 1\\nСтрока \\\\ 2\r\n');
    expect(calendar).toContain('LOCATION:Офис Москва\\, Москва\\, ул. Лесная\\, 7\\, Эверест');
    expect(calendar.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });
});
