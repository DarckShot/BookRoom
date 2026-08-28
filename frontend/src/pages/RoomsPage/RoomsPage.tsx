import { FilterBar } from '../../components/rooms/FilterBar/FilterBar';
import { RoomsContent } from './RoomsContent';
import { useRoomsPage } from './useRoomsPage';

export const RoomsPage = () => {
  const { filterController, roomsContentProps } = useRoomsPage();

  return (
    <>
      <FilterBar controller={filterController} />
      <RoomsContent {...roomsContentProps} />
    </>
  );
};
