import { ClockIcon } from '../../../assets/icons/rooms';
import { classNames } from '../../../utils/classNames';
import styles from './TimeInput.module.css';
import type { TimeInputProps } from './types';
import { useTimeInput } from './useTimeInput';

export const TimeInput = ({
  value,
  min,
  max,
  onChange,
  disabled = false,
  className,
  ariaInvalid = false,
  ariaDescribedBy,
}: TimeInputProps) => {
  const { draft, commitValue, handleChange, handleKeyDown } = useTimeInput({
    value,
    min,
    max,
    onChange,
  });

  return (
    <label className={classNames(styles.root, className)}>
      <ClockIcon className={styles.icon} />
      <input
        className={styles.input}
        aria-label="Время начала"
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="—:—"
        value={disabled ? '' : draft}
        disabled={disabled}
        onChange={handleChange}
        onBlur={commitValue}
        onKeyDown={handleKeyDown}
      />
    </label>
  );
};
