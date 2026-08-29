import { expect, type APIRequestContext, type Locator, type Page } from '@playwright/test';

interface ApiCollection<T> {
  items: T[];
}

interface ApiBooking {
  id: string;
  roomId: string;
  title: string;
  startsAt: string;
  endsAt: string;
}

interface CreateBookingInput {
  roomId: string;
  title: string;
  comment: string | null;
  startsAt: string;
  endsAt: string;
}

const MOSCOW_OFFSET = '+03:00';

export const resetTestData = async (request: APIRequestContext) => {
  const response = await request.post('/api/v1/test/reset');
  expect(response.ok()).toBeTruthy();
};

export const getSeedBookings = async (request: APIRequestContext) => {
  const response = await request.get('/api/v1/bookings?scope=all');
  expect(response.ok()).toBeTruthy();
  const body: ApiCollection<ApiBooking> = await response.json();

  return body.items;
};

export const getSeedFutureBooking = async (request: APIRequestContext) => {
  const bookings = await getSeedBookings(request);
  const booking = bookings.find((item) => item.id === 'booking-future-current-user');
  expect(booking).toBeDefined();

  if (!booking) {
    throw new Error('Seed booking booking-future-current-user was not found');
  }

  return booking;
};

export const formatIsoDateInMoscow = (value: string) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  return `${part('year')}-${part('month')}-${part('day')}`;
};

export const addDays = (date: string, days: number) => {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);

  return value.toISOString().slice(0, 10);
};

export const createBookingInput = ({
  roomId,
  title,
  date,
  startTime,
  durationMinutes,
}: {
  roomId: string;
  title: string;
  date: string;
  startTime: string;
  durationMinutes: number;
}): CreateBookingInput => {
  const startsAt = new Date(`${date}T${startTime}:00${MOSCOW_OFFSET}`);
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);

  return {
    roomId,
    title,
    comment: null,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
  };
};

export const createBookingThroughApi = async (
  request: APIRequestContext,
  input: CreateBookingInput,
) => {
  const response = await request.post('/api/v1/bookings', { data: input });
  expect(response.status()).toBe(201);
  const booking: ApiBooking = await response.json();

  return booking;
};

export const selectOption = async (page: Page, name: string, option: string) => {
  await page.getByRole('combobox', { name }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
};

export const getRoomCard = (page: Page, roomName: string): Locator =>
  page.getByRole('article').filter({ has: page.getByRole('heading', { name: roomName }) });

export const openBookingForm = async (page: Page) => {
  await page.getByRole('button', { name: 'Забронировать комнату' }).click();

  return page.getByRole('dialog', { name: 'Новое бронирование' });
};
