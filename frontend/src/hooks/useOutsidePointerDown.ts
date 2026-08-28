import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';

export const useOutsidePointerDown = <T extends HTMLElement>(
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
) => {
  const rootRef = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, setIsOpen]);

  return rootRef;
};
