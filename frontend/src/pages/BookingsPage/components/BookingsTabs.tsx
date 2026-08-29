import { PAST_BOOKINGS_TAB, UPCOMING_BOOKINGS_TAB } from '../../../constants/bookings';
import type { BookingsTab } from '../../../types/booking';
import { classNames } from '../../../utils/classNames';
import styles from '../BookingsPage.module.css';

interface BookingsTabsProps {
  activeTab: BookingsTab;
  upcomingCount: number;
  onChange: (tab: BookingsTab) => void;
}

export const BookingsTabs = ({ activeTab, upcomingCount, onChange }: BookingsTabsProps) => (
  <div className={styles.tabs} role="tablist" aria-label="Период бронирований">
    <button
      className={classNames(styles.tab, activeTab === UPCOMING_BOOKINGS_TAB && styles.activeTab)}
      type="button"
      role="tab"
      aria-selected={activeTab === UPCOMING_BOOKINGS_TAB}
      onClick={() => onChange(UPCOMING_BOOKINGS_TAB)}
    >
      Предстоящие ({upcomingCount})
    </button>
    <button
      className={classNames(styles.tab, activeTab === PAST_BOOKINGS_TAB && styles.activeTab)}
      type="button"
      role="tab"
      aria-selected={activeTab === PAST_BOOKINGS_TAB}
      onClick={() => onChange(PAST_BOOKINGS_TAB)}
    >
      Прошедшие
    </button>
  </div>
);
