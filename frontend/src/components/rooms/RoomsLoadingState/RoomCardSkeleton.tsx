import { classNames } from '../../../utils/classNames';
import { Skeleton } from '../../ui/Skeleton/Skeleton';
import styles from './RoomsLoadingState.module.css';

export const RoomCardSkeleton = () => (
  <article className={styles.card} aria-hidden="true">
    <Skeleton className={styles.name} />
    <Skeleton className={styles.floor} />
    <span className={classNames(styles.row, styles.firstRow)}>
      <Skeleton className={styles.circle} />
      <Skeleton className={styles.line} />
    </span>
    <span className={styles.row}>
      <Skeleton className={styles.circle} />
      <Skeleton className={styles.line} />
    </span>
    <Skeleton className={styles.availability} />
    <span className={styles.actions}>
      <Skeleton className={styles.action} />
      <Skeleton className={styles.action} />
    </span>
  </article>
);
