import { Skeleton } from '../../../components/ui/Skeleton/Skeleton';
import styles from './RoomSchedule.module.css';
import { RoomTimelineFrame } from '../timeline/RoomTimelineFrame';

export const RoomScheduleLoading = () => (
  <section className={styles.card} aria-busy="true" aria-label="Загрузка расписания">
    <div className={styles.header}>
      <div>
        <Skeleton className={styles.titleSkeleton} />
        <Skeleton className={styles.dateSkeleton} />
      </div>
      <Skeleton className={styles.dateButtonSkeleton} />
    </div>
    <RoomTimelineFrame />
    <Skeleton className={styles.bookButtonSkeleton} />
  </section>
);
