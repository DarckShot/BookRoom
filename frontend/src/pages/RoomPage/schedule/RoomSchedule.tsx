import type { ReactNode } from 'react';
import { RoomScheduleError } from './RoomScheduleError';
import { RoomScheduleLoading } from './RoomScheduleLoading';
import { RoomScheduleReady } from './RoomScheduleReady';
import type { RoomScheduleProps, RoomScheduleStatus } from './types';

export const RoomSchedule = ({ status, onRetry, ...scheduleProps }: RoomScheduleProps) => {
  const content: Record<RoomScheduleStatus, ReactNode> = {
    loading: <RoomScheduleLoading />,
    error: <RoomScheduleError onRetry={onRetry} />,
    ready: <RoomScheduleReady {...scheduleProps} />,
  };

  return content[status];
};
