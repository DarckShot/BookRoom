import { lazy, Suspense, type ReactNode } from 'react';
import { BookingSuccessToast } from '../../components/bookings/BookingSuccessToast/BookingSuccessToast';
import { RoomBreadcrumbs } from './components/RoomBreadcrumbs';
import { RoomInfoCard } from './components/RoomInfoCard';
import { RoomPageError } from './states/RoomPageError';
import { RoomPageLoading } from './states/RoomPageLoading';
import styles from './RoomPage.module.css';
import { RoomSchedule } from './schedule/RoomSchedule';
import type { RoomPageStatus } from './model/types';
import { useRoomPage } from './model/useRoomPage';

const BookingDialog = lazy(() =>
  import('../../components/bookings/BookingDialog/BookingDialog').then((module) => ({
    default: module.BookingDialog,
  })),
);

export const RoomPage = () => {
  const { data, status, actions } = useRoomPage();
  const readyContent = data.room ? (
    <>
      <main className={styles.page}>
        <RoomBreadcrumbs room={data.room} search={data.search} />
        <div className={styles.layout}>
          <RoomInfoCard room={data.room} />
          <RoomSchedule
            status={status.schedule}
            bookings={data.bookings}
            currentUserId={data.currentUserId}
            date={data.date}
            minDate={data.minDate}
            maxDate={data.maxDate}
            timeZone={data.room.office.timezone}
            now={data.now}
            onDateChange={actions.changeDate}
            onRetry={actions.retrySchedule}
            onBook={actions.openBooking}
            onTimeSelect={actions.openBookingAt}
          />
        </div>
      </main>
      {data.isBookingOpen ? (
        <Suspense fallback={null}>
          <BookingDialog
            room={data.room}
            selectedDate={data.date}
            initialStartTime={data.bookingStartTime}
            search={data.search}
            onClose={actions.closeBooking}
            onCreated={actions.finishBooking}
          />
        </Suspense>
      ) : null}
      {data.createdSeries ? (
        <BookingSuccessToast series={data.createdSeries} onClose={actions.dismissBookingSuccess} />
      ) : null}
    </>
  ) : (
    <RoomPageLoading />
  );
  const content: Record<RoomPageStatus, ReactNode> = {
    loading: <RoomPageLoading />,
    error: <RoomPageError onRetry={actions.retryPage} />,
    ready: readyContent,
  };

  return content[status.page];
};
