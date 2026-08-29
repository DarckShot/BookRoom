import { DatePicker } from '../../components/rooms/DatePicker/DatePicker';
import type { RoomScheduleProps } from './types';
import { formatRoomScheduleDate, getMinimumBookingStartTime } from '../../utils/roomSchedule';
import styles from './RoomSchedule.module.css';
import { RoomTimeline } from './RoomTimeline';

type RoomScheduleReadyProps = Omit<RoomScheduleProps, 'status' | 'onRetry'>;

export const RoomScheduleReady = ({
  bookings,
  currentUserId,
  date,
  minDate,
  maxDate,
  timeZone,
  now,
  onDateChange,
  onBook,
  onTimeSelect,
}: RoomScheduleReadyProps) => {
  const minimumStartTime = getMinimumBookingStartTime(date, now, timeZone);

  return (
    <section className={styles.card} aria-labelledby="schedule-title">
      <div className={styles.header}>
        <div>
          <h2 id="schedule-title">Расписание на день</h2>
          <p>{formatRoomScheduleDate(date)}</p>
        </div>
        <DatePicker
          className={styles.datePicker}
          value={date}
          min={minDate}
          max={maxDate}
          formattedValue="Выбрать дату"
          onChange={onDateChange}
        />
      </div>
      <RoomTimeline
        bookings={bookings}
        currentUserId={currentUserId}
        timeZone={timeZone}
        minimumStartTime={minimumStartTime}
        onTimeSelect={onTimeSelect}
      />
      <button className={styles.bookButton} type="button" onClick={onBook}>
        Забронировать комнату
      </button>
    </section>
  );
};
