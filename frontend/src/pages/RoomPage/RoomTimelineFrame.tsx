import type { ReactNode } from 'react';
import { formatMinutesAsTime } from '../../utils/roomFilters';
import { getRoomScheduleHourPosition } from '../../utils/roomSchedule';
import { ROOM_SCHEDULE_HOURS } from './constants';
import styles from './RoomTimeline.module.css';

interface RoomTimelineFrameProps {
  children?: ReactNode;
  label?: string;
}

export const RoomTimelineFrame = ({ children, label }: RoomTimelineFrameProps) => (
  <div className={styles.timeline} aria-label={label}>
    <div className={styles.timeLabels} aria-hidden="true">
      {ROOM_SCHEDULE_HOURS.map((hour) => (
        <span style={{ top: getRoomScheduleHourPosition(hour) }} key={hour}>
          {formatMinutesAsTime(hour * 60)}
        </span>
      ))}
    </div>
    <div className={styles.grid}>
      {ROOM_SCHEDULE_HOURS.map((hour) => (
        <span
          className={styles.line}
          style={{ top: getRoomScheduleHourPosition(hour) }}
          key={hour}
          aria-hidden="true"
        />
      ))}
      {children}
    </div>
  </div>
);
