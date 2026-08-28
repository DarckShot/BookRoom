import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { isValidRoomStartTime } from '../../../utils/roomFilters';
import type { UseTimeInputProps } from './types';
import { maskTime } from './utils';

export const useTimeInput = ({ value, min, max, onChange }: UseTimeInputProps) => {
  const [draft, setDraft] = useState(value);

  const commitValue = () => {
    if (isValidRoomStartTime(draft, min, max)) {
      onChange(draft);
      return;
    }

    setDraft(value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = maskTime(event.target.value);
    setDraft(nextValue);

    if (nextValue.length === 5 && isValidRoomStartTime(nextValue, min, max)) {
      onChange(nextValue);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  };

  return { draft, commitValue, handleChange, handleKeyDown };
};
