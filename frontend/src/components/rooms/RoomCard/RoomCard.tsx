import { Link } from 'react-router-dom';
import { ClockIcon, UsersIcon } from '../../../assets/icons/rooms';
import { paths } from '../../../router/paths';
import type { Room } from '../../../types/room';
import { classNames } from '../../../utils/classNames';
import styles from './RoomCard.module.css';

interface RoomCardProps {
  room: Room;
  search: string;
}

export const RoomCard = ({ room, search }: RoomCardProps) => {
  const isAvailable = room.available !== false;
  const roomPath = `${paths.room(room.id)}${search ? `?${search}` : ''}`;

  return (
    <article className={styles.card} aria-labelledby={`room-${room.id}-name`}>
      <header>
        <h2 id={`room-${room.id}-name`}>{room.name}</h2>
        <p>{room.floor} этаж</p>
      </header>

      <div className={styles.details}>
        <p>
          <UsersIcon />
          Вместимость: до {room.capacity} человек
        </p>
        <p>
          <ClockIcon />
          {isAvailable ? 'Свободна в выбранное время' : 'Занята в выбранное время'}
        </p>
      </div>

      <p
        className={classNames(
          styles.availability,
          isAvailable ? styles.available : styles.unavailable,
        )}
      >
        <span aria-hidden="true" />
        {isAvailable ? 'Доступно на выбранное время' : 'Недоступно на выбранное время'}
      </p>

      <div className={styles.actions}>
        <Link className={styles.detailsLink} to={roomPath}>
          Подробнее
        </Link>
        {isAvailable ? (
          <Link className={styles.bookLink} to={roomPath}>
            Забронировать
          </Link>
        ) : (
          <button className={styles.bookLink} type="button" disabled>
            Забронировать
          </button>
        )}
      </div>
    </article>
  );
};
