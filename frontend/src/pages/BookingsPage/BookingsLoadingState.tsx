import { Skeleton } from '../../components/ui/Skeleton/Skeleton';
import { BOOKINGS_SKELETON_KEYS } from './constants';
import styles from './BookingsPage.module.css';

export const BookingsLoadingState = () => (
  <main className={styles.page} aria-busy="true" aria-live="polite">
    <h1 className={styles.visuallyHidden}>Загрузка бронирований…</h1>
    <div className={styles.loadingToolbar}>
      <Skeleton className={styles.titleSkeleton} />
      <div className={styles.loadingFilters}>
        <Skeleton className={styles.officeFilterSkeleton} />
        <Skeleton className={styles.periodFilterSkeleton} />
      </div>
    </div>
    <div className={styles.loadingTabs}>
      <Skeleton className={styles.tabSkeleton} />
      <Skeleton className={styles.tabSkeletonShort} />
    </div>
    <div className={styles.loadingList}>
      {BOOKINGS_SKELETON_KEYS.map((key) => (
        <div className={styles.cardSkeleton} key={key}>
          <div className={styles.dateSkeleton}>
            <Skeleton className={styles.monthSkeleton} />
            <Skeleton className={styles.daySkeleton} />
          </div>
          <div className={styles.cardContentSkeleton}>
            <Skeleton className={styles.cardTitleSkeleton} />
            <div className={styles.metadataSkeleton}>
              <Skeleton className={styles.metadataItemSkeleton} />
              <span className={styles.skeletonDot} />
              <Skeleton className={styles.metadataShortSkeleton} />
              <span className={styles.skeletonDot} />
              <Skeleton className={styles.metadataTimeSkeleton} />
            </div>
          </div>
          <Skeleton className={styles.cancelSkeleton} />
        </div>
      ))}
    </div>
  </main>
);
