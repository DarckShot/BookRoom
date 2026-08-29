import { RoomCard } from '../../../components/rooms/RoomCard/RoomCard';
import type { Room } from '../../../types/room';
import styles from '../RoomsPage.module.css';

interface RoomsListProps {
  rooms: Room[];
  search: string;
}

export const RoomsList = ({ rooms, search }: RoomsListProps) => (
  <main className={styles.content}>
    <h1 className={styles.title}>Доступные переговорные в этом офисе</h1>
    <div className={styles.grid}>
      {rooms.map((room) => (
        <RoomCard room={room} search={search} key={room.id} />
      ))}
    </div>
  </main>
);
