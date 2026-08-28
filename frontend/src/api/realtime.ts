import { ROOM_REALTIME_EVENT_TYPES } from './realtime.constants';

const getApiBaseUrl = () => import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

export const getRealtimeUrl = () => {
  const url = new URL(getApiBaseUrl(), window.location.origin);
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
