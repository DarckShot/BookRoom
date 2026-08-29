import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cancelBooking, createBooking, getBookings, type BookingsQuery } from '../../api/bookings';
import { apiClient } from '../../api/client';
import { getOffices } from '../../api/offices';
import { getRoom, getRoomSchedule } from '../../api/room';
import { getRooms } from '../../api/rooms';
import { getCurrentUser } from '../../api/users';
import type { Booking, CreateBookingInput } from '../../types/booking';
import type { Office } from '../../types/office';
import type { Room } from '../../types/room';
import type { User } from '../../types/user';

vi.mock('../../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const office: Office = {
  id: 'office-moscow',
  name: 'Офис Москва',
  address: 'Москва, ул. Лесная, 7',
  timezone: 'Europe/Moscow',
};

const room: Room = {
  id: 'room-everest',
  officeId: office.id,
  name: 'Эверест',
  floor: 4,
  capacity: 12,
  features: [],
  office,
};

const user: User = {
  id: 'user-current',
  login: 'konstantin',
  displayName: 'Константин Константинопольский',
  email: 'konstantin@example.com',
  avatarUrl: null,
  initials: 'КК',
};

const booking: Booking = {
  id: 'booking-one',
  roomId: room.id,
  userId: user.id,
  title: 'Планирование',
  comment: null,
  startsAt: '2026-08-30T12:00:00.000Z',
  endsAt: '2026-08-30T13:00:00.000Z',
  createdAt: '2026-08-29T09:00:00.000Z',
  room,
  office,
  owner: user,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('resource API', () => {
  it('запрашивает офисы, комнаты и текущего пользователя по контракту backend', async () => {
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce({ data: { items: [office] } })
      .mockResolvedValueOnce({ data: { items: [room] } })
      .mockResolvedValueOnce({ data: room })
      .mockResolvedValueOnce({ data: user });

    const roomsQuery = { officeId: office.id, minCapacity: 8 };

    await expect(getOffices()).resolves.toEqual([office]);
    await expect(getRooms(roomsQuery)).resolves.toEqual([room]);
    await expect(getRoom(room.id)).resolves.toEqual(room);
    await expect(getCurrentUser()).resolves.toEqual(user);

    expect(apiClient.get).toHaveBeenNthCalledWith(1, '/offices');
    expect(apiClient.get).toHaveBeenNthCalledWith(2, '/rooms', { params: roomsQuery });
    expect(apiClient.get).toHaveBeenNthCalledWith(3, `/rooms/${room.id}`);
    expect(apiClient.get).toHaveBeenNthCalledWith(4, '/me');
  });

  it('запрашивает расписание и бронирования с нужными параметрами', async () => {
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce({ data: { items: [booking] } })
      .mockResolvedValueOnce({ data: { items: [booking] } });
    const interval = {
      from: '2026-08-30T00:00:00.000Z',
      to: '2026-08-31T00:00:00.000Z',
    };
    const bookingsQuery: BookingsQuery = { scope: 'all', officeId: office.id };

    await expect(getRoomSchedule(room.id, interval)).resolves.toEqual([booking]);
    await expect(getBookings(bookingsQuery)).resolves.toEqual([booking]);

    expect(apiClient.get).toHaveBeenNthCalledWith(1, `/rooms/${room.id}/bookings`, {
      params: interval,
    });
    expect(apiClient.get).toHaveBeenNthCalledWith(2, '/bookings', { params: bookingsQuery });
  });

  it('создаёт и отменяет бронирование', async () => {
    const input: CreateBookingInput = {
      roomId: room.id,
      title: booking.title,
      comment: null,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
    };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: booking });
    vi.mocked(apiClient.delete).mockResolvedValueOnce({});

    await expect(createBooking(input)).resolves.toEqual(booking);
    await expect(cancelBooking(booking.id)).resolves.toBeUndefined();

    expect(apiClient.post).toHaveBeenCalledWith('/bookings', input);
    expect(apiClient.delete).toHaveBeenCalledWith(`/bookings/${booking.id}`);
  });
});
