// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import {
  affectsBookings,
  affectsRooms,
  getRealtimeEventType,
  getRealtimeUrl,
} from '../../api/realtime';

describe('realtime API utils', () => {
  it('создаёт WebSocket URL относительно адреса приложения', () => {
    expect(getRealtimeUrl()).toBe('ws://localhost:3000/api/v1/ws');
  });

  it('безопасно извлекает только строковый тип события', () => {
    expect(getRealtimeEventType('{"type":"booking.created"}')).toBe('booking.created');
    expect(getRealtimeEventType('{"type":42}')).toBeUndefined();
    expect(getRealtimeEventType('null')).toBeUndefined();
    expect(getRealtimeEventType('{broken')).toBeUndefined();
  });

  it('разделяет события комнат и бронирований', () => {
    expect(affectsRooms('room.availability_changed')).toBe(true);
    expect(affectsRooms('unknown')).toBe(false);
    expect(affectsBookings('booking.cancelled')).toBe(true);
    expect(affectsBookings('room.availability_changed')).toBe(false);
  });
});
