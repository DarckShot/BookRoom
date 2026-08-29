import { Outlet } from 'react-router-dom';
import { useRealtime } from '../../../hooks/useRealtime';
import { ConnectionStatusBanner } from '../ConnectionStatusBanner/ConnectionStatusBanner';
import { Header } from '../Header/Header';
import styles from './AppLayout.module.css';

export const AppLayout = () => {
  const realtime = useRealtime();

  return (
    <div className={styles.layout}>
      {realtime.status === 'reconnecting' ? (
        <ConnectionStatusBanner onReconnect={realtime.reconnect} />
      ) : null}
      <Header />
      <Outlet />
    </div>
  );
};
