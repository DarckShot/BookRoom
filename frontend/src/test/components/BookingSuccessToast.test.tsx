// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { useState } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BookingSuccessToast } from '../../components/bookings/BookingSuccessToast/BookingSuccessToast';
import { BOOKING_SUCCESS_TOAST_DURATION_MS } from '../../components/bookings/BookingSuccessToast/constants';
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
    <BookingSuccessToast booking={booking} onClose={() => setIsVisible(false)} />
  ) : null;
};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('BookingSuccessToast', () => {
  it('автоматически скрывается через 10 секунд', () => {
    vi.useFakeTimers();
    render(<BookingSuccessToastHarness />);

    expect(screen.getByRole('status')).toBeVisible();

    act(() => vi.advanceTimersByTime(BOOKING_SUCCESS_TOAST_DURATION_MS - 1));
    expect(screen.getByRole('status')).toBeVisible();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
