import { RoomCardSkeleton } from './RoomCardSkeleton';
import styles from './RoomsLoadingState.module.css';
import { SKELETON_KEYS } from './constants';

export const RoomsLoadingState = () => (
  <main className={styles.content} aria-busy="true" aria-live="polite">
    <h1>Загрузка переговорных…</h1>
    <div className={styles.grid}>
      {SKELETON_KEYS.map((key) => (
        <RoomCardSkeleton key={key} />
      ))}
    </div>
  </main>
);
