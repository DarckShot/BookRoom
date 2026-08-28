import { useQuery } from '@tanstack/react-query';
import { roomsQueryOptions } from '../../api/queryOptions';
import { useRoomFilters } from '../../hooks/useRoomFilters';
import { useRoomsLayoutContext } from '../../hooks/useRoomsLayoutContext';
import { getRoomsContentStatus } from './utils';

export const useRoomsPage = () => {
  const { selectedOffice } = useRoomsLayoutContext();
  const filters = useRoomFilters({
    officeId: selectedOffice?.id,
    officeTimezone: selectedOffice?.timezone,
  });
  const { data: rooms = [], status, refetch } = useQuery(roomsQueryOptions(filters.roomsQuery));

  return {
    filterController: filters.controller,
    roomsContentProps: {
      status: getRoomsContentStatus(selectedOffice !== undefined, status, rooms.length),
      rooms,
      search: filters.search,
      onRetry: () => void refetch(),
      onReset: filters.controller.actions.reset,
    },
  };
};
