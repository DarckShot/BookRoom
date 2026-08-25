import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const AppLayout = () => {
  return (
    <div className="app-layout">
      <Header />
      <Outlet />
    </div>
  );
};
