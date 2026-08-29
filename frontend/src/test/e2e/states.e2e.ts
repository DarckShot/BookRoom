import { expect, test } from '@playwright/test';
import {
  formatIsoDateInMoscow,
  getSeedFutureBooking,
  openBookingForm,
  resetTestData,
} from './helpers';

test.beforeEach(async ({ request }) => {
  await resetTestData(request);
});

test('список комнат показывает loading, empty и error с повтором запроса', async ({
  page,
  request,
}) => {
  const date = formatIsoDateInMoscow((await getSeedFutureBooking(request)).startsAt);
  let finishLoading: (() => void) | undefined;
  await page.route('**/api/v1/rooms?*', async (route) => {
    await new Promise<void>((resolve) => {
      finishLoading = resolve;
    });
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"items":[]}' });
  });

  await page.goto(
    `/rooms?officeId=office-moscow&date=${date}&start=09%3A00&duration=60&minCapacity=4`,
  );
  await expect(page.getByRole('heading', { name: 'Загрузка переговорных…' })).toBeVisible();
  await expect.poll(() => finishLoading).toBeDefined();
  finishLoading?.();
  await expect(page.getByRole('heading', { name: 'Нет доступных переговорных' })).toBeVisible();

  await page.unroute('**/api/v1/rooms?*');
  let shouldFail = true;
  await page.route('**/api/v1/rooms?*', async (route) => {
    if (shouldFail) {
      await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
      return;
    }

    await route.continue();
  });
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('Не удалось загрузить данные');

  shouldFail = false;
  await page.getByRole('button', { name: 'Попробовать снова' }).click();
  await expect(
    page.getByRole('heading', { name: 'Доступные переговорные в этом офисе' }),
  ).toBeVisible();
});

test('страница комнаты показывает loading и отдельную ошибку расписания', async ({
  page,
  request,
}) => {
  const date = formatIsoDateInMoscow((await getSeedFutureBooking(request)).startsAt);
  let releaseSchedule: (() => void) | undefined;
  let scheduleRequestCount = 0;
  await page.route('**/api/v1/rooms/room-everest/bookings?*', async (route) => {
    scheduleRequestCount += 1;

    if (scheduleRequestCount === 1) {
      await new Promise<void>((resolve) => {
        releaseSchedule = resolve;
      });
    }

    await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
  });

  await page.goto(`/rooms/room-everest?date=${date}`);
  await expect(page.getByLabel('Загрузка расписания')).toBeVisible();
  await expect.poll(() => releaseSchedule).toBeDefined();
  releaseSchedule?.();
  await expect(page.getByRole('alert')).toContainText('Не удалось загрузить расписание');

  await page.unroute('**/api/v1/rooms/room-everest/bookings?*');
  await page.getByRole('button', { name: 'Попробовать снова' }).click();
  await expect(page.getByRole('heading', { name: 'Расписание на день' })).toBeVisible();
});

test('мои бронирования показывают loading, empty и error с повтором запроса', async ({ page }) => {
  let finishLoading: (() => void) | undefined;
  await page.route('**/api/v1/bookings?*', async (route) => {
    await new Promise<void>((resolve) => {
      finishLoading = resolve;
    });
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"items":[]}' });
  });

  await page.goto('/bookings');
  await expect(page.getByRole('heading', { name: 'Загрузка бронирований…' })).toBeVisible();
  await expect.poll(() => finishLoading).toBeDefined();
  finishLoading?.();
  await expect(page.getByRole('heading', { name: 'Нет бронирований' })).toBeVisible();

  await page.unroute('**/api/v1/bookings?*');
  let shouldFail = true;
  await page.route('**/api/v1/bookings?*', async (route) => {
    if (shouldFail) {
      await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
      return;
    }

    await route.continue();
  });
  await page.reload();
  await expect(page.getByRole('alert')).toContainText(
    'Произошла ошибка при загрузке ваших бронирований',
  );

  shouldFail = false;
  await page.getByRole('button', { name: 'Попробовать снова' }).click();
  await expect(page.getByText('Ежедневная встреча команды')).toBeVisible();
});

test('создание и отмена показывают состояния выполнения', async ({ page, request }) => {
  const date = formatIsoDateInMoscow((await getSeedFutureBooking(request)).startsAt);
  let releaseCreation: (() => void) | undefined;
  await page.route('**/api/v1/bookings', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    await new Promise<void>((resolve) => {
      releaseCreation = resolve;
    });
    await route.continue();
  });

  await page.goto(`/rooms/room-altai?date=${date}&start=09%3A00&duration=15`);
  const dialog = await openBookingForm(page);
  await dialog.getByRole('textbox', { name: 'Тема встречи *' }).fill('E2E pending');
  await dialog.getByRole('button', { name: 'Забронировать' }).click();
  await expect(dialog.getByRole('button', { name: 'Бронируем…' })).toBeDisabled();
  await expect.poll(() => releaseCreation).toBeDefined();
  releaseCreation?.();
  await expect(page.getByRole('status')).toContainText('Бронирование создано');

  await page.unroute('**/api/v1/bookings');
  await page.goto('/bookings');
  const card = page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: 'E2E pending' }) });
  await card.getByRole('button', { name: 'Отменить' }).click();
  await page.route('**/api/v1/bookings/*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.continue();
  });
  await page.getByRole('button', { name: 'Да, отменить' }).click();
  await expect(page.getByRole('button', { name: 'Отменяем…' })).toBeDisabled();
});

test('ошибка оптимистической отмены возвращает бронирование и сохраняет диалог', async ({
  page,
}) => {
  const title = 'Ежедневная встреча команды';
  let rejectCancellation: (() => void) | undefined;
  await page.route('**/api/v1/bookings/booking-future-current-user', async (route) => {
    await new Promise<void>((resolve) => {
      rejectCancellation = resolve;
    });
    await route.abort('connectionfailed');
  });

  await page.goto('/bookings');
  const card = page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: title }) });
  await card.getByRole('button', { name: 'Отменить' }).click();
  await page.getByRole('button', { name: 'Да, отменить' }).click();

  await expect(page.getByRole('heading', { name: title })).toHaveCount(0);
  await expect.poll(() => rejectCancellation).toBeDefined();
  rejectCancellation?.();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Отменить бронирование?' })).toContainText(
    'Не удалось отменить бронирование. Попробуйте снова',
  );
});
