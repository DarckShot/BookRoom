import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout/AppLayout';
import { RoomsLayout } from '../components/layout/RoomsLayout/RoomsLayout';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';
import { paths } from './paths';

const RoomsPage = lazy(() =>
  import('../pages/RoomsPage/RoomsPage').then((module) => ({ default: module.RoomsPage })),
);
const RoomPage = lazy(() =>
  import('../pages/RoomPage/RoomPage').then((module) => ({ default: module.RoomPage })),
);
const BookingsPage = lazy(() =>
  import('../pages/BookingsPage/BookingsPage').then((module) => ({
    default: module.BookingsPage,
  })),
);

export const AppRouter = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<Navigate replace to={paths.rooms} />} />
      <Route path="rooms" element={<RoomsLayout />}>
        <Route
          index
          element={
            <Suspense fallback={null}>
              <RoomsPage />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="rooms/:roomId"
        element={
          <Suspense fallback={null}>
            <RoomPage />
          </Suspense>
        }
      />
      <Route
        path="bookings"
        element={
          <Suspense fallback={null}>
            <BookingsPage />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);
