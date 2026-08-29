import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '../../assets/icons/ui';
import { createOfficeRoomsPath } from '../../router/utils';
import type { Room } from '../../types/room';
import styles from './RoomPage.module.css';

interface RoomBreadcrumbsProps {
  room: Room;
  search: string;
}

export const RoomBreadcrumbs = ({ room, search }: RoomBreadcrumbsProps) => {
  const roomsPath = createOfficeRoomsPath(search, room.office.id);

  return (
    <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
      <Link to={roomsPath}>Переговорные</Link>
      <ChevronRightIcon />
      <Link to={roomsPath}>{room.office.name}</Link>
      <ChevronRightIcon />
      <span aria-current="page">Комната '{room.name}'</span>
    </nav>
  );
};
