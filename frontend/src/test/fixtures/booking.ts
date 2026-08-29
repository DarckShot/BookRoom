import type { Booking } from '../../types/booking';
import type { Room } from '../../types/room';
import type { User } from '../../types/user';

export const roomFixture: Room = {
  id: 'room-everest',
  officeId: 'office-moscow',
  name: 'Эверест',
  floor: 4,
  capacity: 12,
  features: [
    { code: 'display', name: 'Проектор и ТВ-панель 4К' },
    { code: 'whiteboard', name: 'Маркерная доска' },
    { code: 'video', name: 'Система видеоконференций' },
  ],
  office: {
    id: 'office-moscow',
    name: 'Офис Москва',
    address: 'Москва, ул. Лесная, 7',
    timezone: 'Europe/Moscow',
  },
};

export const currentUserFixture: User = {
  id: 'user-konstantin',
  login: 'konstantin',
  displayName: 'Константин К.',
  email: 'konstantin@example.com',
  avatarUrl: null,
  initials: 'КК',
};

interface BookingFixtureInput {
  id?: string;
  userId?: string;
  title?: string;
  startsAt?: string;
  endsAt?: string;
  comment?: string | null;
}

export const createBookingFixture = ({
  id = 'booking-own',
  userId = currentUserFixture.id,
  title = 'Daily Sync',
  startsAt = '2026-08-30T08:00:00.000Z',
  endsAt = '2026-08-30T09:00:00.000Z',
  comment = null,
}: BookingFixtureInput = {}): Booking => ({
  id,
  userId,
  title,
  startsAt,
  endsAt,
  roomId: roomFixture.id,
  comment,
  createdAt: '2026-08-29T08:00:00.000Z',
  room: {
    id: roomFixture.id,
    officeId: roomFixture.officeId,
    name: roomFixture.name,
    floor: roomFixture.floor,
    capacity: roomFixture.capacity,
    features: roomFixture.features,
  },
  office: roomFixture.office,
  owner: currentUserFixture,
});
