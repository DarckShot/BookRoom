import type { QueryStatus } from '@tanstack/react-query';
import type { RealtimeConnectionStatus } from '../../types/realtime';
import type { RoomPageStatus, RoomScheduleStatus } from './types';

export const getRoomPageStatus = (
  roomStatus: QueryStatus,
  currentUserStatus: QueryStatus,
): RoomPageStatus => {
  if (roomStatus === 'error' || currentUserStatus === 'error') {
    return 'error';
  }

  return roomStatus === 'pending' || currentUserStatus === 'pending' ? 'loading' : 'ready';
};

export const getRoomScheduleStatus = (
  connectionStatus: RealtimeConnectionStatus,
  queryStatus: QueryStatus,
): RoomScheduleStatus => {
  if (connectionStatus === 'reconnecting' || queryStatus === 'error') {
    return 'error';
  }

  return queryStatus === 'pending' ? 'loading' : 'ready';
};
