import { Link } from 'react-router-dom';
import { BookingEmptyIcon } from '../../assets/icons/bookings';
import { UPCOMING_BOOKINGS_TAB } from '../../constants/bookings';
import { paths } from '../../router/paths';
import type { BookingsTab } from '../../types/booking';
import styles from './BookingsPage.module.css';

interface BookingsEmptyStateProps {
  tab: BookingsTab;
}

export const BookingsEmptyState = ({ tab }: BookingsEmptyStateProps) => {
  const isUpcoming = tab === UPCOMING_BOOKINGS_TAB;

  return (
    <section className={styles.state} aria-labelledby="bookings-empty-title">
      <div className={styles.emptyIconCircle}>
        <BookingEmptyIcon className={styles.emptyIcon} />
      </div>
      <h2 className={styles.stateTitle} id="bookings-empty-title">
        {isUpcoming ? 'Нет бронирований' : 'Нет прошедших бронирований'}
      </h2>
      <p className={styles.stateDescription}>
        {isUpcoming ? (
          <>
            У вас пока нет предстоящих бронирований.
            <br />
            Перейдите в раздел переговорных, чтобы забронировать комнату.
          </>
        ) : (
          'Завершённые встречи появятся в этом разделе.'
        )}
      </p>
      {isUpcoming ? (
        <Link className={styles.primaryButton} to={paths.rooms}>
          Перейти к переговорным
        </Link>
      ) : null}
    </section>
  );
};
