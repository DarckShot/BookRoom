// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { act, cleanup, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cancelBooking, getBookings } from '../../api/bookings';
import { getOffices } from '../../api/offices';
import { createBookingFixture, roomFixture } from '../fixtures/booking';
import { renderApp } from '../utils/renderApp';

vi.mock('../../api/bookings', () => ({
  getBookings: vi.fn(),
  cancelBooking: vi.fn(),
  createBooking: vi.fn(),
  createBookingSeries: vi.fn(),
}));

vi.mock('../../api/offices', () => ({
  getOffices: vi.fn(),
}));

const futureBooking = createBookingFixture({
  id: 'booking-future',
  title: 'Daily Sync: Разработка & Продукт',
  startsAt: '2026-08-30T08:00:00.000Z',
  endsAt: '2026-08-30T09:00:00.000Z',
});
const pastBooking = createBookingFixture({
  id: 'booking-past',
  title: 'Ретроспектива команды',
  startsAt: '2026-08-28T12:00:00.000Z',
  endsAt: '2026-08-28T13:00:00.000Z',
});

beforeEach(() => {
  vi.setSystemTime(new Date('2026-08-29T09:00:00.000Z'));
  vi.mocked(getOffices).mockResolvedValue([
    roomFixture.office,
    {
      id: 'office-saint-petersburg',
      name: 'Офис Санкт-Петербург',
      address: 'Санкт-Петербург, наб. реки Карповки, 5',
      timezone: 'Europe/Moscow',
    },
  ]);
  vi.mocked(getBookings).mockResolvedValue([pastBooking, futureBooking]);
  vi.mocked(cancelBooking).mockResolvedValue();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('BookingsPage', () => {
  it('показывает предстоящие бронирования и их локальное время', async () => {
    renderApp('/bookings');

    expect(
      await screen.findByRole('heading', { name: 'Daily Sync: Разработка & Продукт' }),
    ).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Предстоящие (1)' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('АВГУСТ')).toBeVisible();
    expect(screen.getByText('30')).toBeVisible();
    expect(screen.getByText('Эверест')).toBeVisible();
    expect(screen.getByText('4 этаж')).toBeVisible();
    expect(screen.getByText('11:00 - 12:00 MSK')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Отменить' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'В календарь' })).toBeVisible();
    expect(screen.queryByText('Ретроспектива команды')).not.toBeInTheDocument();
    expect(getBookings).toHaveBeenCalledWith({ scope: 'all' });
  });

  it('показывает reconnect поверх загруженных бронирований', async () => {
    const reconnect = vi.fn();
    const user = userEvent.setup();
    renderApp('/bookings', { connectionStatus: 'reconnecting', onReconnect: reconnect });

    expect(
      await screen.findByRole('heading', { name: 'Daily Sync: Разработка & Продукт' }),
    ).toBeVisible();
    expect(screen.getByText('Соединение потеряно. Переподключение...')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Повторить сейчас' }));
    expect(reconnect).toHaveBeenCalledOnce();
  });

  it('скачивает бронирование в формате iCalendar', async () => {
    const createObjectURL = vi.fn(() => 'blob:booking-calendar');
    const revokeObjectURL = vi.fn();
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    const user = userEvent.setup();
    renderApp('/bookings');

    await user.click(await screen.findByRole('button', { name: 'В календарь' }));

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:booking-calendar');
  });

  it('переключается на прошедшие бронирования без возможности отмены', async () => {
    const user = userEvent.setup();
    renderApp('/bookings');

    await screen.findByText('Daily Sync: Разработка & Продукт');
    await user.click(screen.getByRole('tab', { name: 'Прошедшие' }));

    expect(await screen.findByText('Ретроспектива команды')).toBeVisible();
    expect(screen.queryByText('Daily Sync: Разработка & Продукт')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Отменить' })).not.toBeInTheDocument();
  });

  it('фильтрует запрос по офису и список по периоду', async () => {
    const user = userEvent.setup();
    renderApp('/bookings');

    await screen.findByText('Daily Sync: Разработка & Продукт');
    await user.click(screen.getByRole('combobox', { name: 'Офис' }));
    await user.click(screen.getByRole('option', { name: 'Офис Санкт-Петербург' }));

    await waitFor(() => {
      expect(getBookings).toHaveBeenLastCalledWith({
        scope: 'all',
        officeId: 'office-saint-petersburg',
      });
    });

    await user.click(screen.getByRole('combobox', { name: 'Период' }));
    await user.click(screen.getByRole('option', { name: 'Сегодня' }));

    expect(await screen.findByRole('heading', { name: 'Нет бронирований' })).toBeVisible();
  });

  it('показывает skeleton во время загрузки', async () => {
    vi.mocked(getBookings).mockImplementationOnce(() => new Promise(() => undefined));
    renderApp('/bookings');

    expect(await screen.findByRole('heading', { name: 'Загрузка бронирований…' })).toBeVisible();
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
  });

  it('показывает пустое состояние и переход к переговорным', async () => {
    vi.mocked(getBookings).mockResolvedValueOnce([]);
    renderApp('/bookings');

    expect(await screen.findByRole('heading', { name: 'Нет бронирований' })).toBeVisible();
    expect(screen.getByText(/У вас пока нет предстоящих бронирований/)).toBeVisible();
    expect(screen.getByRole('link', { name: 'Перейти к переговорным' })).toHaveAttribute(
      'href',
      '/rooms',
    );
  });

  it('показывает ошибку загрузки и повторяет запрос', async () => {
    vi.mocked(getBookings)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce([]);
    const user = userEvent.setup();
    renderApp('/bookings');

    const errorState = await screen.findByRole('alert');
    expect(errorState).toHaveTextContent('Не удалось загрузить данные');
    expect(errorState).toHaveTextContent('Произошла ошибка при загрузке ваших бронирований');

    await user.click(screen.getByRole('button', { name: 'Попробовать снова' }));

    expect(await screen.findByRole('heading', { name: 'Нет бронирований' })).toBeVisible();
    expect(getBookings).toHaveBeenCalledTimes(2);
  });

  it('оптимистично убирает бронирование и сверяется с backend после ответа', async () => {
    vi.mocked(getBookings).mockResolvedValueOnce([futureBooking]).mockResolvedValue([]);
    let resolveCancellation: (() => void) | undefined;
    vi.mocked(cancelBooking).mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveCancellation = resolve;
        }),
    );
    const user = userEvent.setup();
    renderApp('/bookings');

    await user.click(await screen.findByRole('button', { name: 'Отменить' }));
    const dialog = screen.getByRole('dialog', { name: 'Отменить бронирование?' });

    expect(dialog).toHaveTextContent('Daily Sync: Разработка & Продукт');
    expect(dialog).toHaveTextContent('Комната «Эверест», 4 этаж');
    expect(dialog).toHaveTextContent('Воскресенье, 30 августа, 11:00 - 12:00');

    await user.click(within(dialog).getByRole('button', { name: 'Нет, оставить' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Отменить' }));
    await user.click(screen.getByRole('button', { name: 'Да, отменить' }));

    expect(cancelBooking).toHaveBeenCalledWith('booking-future', expect.any(Object));
    expect(await screen.findByRole('heading', { name: 'Нет бронирований' })).toBeVisible();

    act(() => resolveCancellation?.());
    await waitFor(() => expect(getBookings).toHaveBeenCalledTimes(2));
  });

  it('сохраняет подтверждение открытым при ошибке отмены', async () => {
    vi.mocked(cancelBooking).mockRejectedValueOnce(new Error('Network error'));
    const user = userEvent.setup();
    renderApp('/bookings');

    await user.click(await screen.findByRole('button', { name: 'Отменить' }));
    await user.click(screen.getByRole('button', { name: 'Да, отменить' }));

    const dialog = screen.getByRole('dialog', { name: 'Отменить бронирование?' });
    expect(
      within(dialog).getByText('Не удалось отменить бронирование. Попробуйте снова'),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Daily Sync: Разработка & Продукт' })).toBeVisible();
  });
});
