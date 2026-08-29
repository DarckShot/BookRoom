import { BOOKING_REALTIME_EVENT_TYPES, ROOM_REALTIME_EVENT_TYPES } from './realtime.constants';
import { API_BASE_URL } from './constants';

export const getRealtimeUrl = () => {
  const url = new URL(API_BASE_URL, window.location.origin);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = `${url.pathname.replace(/\/$/, '')}/ws`;
  url.search = '';
  url.hash = '';

  return url.toString();
};

export const getRealtimeEventType = (payload: string) => {
  try {
    const event: unknown = JSON.parse(payload);

    if (typeof event === 'object' && event !== null && 'type' in event) {
      return typeof event.type === 'string' ? event.type : undefined;
    }
  } catch {
    return undefined;
  }

  return undefined;
};

export const affectsRooms = (eventType: string) => ROOM_REALTIME_EVENT_TYPES.has(eventType);

export const affectsBookings = (eventType: string) => BOOKING_REALTIME_EVENT_TYPES.has(eventType);
