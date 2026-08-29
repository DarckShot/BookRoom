import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createBookingSeries } from '../../api/bookings';
import { apiClient } from '../../api/client';
import type { CreateBookingInput } from '../../types/booking';
import { createBookingFixture } from '../fixtures/booking';

vi.mock('../../api/client', () => ({
  apiClient: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const inputs: CreateBookingInput[] = [
  {
    roomId: 'room-everest',
    title: 'Еженедельный синк',
    comment: null,
    startsAt: '2026-08-30T12:00:00.000Z',
    endsAt: '2026-08-30T13:00:00.000Z',
  },
  {
    roomId: 'room-everest',
    title: 'Еженедельный синк',
    comment: null,
    startsAt: '2026-09-06T12:00:00.000Z',
    endsAt: '2026-09-06T13:00:00.000Z',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createBookingSeries', () => {
  it('компенсирующе отменяет созданные встречи, если следующий запрос завершился ошибкой', async () => {
    const firstBooking = createBookingFixture({ id: 'booking-first' });
    const conflict = new Error('Conflict');
    vi.mocked(apiClient.post)
      .mockResolvedValueOnce({ data: firstBooking })
      .mockRejectedValueOnce(conflict);
    vi.mocked(apiClient.delete).mockResolvedValueOnce({});

    await expect(createBookingSeries(inputs)).rejects.toBe(conflict);

    expect(apiClient.post).toHaveBeenCalledTimes(2);
    expect(apiClient.delete).toHaveBeenCalledWith('/bookings/booking-first');
  });
});
