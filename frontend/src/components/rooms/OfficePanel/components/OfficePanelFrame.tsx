import type { ReactNode } from 'react';
import styles from '../OfficePanel.module.css';

interface OfficePanelFrameProps {
  ariaLabel: string;
  children: ReactNode;
}

export const OfficePanelFrame = ({ ariaLabel, children }: OfficePanelFrameProps) => (
  <section className={styles.panel} aria-label={ariaLabel}>
    {children}
  </section>
);
