import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout/AppLayout';
import { RoomsLayout } from '../components/layout/RoomsLayout/RoomsLayout';
import { BookingsPage } from '../pages/BookingsPage/BookingsPage';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';
import { RoomPage } from '../pages/RoomPage/RoomPage';
import { RoomsPage } from '../pages/RoomsPage/RoomsPage';
import { paths } from './paths';

export const AppRouter = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<Navigate replace to={paths.rooms} />} />
      <Route path="rooms" element={<RoomsLayout />}>
        <Route index element={<RoomsPage />} />
      </Route>
      <Route path="rooms/:roomId" element={<RoomPage />} />
      <Route path="bookings" element={<BookingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);
