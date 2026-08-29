import { useEffect, useEffectEvent, useRef, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames';
import styles from './Modal.module.css';
import { getModalFocusableElements, trapModalFocus } from './utils';

interface ModalProps {
  ariaLabelledBy: string;
  children: ReactNode;
  onClose: () => void;
  panelClassName?: string;
}

export const Modal = ({ ariaLabelledBy, children, onClose, panelClassName }: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useEffectEvent(onClose);

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const previousActiveElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstControl = getModalFocusableElements(panel)[0];
    (firstControl ?? panel).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      trapModalFocus(event, panel);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, []);

  const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.backdrop} onMouseDown={closeFromBackdrop}>
      <div
        className={classNames(styles.panel, panelClassName)}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};
