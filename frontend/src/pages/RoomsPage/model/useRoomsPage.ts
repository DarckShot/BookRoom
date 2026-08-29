import { useQuery } from '@tanstack/react-query';
import { roomsQueryOptions } from '../../../api/queryOptions';
import { useRoomFilters } from '../../../hooks/useRoomFilters';
import { useRoomsLayoutContext } from '../../../hooks/useRoomsLayoutContext';
import { useRealtime } from '../../../hooks/useRealtime';
import { getRoomsContentStatus } from './utils';

export const useRoomsPage = () => {
  const { selectedOffice, officesStatus } = useRoomsLayoutContext();
  const realtime = useRealtime();
  const filters = useRoomFilters({
    officeId: selectedOffice?.id,
    officeTimezone: selectedOffice?.timezone,
  });
  const { data: rooms = [], status, refetch } = useQuery(roomsQueryOptions(filters.roomsQuery));

  const retry = () => {
    if (realtime.status === 'reconnecting') {
      realtime.reconnect();
    }

    void refetch();
  };

  return {
    filterController: filters.controller,
    roomsContentProps: {
      status: getRoomsContentStatus(
        officesStatus,
        selectedOffice !== undefined,
        status,
        rooms.length,
      ),
      rooms,
      search: filters.search,
      onRetry: retry,
      onReset: filters.controller.actions.reset,
    },
  };
};
