import type { ReactNode } from 'react';
import styles from './PageShell.module.css';

interface PageShellProps {
  children: ReactNode;
}

export const PageShell = ({ children }: PageShellProps) => (
  <main className={styles.page}>{children}</main>
);
