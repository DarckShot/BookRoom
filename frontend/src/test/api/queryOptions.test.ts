import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBookings, type BookingsQuery } from '../../api/bookings';
import { getOffices } from '../../api/offices';
import { queryClient } from '../../api/queryClient';
import {
  bookingsQueryOptions,
  currentUserQueryOptions,
  officesQueryOptions,
  roomQueryOptions,
  roomScheduleQueryOptions,
  roomsQueryOptions,
} from '../../api/queryOptions';
import { getRoom, getRoomSchedule } from '../../api/room';
import { getRooms } from '../../api/rooms';
import { getCurrentUser } from '../../api/users';

vi.mock('../../api/bookings', () => ({ getBookings: vi.fn().mockResolvedValue([]) }));
vi.mock('../../api/offices', () => ({ getOffices: vi.fn().mockResolvedValue([]) }));
vi.mock('../../api/room', () => ({
  getRoom: vi.fn().mockResolvedValue({ id: 'room-everest' }),
  getRoomSchedule: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../api/rooms', () => ({ getRooms: vi.fn().mockResolvedValue([]) }));
vi.mock('../../api/users', () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ id: 'user-current' }),
}));

const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

beforeEach(() => {
  client.clear();
  vi.clearAllMocks();
});

describe('query options', () => {
  it('использует заданные defaults общего QueryClient', () => {
    expect(queryClient.getDefaultOptions().queries).toMatchObject({
      retry: 1,
      staleTime: 300_000,
    });
  });

  it('выполняет запросы статических ресурсов', async () => {
    await client.fetchQuery(officesQueryOptions);
    await client.fetchQuery(currentUserQueryOptions);

    expect(getOffices).toHaveBeenCalledOnce();
    expect(getCurrentUser).toHaveBeenCalledOnce();
  });

  it('не обращается к API без параметров комнат и расписания', async () => {
    await expect(client.fetchQuery(roomsQueryOptions())).resolves.toEqual([]);
    await expect(client.fetchQuery(roomScheduleQueryOptions('room-everest'))).resolves.toEqual([]);

    expect(getRooms).not.toHaveBeenCalled();
    expect(getRoomSchedule).not.toHaveBeenCalled();
    expect(roomsQueryOptions().enabled).toBe(false);
    expect(roomScheduleQueryOptions('', undefined).enabled).toBe(false);
  });

  it('передаёт параметры динамическим запросам', async () => {
    const roomsQuery = { officeId: 'office-moscow' };
    const interval = {
      from: '2026-08-30T00:00:00.000Z',
      to: '2026-08-31T00:00:00.000Z',
    };
    const bookingsQuery: BookingsQuery = { scope: 'all' };

    await client.fetchQuery(roomsQueryOptions(roomsQuery));
    await client.fetchQuery(roomQueryOptions('room-everest'));
    await client.fetchQuery(roomScheduleQueryOptions('room-everest', interval));
    await client.fetchQuery(bookingsQueryOptions(bookingsQuery));

    expect(getRooms).toHaveBeenCalledWith(roomsQuery);
    expect(getRoom).toHaveBeenCalledWith('room-everest');
    expect(getRoomSchedule).toHaveBeenCalledWith('room-everest', interval);
    expect(getBookings).toHaveBeenCalledWith(bookingsQuery);
  });
});
