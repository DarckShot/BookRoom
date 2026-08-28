import type { RoomsContentStatus } from './types';

type QueryStatus = 'pending' | 'error' | 'success';

const getLoadedRoomsStatus = (queryStatus: QueryStatus, roomCount: number): RoomsContentStatus => {
  switch (queryStatus) {
    case 'pending':
      return 'loading';
    case 'error':
      return 'error';
    case 'success':
      return roomCount === 0 ? 'empty' : 'ready';
  }
};

export const getRoomsContentStatus = (
  hasSelectedOffice: boolean,
  queryStatus: QueryStatus,
  roomCount: number,
): RoomsContentStatus =>
  hasSelectedOffice ? getLoadedRoomsStatus(queryStatus, roomCount) : 'noOffice';
