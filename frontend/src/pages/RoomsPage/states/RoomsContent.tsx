import type { ReactNode } from 'react';
import { NoOfficeState } from './NoOfficeState/NoOfficeState';
import { RoomsEmptyState } from './RoomsEmptyState/RoomsEmptyState';
import { RoomsLoadingState } from './RoomsLoadingState/RoomsLoadingState';
import { RoomsErrorState } from './RoomsErrorState';
import { RoomsList } from '../components/RoomsList';
import type { RoomsContentProps, RoomsContentStatus } from '../model/types';

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
