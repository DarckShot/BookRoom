import type { ReactNode } from 'react';
import styles from './FilterField.module.css';

interface FilterFieldProps {
  label: string;
  children: ReactNode;
}

export const FilterField = ({ label, children }: FilterFieldProps) => (
  <div className={styles.field}>
    <span className={styles.label}>{label}</span>
    {children}
  </div>
);
