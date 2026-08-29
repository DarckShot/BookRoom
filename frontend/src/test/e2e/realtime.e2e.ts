import { expect, test, type WebSocketRoute } from '@playwright/test';
import {
  createBookingInput,
  createBookingThroughApi,
  formatIsoDateInMoscow,
  getRoomCard,
  getSeedFutureBooking,
  resetTestData,
} from './helpers';

test.beforeEach(async ({ request }) => {
  await resetTestData(request);
});

test('WebSocket обновляет расписание открытой комнаты без перезагрузки', async ({
  page,
  request,
}) => {
  const date = formatIsoDateInMoscow((await getSeedFutureBooking(request)).startsAt);
  const title = 'Realtime расписание';

  await page.goto(`/rooms/room-altai?date=${date}`);
  await expect(page.getByRole('heading', { name: 'Расписание на день' })).toBeVisible();
  await createBookingThroughApi(
    request,
    createBookingInput({
      roomId: 'room-altai',
      title,
      date,
      startTime: '10:00',
      durationMinutes: 15,
    }),
  );

  await expect(page.getByTitle(title)).toBeVisible();
});

test('WebSocket обновляет доступность всего списка комнат без перезагрузки', async ({
  page,
  request,
}) => {
  const date = formatIsoDateInMoscow((await getSeedFutureBooking(request)).startsAt);
  await page.goto(
    `/rooms?officeId=office-moscow&date=${date}&start=10%3A00&duration=15&minCapacity=4`,
  );
  const altai = getRoomCard(page, 'Алтай');
  await expect(altai).toContainText('Доступно на выбранное время');

  await createBookingThroughApi(
    request,
    createBookingInput({
      roomId: 'room-altai',
      title: 'Realtime список',
      date,
      startTime: '10:00',
      durationMinutes: 15,
    }),
  );

  await expect(altai).toContainText('Недоступно на выбранное время');
  await expect(altai.getByRole('button', { name: 'Забронировать' })).toBeDisabled();
});

test('WebSocket удаляет отменённое бронирование из открытого расписания', async ({
  page,
  request,
}) => {
  const date = formatIsoDateInMoscow((await getSeedFutureBooking(request)).startsAt);
  const title = 'Realtime отмена';
  const booking = await createBookingThroughApi(
    request,
    createBookingInput({
      roomId: 'room-altai',
      title,
      date,
      startTime: '12:00',
      durationMinutes: 15,
    }),
  );
  await page.goto(`/rooms/room-altai?date=${date}`);
  await expect(page.getByTitle(title)).toBeVisible();

  const cancellation = await request.delete(`/api/v1/bookings/${booking.id}`);
  expect(cancellation.status()).toBe(204);

  await expect(page.getByTitle(title)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Забронировать на 12:00' })).toBeVisible();
});

test('после reconnect показывает статус и делает REST-resync пропущенных событий', async ({
  page,
  request,
}) => {
  const date = formatIsoDateInMoscow((await getSeedFutureBooking(request)).startsAt);
  const title = 'Пропущено во время reconnect';
  let firstSocket: WebSocketRoute | undefined;
  let connectionCount = 0;
  await page.routeWebSocket('**/api/v1/ws', (socket) => {
    connectionCount += 1;

    if (connectionCount === 1) {
      firstSocket = socket;
      return;
    }

    socket.connectToServer();
  });
  await page.goto(`/rooms/room-altai?date=${date}`);
  await expect(page.getByRole('heading', { name: 'Расписание на день' })).toBeVisible();

  expect(firstSocket).toBeDefined();

  if (!firstSocket) {
    throw new Error('Initial WebSocket connection was not intercepted');
  }

  await firstSocket.close();
  await expect(page.getByText('Соединение потеряно. Переподключение...')).toBeVisible({
    timeout: 10_000,
  });
  await createBookingThroughApi(
    request,
    createBookingInput({
      roomId: 'room-altai',
      title,
      date,
      startTime: '11:00',
      durationMinutes: 15,
    }),
  );

  await page.getByRole('button', { name: 'Повторить сейчас' }).click();
  await expect(page.getByText('Соединение потеряно. Переподключение...')).toHaveCount(0, {
    timeout: 10_000,
  });
  await expect(page.getByTitle(title)).toBeVisible();
});
