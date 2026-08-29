import type { QueryStatus } from '@tanstack/react-query';
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

export const getRoomScheduleStatus = (queryStatus: QueryStatus): RoomScheduleStatus => {
  if (queryStatus === 'error') {
    return 'error';
  }

  return queryStatus === 'pending' ? 'loading' : 'ready';
};
