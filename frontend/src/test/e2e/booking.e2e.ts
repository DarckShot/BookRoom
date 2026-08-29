import { expect, test } from '@playwright/test';
import {
  addDays,
  formatIsoDateInMoscow,
  getSeedFutureBooking,
  openBookingForm,
  resetTestData,
  selectOption,
} from './helpers';

const formatCalendarLabel = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .format(new Date(`${date}T12:00:00Z`))
    .replace(' г.', '');

test.beforeEach(async ({ request }) => {
  await resetTestData(request);
});

test('форма соблюдает шаг 15 минут, рабочие часы и горизонт 30 дней', async ({ page, request }) => {
  const futureBooking = await getSeedFutureBooking(request);
  const tomorrow = formatIsoDateInMoscow(futureBooking.startsAt);
  const today = addDays(tomorrow, -1);
  const maxDate = addDays(today, 30);
  const unavailableDate = addDays(today, 31);

  await page.goto(`/rooms/room-altai?date=${tomorrow}&start=09%3A00&duration=60`);
  const dialog = await openBookingForm(page);
  const startTime = dialog.getByRole('textbox', { name: 'Время начала' });

  await startTime.fill('0845');
  await startTime.blur();
  await expect(startTime).toHaveValue('09:00');
  await startTime.fill('0905');
  await startTime.blur();
  await expect(startTime).toHaveValue('09:00');
  await startTime.fill('1945');
  await startTime.blur();
  await expect(startTime).toHaveValue('19:45');
  await expect(
    dialog.getByRole('combobox', { name: 'Продолжительность бронирования' }),
  ).toContainText('15 мин');
  await dialog.getByRole('combobox', { name: 'Продолжительность бронирования' }).click();
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await expect(dialog.getByRole('option')).toContainText('до 20:00');
  await dialog.getByRole('option').click();

  await startTime.fill('0900');

  await dialog.getByRole('combobox', { name: 'Продолжительность бронирования' }).click();
  const durationOptions = dialog.getByRole('option');
  await expect(durationOptions.first()).toContainText('15 мин');
  await expect(durationOptions).toHaveCount(44);
  await durationOptions.first().click();

  await dialog.getByRole('button', { name: 'Дата бронирования' }).click();
  const maxDateButton = page.getByRole('button', { name: formatCalendarLabel(maxDate) });

  if ((await maxDateButton.count()) === 0) {
    await page.getByRole('button', { name: 'Следующий месяц' }).click();
  }

  await expect(maxDateButton).toBeEnabled();
  await expect(
    page.getByRole('button', { name: formatCalendarLabel(unavailableDate) }),
  ).toBeDisabled();
});

test('клик по свободному слоту открывает форму с выбранным временем и валидирует поля', async ({
  page,
  request,
}) => {
  const futureBooking = await getSeedFutureBooking(request);
  const tomorrow = formatIsoDateInMoscow(futureBooking.startsAt);

  await page.goto(`/rooms/room-altai?date=${tomorrow}`);
  await page.getByRole('button', { name: 'Забронировать на 09:15' }).click();
  const dialog = page.getByRole('dialog', { name: 'Новое бронирование' });
  await expect(dialog.getByRole('textbox', { name: 'Время начала' })).toHaveValue('09:15');

  await dialog.getByRole('button', { name: 'Забронировать' }).click();
  await expect(dialog.getByText('Обязательное поле')).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Тема встречи *' })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});

test('не позволяет создать бронирование в прошедшее время текущего дня', async ({
  page,
  request,
}) => {
  const futureBooking = await getSeedFutureBooking(request);
  const today = addDays(formatIsoDateInMoscow(futureBooking.startsAt), -1);
  await page.clock.setFixedTime(new Date(`${today}T15:00:00Z`));

  await page.goto(`/rooms/room-altai?date=${today}&start=09%3A00&duration=15`);
  const dialog = await openBookingForm(page);
  await dialog.getByRole('textbox', { name: 'Тема встречи *' }).fill('Встреча в прошлом');
  const startTime = dialog.getByRole('textbox', { name: 'Время начала' });
  await startTime.fill('0900');
  await startTime.blur();
  await dialog.getByRole('button', { name: 'Забронировать' }).click();

  await expect(dialog.getByText('Выберите будущее время')).toBeVisible();
});

test('создаёт бронирование, показывает его в расписании и позволяет отменить', async ({
  page,
  request,
}) => {
  const futureBooking = await getSeedFutureBooking(request);
  const tomorrow = formatIsoDateInMoscow(futureBooking.startsAt);
  const title = 'E2E встреча команды';

  await page.goto(`/rooms/room-altai?date=${tomorrow}&start=09%3A00&duration=15`);
  const dialog = await openBookingForm(page);
  await dialog.getByRole('textbox', { name: 'Тема встречи *' }).fill(title);
  await dialog.getByRole('button', { name: 'Забронировать' }).click();

  await expect(page.getByRole('status')).toContainText('Бронирование создано');
  await expect(page.getByTitle(title)).toBeVisible();

  await page.getByRole('link', { name: 'Мои бронирования' }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  const card = page
    .getByRole('article')
    .filter({ has: page.getByRole('heading', { name: title }) });
  await card.getByRole('button', { name: 'Отменить' }).click();
  await page.getByRole('button', { name: 'Да, отменить' }).click();

  await expect(page.getByRole('heading', { name: title })).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Отменить бронирование?' })).toHaveCount(0);
});

test('прошедшее бронирование нельзя отменить', async ({ page }) => {
  await page.goto('/bookings?scope=past');

  await expect(page.getByText('Ретроспектива команды')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Отменить' })).toHaveCount(0);
});

test('409 показывает отдельный конфликт и сохраняет заполненную тему', async ({
  page,
  request,
}) => {
  const futureBooking = await getSeedFutureBooking(request);
  const date = formatIsoDateInMoscow(futureBooking.startsAt);
  const title = 'Планирование релиза';

  await page.goto(`/rooms/room-everest?date=${date}&start=15%3A00&duration=60`);
  const dialog = await openBookingForm(page);
  await dialog.getByRole('textbox', { name: 'Тема встречи *' }).fill(title);
  await dialog.getByRole('button', { name: 'Забронировать' }).click();

  await expect(page.getByRole('alert')).toContainText('Время уже занято');
  await page.getByRole('button', { name: 'Выбрать другое время' }).click();
  await expect(page.getByRole('textbox', { name: 'Тема встречи *' })).toHaveValue(title);
});

test('создаёт еженедельную серию бронирований', async ({ page, request }) => {
  const futureBooking = await getSeedFutureBooking(request);
  const tomorrow = formatIsoDateInMoscow(futureBooking.startsAt);
  const title = 'E2E еженедельный синк';

  await page.goto(`/rooms/room-altai?date=${tomorrow}&start=09%3A00&duration=15`);
  const dialog = await openBookingForm(page);
  await dialog.getByRole('textbox', { name: 'Тема встречи *' }).fill(title);
  await dialog.getByRole('checkbox', { name: 'Повторять еженедельно' }).check();
  await selectOption(page, 'Количество встреч', '3 встречи');
  await dialog.getByRole('button', { name: 'Забронировать' }).click();

  await expect(page.getByRole('status')).toContainText('Серия бронирований создана');
  await page.goto('/bookings');
  await expect(page.getByRole('heading', { name: title })).toHaveCount(3);
});

test('экспортирует собственное бронирование в формате .ics', async ({ page }) => {
  await page.goto('/bookings');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'В календарь' }).first().click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/\.ics$/);
});
