import type { AvailableRoomScheduleSlot } from '../../types/roomSchedule';
import styles from './RoomTimeline.module.css';

interface RoomTimelineSlotsProps {
  slots: AvailableRoomScheduleSlot[];
  onSelect: (startTime: string) => void;
}

export const RoomTimelineSlots = ({ slots, onSelect }: RoomTimelineSlotsProps) => (
  <>
    {slots.map(({ startTime, top, height }) => (
      <button
        className={styles.slot}
        style={{ top: `${top}%`, height: `${height}%` }}
        type="button"
        aria-label={`Забронировать на ${startTime}`}
        title={`Забронировать на ${startTime}`}
        onClick={() => onSelect(startTime)}
        key={startTime}
      />
    ))}
  </>
);
