import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useOutsidePointerDown } from '../../../hooks/useOutsidePointerDown';
import type { SelectOption } from '../../../types/select';
import type { UseCustomSelectProps } from './types';

export const useCustomSelect = ({
  value,
  options,
  onChange,
  disabled = false,
}: UseCustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useOutsidePointerDown<HTMLDivElement>(isOpen, setIsOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    if (isOpen) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex, isOpen]);

  const openMenu = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    if (disabled || options.length === 0) {
      return;
    }

    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeMenu = (restoreFocus = false) => {
    setIsOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const selectOption = (option: SelectOption) => {
    onChange(option.value);
    closeMenu(true);
  };

  const focusOption = (index: number) => {
    setActiveIndex(index);
    optionRefs.current[index]?.focus();
  };

  const moveFocus = (direction: number) => {
    focusOption((activeIndex + direction + options.length) % options.length);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isOpen && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      selectOption(options[activeIndex]);
      return;
    }

    if (isOpen && event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      if (isOpen) {
        moveFocus(event.key === 'ArrowDown' ? 1 : -1);
      } else {
        openMenu(event.key === 'ArrowUp' ? options.length - 1 : undefined);
      }
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(event.key === 'ArrowDown' ? 1 : -1);
    }
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  };

  const setOptionRef = (index: number, element: HTMLButtonElement | null) => {
    optionRefs.current[index] = element;
  };

  return {
    rootRef,
    triggerRef,
    state: {
      isOpen,
      activeIndex,
      selectedOption,
    },
    meta: {
      listboxId,
    },
    actions: {
      toggleMenu,
      handleTriggerKeyDown,
      handleMenuKeyDown,
      selectOption,
      setActiveIndex,
      setOptionRef,
    },
  };
};
