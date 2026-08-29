import { BookingCard } from '../../../components/bookings/BookingCard/BookingCard';
import { UPCOMING_BOOKINGS_TAB } from '../../../constants/bookings';
import type { Booking, BookingsTab } from '../../../types/booking';
import { isUpcomingBooking } from '../../../utils/bookings';
import styles from '../BookingsPage.module.css';

interface BookingsListProps {
  bookings: Booking[];
  tab: BookingsTab;
  now: Date;
  onCancel: (booking: Booking) => void;
}

export const BookingsList = ({ bookings, tab, now, onCancel }: BookingsListProps) => (
  <div className={styles.list} aria-label="Список бронирований">
    {bookings.map((booking) => (
      <BookingCard
        booking={booking}
        key={booking.id}
        onCancel={
          tab === UPCOMING_BOOKINGS_TAB && isUpcomingBooking(booking, now) ? onCancel : undefined
        }
      />
    ))}
  </div>
);
