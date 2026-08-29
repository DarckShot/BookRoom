import { BookingRoomIcon } from '../../../assets/icons/bookings';
import type { Booking } from '../../../types/booking';
import {
  formatBookingDay,
  formatBookingMonth,
  formatBookingTimeRange,
  formatBookingTimeZone,
} from '../../../utils/bookings';
import styles from './BookingCard.module.css';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (booking: Booking) => void;
}

export const BookingCard = ({ booking, onCancel }: BookingCardProps) => (
  <article className={styles.card}>
    <time className={styles.date} dateTime={booking.startsAt}>
      <span className={styles.month}>{formatBookingMonth(booking)}</span>
      <span className={styles.day}>{formatBookingDay(booking)}</span>
    </time>

    <div className={styles.content}>
      <h2 className={styles.title}>{booking.title}</h2>
      <div className={styles.metadata}>
        <span className={styles.room}>
          <BookingRoomIcon className={styles.roomIcon} />
          {booking.room.name}
        </span>
        <span className={styles.separator} aria-hidden="true" />
        <span>{booking.room.floor} этаж</span>
        <span className={styles.separator} aria-hidden="true" />
        <span>
          {formatBookingTimeRange(booking)} {formatBookingTimeZone(booking.office.timezone)}
        </span>
      </div>
    </div>

    {onCancel ? (
      <button className={styles.cancelButton} type="button" onClick={() => onCancel(booking)}>
        Отменить
      </button>
    ) : null}
  </article>
);
