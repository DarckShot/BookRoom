import type { Booking } from '../../types/booking';
import { classNames } from '../../utils/classNames';
import { getAvailableRoomScheduleSlots, getBookingPlacement } from '../../utils/roomSchedule';
import styles from './RoomTimeline.module.css';
import { RoomTimelineFrame } from './RoomTimelineFrame';
import { RoomTimelineSlots } from './RoomTimelineSlots';

interface RoomTimelineProps {
  bookings: Booking[];
  currentUserId: string;
  timeZone: string;
  minimumStartTime: string;
  onTimeSelect: (startTime: string) => void;
}

export const RoomTimeline = ({
  bookings,
  currentUserId,
  timeZone,
  minimumStartTime,
  onTimeSelect,
}: RoomTimelineProps) => {
  const placements = bookings.flatMap((booking) => {
    const placement = getBookingPlacement(booking, timeZone);

    return placement ? [placement] : [];
  });
  const availableSlots = getAvailableRoomScheduleSlots(bookings, timeZone, minimumStartTime);

  return (
    <RoomTimelineFrame label="Расписание переговорной с 09:00 до 20:00">
      <RoomTimelineSlots slots={availableSlots} onSelect={onTimeSelect} />
      {placements.map(({ booking, top, height }) => {
        const isOwned = booking.userId === currentUserId;
        const label = isOwned ? booking.title : 'Занято';

        return (
          <div
            className={classNames(styles.booking, isOwned && styles.ownedBooking)}
            style={{ top: `${top}%`, height: `${height}%` }}
            key={booking.id}
            title={label}
          >
            <span>{label}</span>
          </div>
        );
      })}
    </RoomTimelineFrame>
  );
};
