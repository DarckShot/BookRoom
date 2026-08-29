import { FilterBar } from '../../components/rooms/FilterBar/FilterBar';
import { RoomsContent } from './states/RoomsContent';
import { useRoomsPage } from './model/useRoomsPage';

export const RoomsPage = () => {
  const { filterController, roomsContentProps } = useRoomsPage();

  return (
    <>
      <FilterBar controller={filterController} />
      <RoomsContent {...roomsContentProps} />
    </>
  );
};
