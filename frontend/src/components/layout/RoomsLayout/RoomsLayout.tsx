import { Outlet } from 'react-router-dom';
import type { RoomsLayoutContextValue } from '../../../hooks/useRoomsLayoutContext';
import { OfficePanel } from '../../rooms/OfficePanel/OfficePanel';
import styles from './RoomsLayout.module.css';
import { useRoomsLayout } from './useRoomsLayout';

export const RoomsLayout = () => {
  const { selectedOffice, officesStatus, officePanelProps } = useRoomsLayout();

  return (
    <div className={styles.layout}>
      <OfficePanel {...officePanelProps} />
      <Outlet context={{ selectedOffice, officesStatus } satisfies RoomsLayoutContextValue} />
    </div>
  );
};
