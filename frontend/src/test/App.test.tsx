// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { act, cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getOffices } from '../api/offices';
import { getRooms } from '../api/rooms';
import type { Office } from '../types/office';
import { renderApp } from './utils/renderApp';

vi.mock('../api/offices', () => ({
  getOffices: vi.fn().mockResolvedValue([
    {
      id: 'office-moscow',
      name: 'Офис Москва',
      address: 'Москва, ул. Лесная, 7',
      timezone: 'Europe/Moscow',
    },
    {
      id: 'office-saint-petersburg',
      name: 'Офис Санкт-Петербург',
      address: 'Санкт-Петербург, наб. реки Карповки, 5',
      timezone: 'Europe/Moscow',
    },
  ]),
}));

vi.mock('../api/rooms', () => ({
  getRooms: vi.fn().mockResolvedValue([
    {
      id: 'room-everest',
      officeId: 'office-moscow',
      name: 'Эверест',
      floor: 4,
      capacity: 12,
      features: [],
      office: {
        id: 'office-moscow',
        name: 'Офис Москва',
        address: 'Москва, ул. Лесная, 7',
        timezone: 'Europe/Moscow',
      },
      available: true,
    },
  ]),
}));

vi.mock('../api/bookings', () => ({
  getBookings: vi.fn().mockResolvedValue([]),
  cancelBooking: vi.fn(),
  createBooking: vi.fn(),
  createBookingSeries: vi.fn(),
}));

vi.mock('../api/room', () => ({
  getRoom: vi.fn().mockImplementation(() => new Promise(() => undefined)),
  getRoomSchedule: vi.fn().mockResolvedValue([]),
}));

vi.mock('../api/users', () => ({
  getCurrentUser: vi.fn().mockImplementation(() => new Promise(() => undefined)),
}));

beforeEach(() => {
  vi.setSystemTime(new Date('2026-08-29T09:00:00.000Z'));
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

const selectOffice = async (user: ReturnType<typeof userEvent.setup>, officeName: string) => {
  await user.click(await screen.findByRole('combobox', { name: 'Выберите офис' }));
  await user.click(screen.getByRole('option', { name: officeName }));
};

describe('App layout', () => {
  it.each(['/rooms', '/rooms/everest', '/bookings', '/missing'])(
    'показывает хедер на маршруте %s',
    (path) => {
      renderApp(path);

      expect(screen.getByRole('banner')).toBeVisible();
      expect(screen.getByRole('navigation', { name: 'Основная навигация' })).toBeVisible();
    },
  );

  it('показывает выбранный офис только на странице переговорных', async () => {
    renderApp('/rooms?officeId=office-moscow');

    expect(await screen.findByRole('region', { name: 'Офис Москва' })).toBeVisible();
    expect(screen.getByText('ул. Лесная 7')).toBeVisible();
    expect(screen.getByText(/Местное время:/)).toBeVisible();
  });

  it('не показывает пустое состояние до восстановления офиса из URL', async () => {
    let resolveOffices: (offices: Office[]) => void = () => undefined;
    vi.mocked(getOffices).mockImplementationOnce(
      () =>
        new Promise<Office[]>((resolve) => {
          resolveOffices = resolve;
        }),
    );

    renderApp('/rooms?officeId=office-moscow');

    expect(screen.queryByRole('heading', { name: 'Выберите офис' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Загрузка переговорных…' })).toBeVisible();

    await act(async () => {
      resolveOffices([
        {
          id: 'office-moscow',
          name: 'Офис Москва',
          address: 'Москва, ул. Лесная, 7',
          timezone: 'Europe/Moscow',
        },
      ]);
    });

    expect(await screen.findByRole('region', { name: 'Офис Москва' })).toBeVisible();
    expect(
      await screen.findByRole('heading', { name: 'Доступные переговорные в этом офисе' }),
    ).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Выберите офис' })).not.toBeInTheDocument();
  });

  it('позволяет выбрать другой офис', async () => {
    const user = userEvent.setup();
    renderApp('/rooms');

    await selectOffice(user, 'Офис Санкт-Петербург');

    expect(screen.getByRole('region', { name: 'Офис Санкт-Петербург' })).toBeVisible();
    expect(screen.getByText('наб. реки Карповки 5')).toBeVisible();
  });

  it('сохраняет фильтры после перехода в бронирования и обратно', async () => {
    const user = userEvent.setup();
    renderApp(
      '/rooms?officeId=office-moscow&date=2026-08-27&start=15%3A00&duration=90&minCapacity=6',
    );

    expect(await screen.findByRole('region', { name: 'Офис Москва' })).toBeVisible();

    await user.click(screen.getByRole('link', { name: 'Мои бронирования' }));
    expect(screen.getByRole('heading', { name: 'Мои бронирования' })).toBeVisible();

    await user.click(screen.getByRole('link', { name: 'Переговорные' }));

    expect(await screen.findByRole('region', { name: 'Офис Москва' })).toBeVisible();
    expect(screen.getByLabelText('Дата бронирования')).toHaveTextContent('27 Августа, Чт');
    expect(screen.getByLabelText('Время начала')).toHaveValue('15:00');
    expect(screen.getByLabelText('Длительность')).toHaveTextContent('1 ч 30 мин');
    expect(screen.getByLabelText('Минимальная вместимость')).toHaveTextContent('Мин. 6 чел.');
  });

  it('отключает фильтры, пока офис не выбран', async () => {
    renderApp('/rooms');

    expect(await screen.findByRole('combobox', { name: 'Выберите офис' })).toHaveValue('');
    expect(screen.getByLabelText('Дата бронирования')).toBeDisabled();
    expect(screen.getByLabelText('Время начала')).toBeDisabled();
    expect(screen.getByLabelText('Длительность')).toBeDisabled();
    expect(screen.getByLabelText('Минимальная вместимость')).toBeDisabled();
    expect(screen.getByText('Выберите дату')).toBeVisible();
    expect(screen.getByText('Адрес не выбран')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Выберите офис' })).toBeVisible();
  });

  it('включает фильтры после выбора офиса', async () => {
    const user = userEvent.setup();
    renderApp('/rooms');

    await selectOffice(user, 'Офис Москва');

    expect(screen.getByLabelText('Дата бронирования')).toBeEnabled();
    expect(screen.getByLabelText('Время начала')).toBeEnabled();
    expect(screen.getByLabelText('Длительность')).toHaveTextContent('1 час');
    expect(screen.getByLabelText('Минимальная вместимость')).toHaveTextContent('Мин. 4 чел.');
  });

  it('позволяет управлять кастомными фильтрами', async () => {
    const user = userEvent.setup();
    renderApp('/rooms?officeId=office-moscow');

    const duration = await screen.findByRole('combobox', { name: 'Длительность' });
    await user.click(duration);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(duration).toHaveTextContent('1 ч 15 мин');

    await user.click(screen.getByRole('button', { name: 'Дата бронирования' }));
    expect(screen.getByRole('dialog', { name: 'Выбор даты' })).toBeVisible();

    const time = screen.getByRole<HTMLInputElement>('textbox', { name: 'Время начала' });
    const initialTime = time.value;
    await user.clear(time);
    await user.type(time, '0901');
    expect(time).toHaveValue('09:01');
    await user.tab();
    expect(time).toHaveValue(initialTime);

    await user.clear(time);
    await user.type(time, '0915');
    expect(time).toHaveValue('09:15');
  });

  it('показывает список переговорных и доступные действия', async () => {
    renderApp(
      '/rooms?officeId=office-moscow&date=2026-08-27&start=15%3A00&duration=60&minCapacity=4',
    );

    expect(
      await screen.findByRole('heading', { name: 'Доступные переговорные в этом офисе' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Эверест' })).toBeVisible();
    expect(screen.getByText('Вместимость: до 12 человек')).toBeVisible();
    expect(screen.getByText('Доступно на выбранное время')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Подробнее' })).toHaveAttribute(
      'href',
      expect.stringContaining('/rooms/room-everest'),
    );
    expect(screen.getByRole('link', { name: 'Забронировать' })).toBeVisible();
  });

  it('оставляет текущую дату доступной, пока помещается минимальная бронь', async () => {
    vi.setSystemTime(new Date('2026-08-29T16:27:00.000Z'));
    renderApp('/rooms?officeId=office-moscow');

    await screen.findByRole('region', { name: 'Офис Москва' });

    expect(screen.getByLabelText('Дата бронирования')).toHaveTextContent('29 Августа, Сб');
    expect(screen.getByLabelText('Время начала')).toHaveValue('19:30');
    expect(screen.getByLabelText('Длительность')).toHaveTextContent('30 мин');
    expect(await screen.findByRole('link', { name: 'Забронировать' })).toHaveAttribute(
      'href',
      expect.stringContaining('date=2026-08-29'),
    );
  });

  it('заменяет некорректные числовые URL-фильтры безопасными значениями', async () => {
    renderApp('/rooms?officeId=office-moscow&duration=invalid&minCapacity=-5');

    expect(
      await screen.findByRole('heading', { name: 'Доступные переговорные в этом офисе' }),
    ).toBeVisible();
    expect(getRooms).toHaveBeenCalledWith(
      expect.objectContaining({
        officeId: 'office-moscow',
        minCapacity: 4,
      }),
    );
  });

  it('не принимает время без шага 15 минут из URL', async () => {
    renderApp(
      '/rooms?officeId=office-moscow&date=2026-08-27&start=09%3A10&duration=60&minCapacity=4',
    );

    await screen.findByRole('heading', { name: 'Доступные переговорные в этом офисе' });
    const time = await screen.findByRole('textbox', { name: 'Время начала' });

    expect(time).not.toHaveValue('09:10');
    expect(getRooms).toHaveBeenCalledWith(
      expect.objectContaining({
        officeId: 'office-moscow',
      }),
    );
  });

  it('показывает skeleton-карточки во время загрузки переговорных', async () => {
    vi.mocked(getRooms).mockImplementationOnce(() => new Promise(() => undefined));
    renderApp('/rooms?officeId=office-moscow');

    expect(await screen.findByRole('heading', { name: 'Загрузка переговорных…' })).toBeVisible();
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    await waitFor(() => expect(getRooms).toHaveBeenCalledOnce());
  });

  it('показывает ошибку загрузки переговорных и позволяет повторить запрос', async () => {
    vi.mocked(getRooms).mockRejectedValueOnce(new Error('Network error'));
    const user = userEvent.setup();
    renderApp('/rooms?officeId=office-moscow');

    const errorState = await screen.findByRole('alert');

    expect(errorState).toHaveTextContent('Не удалось загрузить данные');
    expect(errorState).toHaveTextContent('Произошла ошибка при загрузке списка переговорных');
    expect(screen.queryByText('Соединение потеряно. Переподключение...')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Попробовать снова' }));

    expect(
      await screen.findByRole('heading', { name: 'Доступные переговорные в этом офисе' }),
    ).toBeVisible();
    expect(getRooms).toHaveBeenCalledTimes(2);
  });

  it('показывает состояние WebSocket-соединения, не скрывая REST-данные', async () => {
    const reconnect = vi.fn();
    const user = userEvent.setup();
    renderApp('/rooms?officeId=office-moscow', {
      connectionStatus: 'reconnecting',
      onReconnect: reconnect,
    });

    expect(
      await screen.findByRole('heading', { name: 'Доступные переговорные в этом офисе' }),
    ).toBeVisible();
    expect(screen.getByText('Соединение потеряно. Переподключение...')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Повторить сейчас' }));

    expect(reconnect).toHaveBeenCalledOnce();
  });

  it('не показывает служебное состояние при первоначальном подключении WebSocket', async () => {
    renderApp('/rooms?officeId=office-moscow', { connectionStatus: 'connecting' });

    expect(
      await screen.findByRole('heading', { name: 'Доступные переговорные в этом офисе' }),
    ).toBeVisible();
    expect(screen.queryByText('Соединение потеряно. Переподключение...')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Повторить сейчас' })).not.toBeInTheDocument();
  });

  it('показывает пустое состояние для пустого ответа комнат и сбрасывает фильтры', async () => {
    vi.mocked(getRooms).mockResolvedValueOnce([]);
    const user = userEvent.setup();
    renderApp(
      '/rooms?officeId=office-saint-petersburg&minCapacity=12&date=2026-08-27&start=15%3A00&duration=60',
    );

    expect(
      await screen.findByRole('heading', { name: 'Нет доступных переговорных' }),
    ).toBeVisible();
    expect(
      screen.getByText('Попробуйте изменить параметры фильтрации или выбрать другой офис'),
    ).toBeVisible();
    expect(getRooms).toHaveBeenCalledWith({
      officeId: 'office-saint-petersburg',
      minCapacity: 12,
      from: '2026-08-27T12:00:00.000Z',
      to: '2026-08-27T13:00:00.000Z',
    });

    await user.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));

    expect(await screen.findByRole('heading', { name: 'Выберите офис' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Выберите офис' })).toHaveValue('');
    expect(screen.getByLabelText('Дата бронирования')).toBeDisabled();
    expect(getRooms).toHaveBeenCalledTimes(1);
  });

  it('показывает понятную ошибку загрузки офисов', async () => {
    vi.mocked(getOffices).mockRejectedValueOnce(new Error('Network error'));
    renderApp('/rooms');

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить офисы');
    expect(screen.getByRole('button', { name: 'Повторить' })).toBeVisible();
  });

  it('показывает пустое состояние, если офисов нет', async () => {
    vi.mocked(getOffices).mockResolvedValueOnce([]);
    renderApp('/rooms');

    expect(await screen.findByText('Офисы не найдены')).toBeVisible();
  });

  it.each(['/rooms/everest', '/bookings', '/missing'])(
    'не показывает панель офиса на маршруте %s',
    (path) => {
      renderApp(path);

      expect(screen.queryByRole('region', { name: 'Офис Москва' })).not.toBeInTheDocument();
    },
  );
});
