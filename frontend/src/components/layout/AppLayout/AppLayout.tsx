import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import styles from './AppLayout.module.css';

export const AppLayout = () => (
  <div className={styles.layout}>
    <Header />
    <Outlet />
  </div>
);
