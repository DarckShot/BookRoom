export const REALTIME_RECONNECT_DELAY_MS = 3_000;

export const ROOM_REALTIME_EVENT_TYPES = new Set([
  'booking.created',
  'booking.cancelled',
  'room.availability_changed',
]);

export const BOOKING_REALTIME_EVENT_TYPES = new Set(['booking.created', 'booking.cancelled']);
