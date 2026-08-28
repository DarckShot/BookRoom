import { classNames } from '../../../utils/classNames';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <span className={classNames(styles.skeleton, className)} aria-hidden="true" />
);
