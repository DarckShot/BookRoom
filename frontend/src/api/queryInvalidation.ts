import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

export const invalidateRoomAvailability = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.roomListsRoot }),
    queryClient.invalidateQueries({ queryKey: queryKeys.roomSchedulesRoot }),
  ]);

export const invalidateBookingRelatedQueries = (queryClient: QueryClient) =>
  Promise.all([
    invalidateRoomAvailability(queryClient),
    queryClient.invalidateQueries({ queryKey: queryKeys.bookingsRoot }),
  ]);
