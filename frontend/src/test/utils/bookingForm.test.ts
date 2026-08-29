import { describe, expect, it } from 'vitest';
import { createBookingFormSchema } from '../../components/bookings/BookingDialog/schema';
import {
  createBookingInputs,
  formatBookingSummary,
  getBookingDurationOptions,
  getBookingEndTime,
  getBookingFormDefaults,
  getBookingOccurrenceOptions,
} from '../../components/bookings/BookingDialog/utils';

const createSchema = (getNow = () => new Date('2026-08-29T09:00:00.000Z')) =>
  createBookingFormSchema({ getNow, timeZone: 'Europe/Moscow' });

const validValues = {
  title: 'Планирование',
  date: '2026-08-30',
  startTime: '15:00',
  durationMinutes: 60,
  comment: '',
  isRecurring: false,
  occurrenceCount: 1,
};

describe('bookingFormSchema', () => {
  it('принимает корректный будущий интервал', () => {
    const schema = createSchema();
    expect(schema.safeParse(validValues).success).toBe(true);
  });

  it('отклоняет пустую тему и бронирование в прошлом', () => {
    const schema = createSchema();
    const result = schema.safeParse({
      ...validValues,
      title: ' ',
      date: '2026-08-28',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual(
        expect.arrayContaining(['Обязательное поле', 'Нельзя создать бронирование в прошлом']),
      );
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['date'],
          message: 'Нельзя создать бронирование в прошлом',
        }),
      );
    }
  });

  it('показывает ошибку на времени, если прошёл только выбранный интервал сегодня', () => {
    const schema = createSchema();
    const result = schema.safeParse({
      ...validValues,
      date: '2026-08-29',
      startTime: '11:45',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ path: ['startTime'], message: 'Выберите будущее время' }),
      );
      expect(result.error.issues).not.toContainEqual(
        expect.objectContaining({ path: ['date'], message: 'Выберите будущее время' }),
      );
    }
  });

  it('отклоняет интервал за пределами рабочих часов', () => {
    const schema = createSchema();
    const result = schema.safeParse({
      ...validValues,
      startTime: '19:30',
      durationMinutes: 60,
    });

    expect(result.success).toBe(false);
  });

  it('отклоняет бронирование дальше 30 дней', () => {
    const schema = createSchema();
    const result = schema.safeParse({
      ...validValues,
      date: '2026-09-29',
    });

    expect(result.success).toBe(false);
  });

  it('использует актуальное время в момент повторной валидации', () => {
    let now = new Date('2026-08-29T09:00:00.000Z');
    const schema = createSchema(() => now);
    const values = { ...validValues, date: '2026-08-29', startTime: '12:15' };

    expect(schema.safeParse(values).success).toBe(true);

    now = new Date('2026-08-29T09:16:00.000Z');
    const result = schema.safeParse(values);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ path: ['startTime'], message: 'Выберите будущее время' }),
      );
    }
  });

  it('показывает ошибку некорректного значения на поле времени', () => {
    const result = createSchema().safeParse({ ...validValues, startTime: 'bad-value' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ path: ['startTime'], message: 'Укажите корректное время' }),
      );
    }
  });

  it('ограничивает комментарий двумя тысячами символов', () => {
    const result = createSchema().safeParse({ ...validValues, comment: 'x'.repeat(2_001) });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ path: ['comment'], message: 'Не более 2000 символов' }),
      );
    }
  });

  it('разрешает еженедельную серию только в пределах 30 дней', () => {
    expect(
      createSchema().safeParse({
        ...validValues,
        isRecurring: true,
        occurrenceCount: 5,
      }).success,
    ).toBe(true);

    const result = createSchema().safeParse({
      ...validValues,
      date: '2026-09-15',
      isRecurring: true,
      occurrenceCount: 3,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['occurrenceCount'],
          message: 'Последняя встреча должна быть не позднее чем через 30 дней',
        }),
      );
    }
  });
});

describe('bookingForm utils', () => {
  it('ограничивает варианты повторов оставшимся горизонтом', () => {
    expect(getBookingOccurrenceOptions('2026-08-30', '2026-09-28')).toHaveLength(4);
    expect(getBookingOccurrenceOptions('2026-09-20', '2026-09-28')).toEqual([
      { value: '2', label: '2 встречи' },
    ]);
    expect(getBookingOccurrenceOptions('2026-09-22', '2026-09-28')).toEqual([]);
  });

  it('создаёт один запрос или недельную серию из значений формы', () => {
    expect(createBookingInputs(validValues, 'room-everest', 'Europe/Moscow')).toHaveLength(1);

    const series = createBookingInputs(
      { ...validValues, isRecurring: true, occurrenceCount: 3 },
      'room-everest',
      'Europe/Moscow',
    );

    expect(series.map((input) => input.startsAt)).toEqual([
      '2026-08-30T12:00:00.000Z',
      '2026-09-06T12:00:00.000Z',
      '2026-09-13T12:00:00.000Z',
    ]);
  });

  it('форматирует сводку и безопасно обрабатывает некорректное время', () => {
    expect(getBookingEndTime('bad-time', 60)).toBe('—:—');
    expect(getBookingDurationOptions('bad-time')).toEqual([]);
    expect(formatBookingSummary(validValues)).not.toContain('еженедельно');
    expect(formatBookingSummary(validValues, 5)).toContain('еженедельно · 5 встреч');
  });

  it('не принимает некорректную длительность из URL как значение по умолчанию', () => {
    const defaults = getBookingFormDefaults({
      date: '2026-08-30',
      search: 'start=15%3A00&duration=17',
      timeZone: 'Europe/Moscow',
      now: new Date('2026-08-29T09:00:00.000Z'),
    });

    expect(defaults.startTime).toBe('15:00');
    expect(defaults.durationMinutes).toBe(60);
    expect(defaults.isRecurring).toBe(false);
  });
});
