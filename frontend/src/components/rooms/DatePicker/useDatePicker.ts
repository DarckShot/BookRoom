import { addDays } from 'date-fns/addDays';
import { addMonths } from 'date-fns/addMonths';
import { endOfMonth } from 'date-fns/endOfMonth';
import { format } from 'date-fns/format';
import { isAfter } from 'date-fns/isAfter';
import { isBefore } from 'date-fns/isBefore';
import { parseISO } from 'date-fns/parseISO';
import { startOfMonth } from 'date-fns/startOfMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { useRef, useState, type KeyboardEvent } from 'react';
import { useOutsidePointerDown } from '../../../hooks/useOutsidePointerDown';
import { CALENDAR_DAY_COUNT } from './constants';
import type { UseDatePickerProps } from './types';

export const useDatePicker = ({ value, min, max, onChange }: UseDatePickerProps) => {
  const selectedDate = value ? parseISO(value) : parseISO(min);
  const minDate = parseISO(min);
  const maxDate = parseISO(max);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate));
  const rootRef = useOutsidePointerDown<HTMLDivElement>(isOpen, setIsOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarStart = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
  const days = Array.from({ length: CALENDAR_DAY_COUNT }, (_, index) =>
    addDays(calendarStart, index),
  );
  const previousMonth = addMonths(visibleMonth, -1);
  const nextMonth = addMonths(visibleMonth, 1);

  const closeCalendar = () => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleRootKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeCalendar();
    }
  };

  const selectDate = (date: Date) => {
    onChange(format(date, 'yyyy-MM-dd'));
    closeCalendar();
  };

  const toggleCalendar = () => {
    setVisibleMonth(startOfMonth(selectedDate));
    setIsOpen((current) => !current);
  };

  const goToPreviousMonth = () => {
    setVisibleMonth(previousMonth);
  };

  const goToNextMonth = () => {
    setVisibleMonth(nextMonth);
  };

  return {
    rootRef,
    triggerRef,
    state: {
      isOpen,
      visibleMonth,
    },
    calendar: {
      selectedDate,
      minDate,
      maxDate,
      days,
      canGoPrevious: !isBefore(endOfMonth(previousMonth), minDate),
      canGoNext: !isAfter(startOfMonth(nextMonth), maxDate),
    },
    actions: {
      goToPreviousMonth,
      goToNextMonth,
      toggleCalendar,
      handleRootKeyDown,
      selectDate,
    },
  };
};
