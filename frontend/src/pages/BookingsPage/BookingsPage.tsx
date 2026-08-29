import type { ReactNode } from 'react';
import { CancelBookingDialog } from '../../components/bookings/CancelBookingDialog/CancelBookingDialog';
import { BookingsEmptyState } from './states/BookingsEmptyState';
import { BookingsErrorState } from './states/BookingsErrorState';
import { BookingsList } from './components/BookingsList';
import { BookingsLoadingState } from './states/BookingsLoadingState';
import styles from './BookingsPage.module.css';
import { BookingsTabs } from './components/BookingsTabs';
import { BookingsToolbar } from './components/BookingsToolbar';
import type { BookingsPageStatus } from './model/types';
import { useBookingsPage } from './model/useBookingsPage';

export const BookingsPage = () => {
  const { data, status, actions } = useBookingsPage();
  const readyContent = data.bookings.length ? (
    <BookingsList
      bookings={data.bookings}
      tab={data.tab}
      now={data.now}
      onCancel={actions.openCancellation}
    />
  ) : (
    <BookingsEmptyState tab={data.tab} />
  );
  const pageContent: Record<Exclude<BookingsPageStatus, 'loading'>, ReactNode> = {
    error: <BookingsErrorState onRetry={actions.retry} />,
    ready: readyContent,
  };

  return (
    <>
      {status.page === 'loading' ? (
        <BookingsLoadingState />
      ) : (
        <main className={styles.page}>
          <BookingsToolbar
            officeId={data.officeId}
            officeOptions={data.officeOptions}
            period={data.period}
            onOfficeChange={actions.selectOffice}
            onPeriodChange={actions.selectPeriod}
          />
          <BookingsTabs
            activeTab={data.tab}
            upcomingCount={data.upcomingCount}
            onChange={actions.selectTab}
          />
          {pageContent[status.page]}
        </main>
      )}

      {data.selectedBooking ? (
        <CancelBookingDialog
          booking={data.selectedBooking}
          isPending={status.isCancelling}
          errorMessage={status.cancellationError}
          onClose={actions.closeCancellation}
          onConfirm={actions.confirmCancellation}
        />
      ) : null}
    </>
  );
};
