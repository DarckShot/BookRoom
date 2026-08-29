import { useEffect, useEffectEvent } from 'react';
import { CloseCircleIcon, SuccessCheckIcon } from '../../../assets/icons/ui';
import styles from './BookingSuccessToast.module.css';
import { BOOKING_SUCCESS_TOAST_DURATION_MS } from './constants';
import type { BookingSuccessToastProps } from './types';
import { formatCreatedBooking } from './utils';

export const BookingSuccessToast = ({ booking, onClose }: BookingSuccessToastProps) => {
  const close = useEffectEvent(onClose);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => close(), BOOKING_SUCCESS_TOAST_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <section className={styles.toast} role="status" aria-live="polite">
      <span className={styles.icon} aria-hidden="true">
        <SuccessCheckIcon />
      </span>
      <div>
        <h2>Бронирование создано</h2>
        <p>{formatCreatedBooking(booking)}</p>
      </div>
      <button type="button" aria-label="Закрыть уведомление" onClick={onClose}>
        <CloseCircleIcon />
      </button>
    </section>
  );
};
