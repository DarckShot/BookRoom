import { Skeleton } from '../../components/ui/Skeleton/Skeleton';
import styles from './RoomPage.module.css';
import { RoomScheduleLoading } from './RoomScheduleLoading';

export const RoomPageLoading = () => (
  <main className={styles.page} aria-busy="true">
    <div className={styles.breadcrumbSkeletons} aria-label="Загрузка переговорной">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
    <div className={styles.layout}>
      <article className={styles.roomCard}>
        <Skeleton className={styles.roomTitleSkeleton} />
        <Skeleton className={styles.roomAddressSkeleton} />
        <div className={styles.roomDetailsSkeletons}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </article>
      <RoomScheduleLoading />
    </div>
  </main>
);
