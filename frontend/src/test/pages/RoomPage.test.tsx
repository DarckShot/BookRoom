// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createBooking } from '../../api/bookings';
import { getRoom, getRoomSchedule } from '../../api/room';
import { getCurrentUser } from '../../api/users';
import { getRoomFilterInterval } from '../../utils/roomFilters';
import { getRoomScheduleInterval } from '../../utils/roomSchedule';
import { createBookingFixture, currentUserFixture, roomFixture } from '../fixtures/booking';
import { renderApp } from '../utils/renderApp';

vi.mock('../../api/room', () => ({
  getRoom: vi.fn(),
  getRoomSchedule: vi.fn(),
}));

vi.mock('../../api/users', () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock('../../api/bookings', () => ({
  createBooking: vi.fn(),
  getBookings: vi.fn(),
  cancelBooking: vi.fn(),
}));

const today = '2026-08-29';
const scheduleDate = '2026-08-30';

beforeEach(() => {
  vi.setSystemTime(new Date('2026-08-29T09:00:00.000Z'));
  vi.mocked(getRoom).mockResolvedValue(roomFixture);
  vi.mocked(getCurrentUser).mockResolvedValue(currentUserFixture);
  vi.mocked(getRoomSchedule).mockResolvedValue([
    createBookingFixture({
      id: 'booking-own',
      userId: currentUserFixture.id,
      title: 'Daily Sync',
    }),
    createBookingFixture({ id: 'booking-other', userId: 'user-anna', title: 'Секретная встреча' }),
  ]);
  vi.mocked(createBooking).mockResolvedValue(
    createBookingFixture({
      id: 'booking-created',
      userId: currentUserFixture.id,
      title: 'Новая встреча',
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('RoomPage', () => {
  it('показывает данные комнаты и скрывает названия чужих встреч', async () => {
    renderApp(`/rooms/room-everest?date=${scheduleDate}`);

    expect(await screen.findByRole('heading', { name: 'Эверест' })).toBeVisible();
    expect(screen.getByText('Офис Москва · ул. Лесная 7')).toBeVisible();
    expect(screen.getByText('Вместимость: до 12 человек')).toBeVisible();
    expect(screen.getByText('Проектор и ТВ-панель 4К')).toBeVisible();
    expect(await screen.findByRole('heading', { name: 'Расписание на день' })).toBeVisible();
    expect(screen.getByText('Daily Sync')).toBeVisible();
    expect(screen.getByText('Занято')).toBeVisible();
    expect(screen.queryByText('Секретная встреча')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Забронировать комнату' })).toBeVisible();
  });

  it('запрашивает расписание на текущую дату офиса', async () => {
    const interval = getRoomScheduleInterval(today, roomFixture.office.timezone);
    renderApp('/rooms/room-everest');

    await screen.findByRole('heading', { name: 'Расписание на день' });

    expect(getRoomSchedule).toHaveBeenCalledWith(roomFixture.id, interval);
    expect(screen.getByLabelText('Дата бронирования')).toHaveTextContent('Выбрать дату');
  });

  it('показывает полный skeleton при первоначальной загрузке', () => {
    vi.mocked(getRoom).mockImplementationOnce(() => new Promise(() => undefined));
    renderApp('/rooms/room-everest');

    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByLabelText('Загрузка переговорной')).toBeVisible();
  });

  it('оставляет карточку комнаты при ошибке расписания и повторяет запрос', async () => {
    vi.mocked(getRoomSchedule).mockRejectedValueOnce(new Error('Network error'));
    const user = userEvent.setup();
    renderApp(`/rooms/room-everest?date=${scheduleDate}`);

    expect(await screen.findByRole('heading', { name: 'Эверест' })).toBeVisible();
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить расписание');

    await user.click(screen.getByRole('button', { name: 'Попробовать снова' }));

    expect(await screen.findByRole('heading', { name: 'Расписание на день' })).toBeVisible();
    expect(getRoomSchedule).toHaveBeenCalledTimes(2);
  });

  it('показывает ошибку расписания при потере realtime-соединения', async () => {
    const reconnect = vi.fn();
    const user = userEvent.setup();
    renderApp(`/rooms/room-everest?date=${scheduleDate}`, {
      connectionStatus: 'reconnecting',
      onReconnect: reconnect,
    });

    expect(await screen.findByRole('heading', { name: 'Эверест' })).toBeVisible();
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить расписание');

    await user.click(screen.getByRole('button', { name: 'Попробовать снова' }));

    expect(reconnect).toHaveBeenCalledOnce();
  });

  it('открывает форму бронирования с интервалом из URL', async () => {
    const user = userEvent.setup();
    renderApp(
      `/rooms/room-everest?date=${scheduleDate}&start=15%3A00&duration=60&officeId=office-moscow`,
    );

    await user.click(await screen.findByRole('button', { name: 'Забронировать комнату' }));
    const dialog = await screen.findByRole('dialog', { name: 'Новое бронирование' });

    expect(dialog).toHaveTextContent('Переговорная: Эверест (Офис Москва, 4 этаж)');
    expect(within(dialog).getByRole('button', { name: 'Дата бронирования' })).toHaveTextContent(
      '30 Августа, Вс',
    );
    expect(within(dialog).getByRole('textbox', { name: 'Время начала' })).toHaveValue('15:00');
    expect(
      within(dialog).getByRole('combobox', { name: 'Продолжительность бронирования' }),
    ).toHaveTextContent('1 час (до 16:00)');
  });

  it('открывает форму с временем выбранного свободного слота расписания', async () => {
    const user = userEvent.setup();
    renderApp(`/rooms/room-everest?date=${scheduleDate}`);

    await user.click(await screen.findByRole('button', { name: 'Забронировать на 14:15' }));
    const dialog = await screen.findByRole('dialog', { name: 'Новое бронирование' });

    expect(within(dialog).getByRole('textbox', { name: 'Время начала' })).toHaveValue('14:15');
    expect(
      screen.queryByRole('button', { name: 'Забронировать на 11:00' }),
    ).not.toBeInTheDocument();
  });

  it('показывает ошибки обязательных полей', async () => {
    const user = userEvent.setup();
    renderApp(`/rooms/room-everest?date=${scheduleDate}&start=15%3A00&duration=60`);

    await user.click(await screen.findByRole('button', { name: 'Забронировать комнату' }));
    const dialog = await screen.findByRole('dialog', { name: 'Новое бронирование' });
    const comment = within(dialog).getByRole('textbox', { name: 'Комментарий' });
    fireEvent.change(comment, { target: { value: 'x'.repeat(2_001) } });
    await user.click(within(dialog).getByRole('button', { name: 'Забронировать' }));

    expect(await within(dialog).findByText('Обязательное поле')).toBeVisible();
    expect(within(dialog).getByRole('textbox', { name: 'Тема встречи *' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(comment).toHaveAttribute('aria-invalid', 'true');
    expect(within(dialog).getByText('Не более 2000 символов')).toBeVisible();
    expect(createBooking).not.toHaveBeenCalled();
  });

  it('создаёт бронирование, обновляет расписание и показывает success-toast', async () => {
    const user = userEvent.setup();
    renderApp(`/rooms/room-everest?date=${scheduleDate}&start=15%3A00&duration=60`);

    await user.click(await screen.findByRole('button', { name: 'Забронировать комнату' }));
    const dialog = await screen.findByRole('dialog', { name: 'Новое бронирование' });
    await user.type(within(dialog).getByRole('textbox', { name: 'Тема встречи *' }), 'Демо');
    await user.type(within(dialog).getByRole('textbox', { name: 'Комментарий' }), 'Обсудить релиз');
    await user.click(within(dialog).getByRole('button', { name: 'Забронировать' }));

    const interval = getRoomFilterInterval({
      date: scheduleDate,
      startTime: '15:00',
      durationMinutes: 60,
      timeZone: roomFixture.office.timezone,
    });
    expect(createBooking).toHaveBeenCalledWith({
      roomId: roomFixture.id,
      title: 'Демо',
      comment: 'Обсудить релиз',
      startsAt: interval?.from,
      endsAt: interval?.to,
    });
    expect(await screen.findByRole('status')).toHaveTextContent('Бронирование создано');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('обрабатывает 409 и сохраняет введённые данные', async () => {
    vi.mocked(createBooking).mockRejectedValueOnce(
      Object.assign(new Error('Conflict'), {
        isAxiosError: true,
        response: {
          status: 409,
          data: { error: { code: 'BOOKING_CONFLICT', message: 'Время занято' } },
        },
      }),
    );
    const user = userEvent.setup();
    renderApp(`/rooms/room-everest?date=${scheduleDate}&start=15%3A00&duration=60`);

    await user.click(await screen.findByRole('button', { name: 'Забронировать комнату' }));
    const dialog = await screen.findByRole('dialog', { name: 'Новое бронирование' });
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Тема встречи *' }),
      'Планирование',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Забронировать' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Время уже занято');
    await user.click(screen.getByRole('button', { name: 'Выбрать другое время' }));

    expect(await screen.findByRole('dialog', { name: 'Новое бронирование' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Тема встречи *' })).toHaveValue('Планирование');
  });
});
