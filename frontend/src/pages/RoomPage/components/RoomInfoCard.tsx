import { UsersIcon } from '../../../assets/icons/rooms';
import type { Room } from '../../../types/room';
import { formatOfficeAddress } from '../../../utils/office';
import styles from '../RoomPage.module.css';
import { RoomFeatureIcon } from './RoomFeatureIcon';

interface RoomInfoCardProps {
  room: Room;
}

export const RoomInfoCard = ({ room }: RoomInfoCardProps) => (
  <article className={styles.roomCard} aria-labelledby="room-name">
    <h1 id="room-name">{room.name}</h1>
    <p className={styles.officeAddress}>
      {room.office.name} · {formatOfficeAddress(room.office.address)}
    </p>
    <div className={styles.roomDetails}>
      <p>
        <UsersIcon />
        Вместимость: до {room.capacity} человек
      </p>
      {room.features.map((feature) => (
        <p key={feature.code}>
          <RoomFeatureIcon code={feature.code} />
          {feature.name}
        </p>
      ))}
    </div>
  </article>
);
