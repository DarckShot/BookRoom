import { BookingRoomIcon } from '../../../assets/icons/bookings';
import { CalendarIcon } from '../../../assets/icons/rooms';
import type { Booking } from '../../../types/booking';
import { formatBookingConfirmationDate } from '../../../utils/bookings';
import { Modal } from '../../ui/Modal/Modal';
import styles from './CancelBookingDialog.module.css';

interface CancelBookingDialogProps {
  booking: Booking;
  isPending: boolean;
  errorMessage?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelBookingDialog = ({
  booking,
  isPending,
  errorMessage,
  onClose,
  onConfirm,
}: CancelBookingDialogProps) => (
  <Modal ariaLabelledBy="cancel-booking-title" onClose={onClose} panelClassName={styles.panel}>
    <div className={styles.content}>
      <h2 className={styles.title} id="cancel-booking-title">
        Отменить бронирование?
      </h2>
      <p className={styles.description}>
        Это действие нельзя будет отменить. Освободившееся время станет доступно другим сотрудникам.
      </p>

      <div className={styles.bookingInfo}>
        <strong className={styles.bookingTitle}>{booking.title}</strong>
        <span className={styles.infoRow}>
          <BookingRoomIcon className={styles.icon} />
          Комната «{booking.room.name}», {booking.room.floor} этаж
        </span>
        <span className={styles.infoRow}>
          <CalendarIcon className={styles.icon} />
          {formatBookingConfirmationDate(booking)}
        </span>
      </div>

      {errorMessage ? (
        <p className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className={styles.actions}>
        <button className={styles.keepButton} type="button" disabled={isPending} onClick={onClose}>
          Нет, оставить
        </button>
        <button
          className={styles.confirmButton}
          type="button"
          disabled={isPending}
          onClick={onConfirm}
        >
          {isPending ? 'Отменяем…' : 'Да, отменить'}
        </button>
      </div>
    </div>
  </Modal>
);
