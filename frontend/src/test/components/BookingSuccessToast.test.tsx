// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { useState } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BookingSuccessToast } from '../../components/bookings/BookingSuccessToast/BookingSuccessToast';
import { BOOKING_SUCCESS_TOAST_DURATION_MS } from '../../components/bookings/BookingSuccessToast/constants';
import { formatCreatedBooking } from '../../components/bookings/BookingSuccessToast/utils';
import { createBookingFixture } from '../fixtures/booking';

const booking = createBookingFixture({
  id: 'booking-created',
  title: 'Демо',
  startsAt: '2026-08-30T06:00:00.000Z',
  endsAt: '2026-08-30T07:00:00.000Z',
});

const BookingSuccessToastHarness = () => {
  const [isVisible, setIsVisible] = useState(true);

  return isVisible ? (
    <BookingSuccessToast series={{ bookings: [booking] }} onClose={() => setIsVisible(false)} />
  ) : null;
};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('BookingSuccessToast', () => {
  it('показывает серию и закрывается вручную', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<BookingSuccessToast series={{ bookings: [booking, booking] }} onClose={onClose} />);

    expect(screen.getByRole('heading', { name: 'Серия бронирований создана' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Закрыть уведомление' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('автоматически скрывается через 10 секунд', () => {
    vi.useFakeTimers();
    render(<BookingSuccessToastHarness />);

    expect(screen.getByRole('status')).toBeVisible();

    act(() => vi.advanceTimersByTime(BOOKING_SUCCESS_TOAST_DURATION_MS - 1));
    expect(screen.getByRole('status')).toBeVisible();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('форматирует одиночное бронирование, серию и пустой результат', () => {
    expect(formatCreatedBooking({ bookings: [] })).toBe('');
    expect(formatCreatedBooking({ bookings: [booking] })).not.toContain('еженедельно');
    expect(formatCreatedBooking({ bookings: [booking, booking] })).toContain(
      'еженедельно · 2 встречи',
    );
  });
});
