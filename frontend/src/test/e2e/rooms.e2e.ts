import { expect, test } from '@playwright/test';
import {
  formatIsoDateInMoscow,
  getRoomCard,
  getSeedFutureBooking,
  resetTestData,
  selectOption,
} from './helpers';

test.beforeEach(async ({ request }) => {
  await resetTestData(request);
});

test('обязательные маршруты доступны, а неизвестный маршрут показывает 404', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/rooms$/);
  await expect(page.getByRole('heading', { name: 'Выберите офис' })).toBeVisible();

  await page.getByRole('link', { name: 'Мои бронирования' }).click();
  await expect(page).toHaveURL(/\/bookings$/);
  await expect(page.getByRole('heading', { name: 'Мои бронирования' })).toBeVisible();

  await page.goto('/rooms/room-everest');
  await expect(page.getByRole('heading', { name: 'Эверест' })).toBeVisible();

  await page.goto('/missing');
  await expect(page.getByRole('heading', { name: 'Ничего не найдено' })).toBeVisible();
});

test('офис обязателен, основные фильтры работают и сохраняются в URL', async ({
  page,
  request,
}) => {
  const futureBooking = await getSeedFutureBooking(request);
  const date = formatIsoDateInMoscow(futureBooking.startsAt);

  await page.goto('/rooms');
  await expect(page.getByRole('heading', { name: 'Выберите офис' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Дата бронирования' })).toBeDisabled();
  await expect(page.getByRole('combobox', { name: 'Длительность' })).toBeDisabled();

  await selectOption(page, 'Выберите офис', 'Офис Москва');
  await expect(
    page.getByRole('heading', { name: 'Доступные переговорные в этом офисе' }),
  ).toBeVisible();
  await expect(page).toHaveURL(/officeId=office-moscow/);

  await page.goto(
    `/rooms?officeId=office-moscow&date=${date}&start=15%3A00&duration=60&minCapacity=8`,
  );
  const everest = getRoomCard(page, 'Эверест');
  const kazbek = getRoomCard(page, 'Казбек');
  await expect(everest).toContainText('Недоступно на выбранное время');
  await expect(kazbek).toContainText('Доступно на выбранное время');
  await expect(page.getByRole('combobox', { name: 'Минимальная вместимость' })).toContainText(
    'Мин. 8 чел.',
  );

  const startTime = page.getByRole('textbox', { name: 'Время начала' });
  await startTime.fill('0910');
  await startTime.blur();
  await expect(startTime).toHaveValue('15:00');
  await startTime.fill('0915');
  await startTime.press('Enter');
  await expect(startTime).toHaveValue('09:15');
  await expect(page).toHaveURL(/start=09%3A15/);

  await selectOption(page, 'Длительность', '15 мин');
  await selectOption(page, 'Минимальная вместимость', '12 чел.');
  await expect(getRoomCard(page, 'Эверест')).toBeVisible();
  await expect(getRoomCard(page, 'Казбек')).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Время начала' })).toHaveValue('09:15');
  await expect(page.getByRole('combobox', { name: 'Длительность' })).toContainText('15 мин');
});

test('пустой результат сбрасывает все фильтры вместе с офисом', async ({ page, request }) => {
  const futureBooking = await getSeedFutureBooking(request);
  const date = formatIsoDateInMoscow(futureBooking.startsAt);

  await page.goto(
    `/rooms?officeId=office-moscow&date=${date}&start=09%3A00&duration=60&minCapacity=100`,
  );
  await expect(page.getByRole('heading', { name: 'Нет доступных переговорных' })).toBeVisible();
  await page.getByRole('button', { name: 'Сбросить фильтры' }).click();

  await expect(page).toHaveURL(/\/rooms$/);
  await expect(page.getByRole('heading', { name: 'Выберите офис' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Выберите офис' })).toContainText(
    'Выберите офис',
  );
});

test('карточка открывает страницу комнаты с информацией и расписанием', async ({
  page,
  request,
}) => {
  const futureBooking = await getSeedFutureBooking(request);
  const date = formatIsoDateInMoscow(futureBooking.startsAt);

  await page.goto(
    `/rooms?officeId=office-moscow&date=${date}&start=09%3A00&duration=60&minCapacity=4`,
  );
  await getRoomCard(page, 'Эверест').getByRole('link', { name: 'Подробнее' }).click();

  await expect(page).toHaveURL(/\/rooms\/room-everest/);
  await expect(page.getByRole('heading', { name: 'Эверест' })).toBeVisible();
  await expect(page.getByText('Вместимость: до 12 человек')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Расписание на день' })).toBeVisible();
  await expect(page.getByText('Ежедневная встреча команды')).toBeVisible();
});
