import type { ReactNode } from 'react';
import { NoOfficeState } from '../../components/rooms/NoOfficeState/NoOfficeState';
import { RoomsEmptyState } from '../../components/rooms/RoomsEmptyState/RoomsEmptyState';
import { RoomsLoadingState } from '../../components/rooms/RoomsLoadingState/RoomsLoadingState';
import { RoomsErrorState } from './RoomsErrorState';
import { RoomsList } from './RoomsList';
import type { RoomsContentProps, RoomsContentStatus } from './types';

export const RoomsContent = ({ status, rooms, search, onRetry, onReset }: RoomsContentProps) => {
  const content: Record<RoomsContentStatus, ReactNode> = {
    noOffice: <NoOfficeState />,
    loading: <RoomsLoadingState />,
    error: <RoomsErrorState onRetry={onRetry} />,
    empty: <RoomsEmptyState onReset={onReset} />,
    ready: <RoomsList rooms={rooms} search={search} />,
  };

  return content[status];
};
