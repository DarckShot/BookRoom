import { MODAL_FOCUSABLE_SELECTOR } from './constants';

export const getModalFocusableElements = (panel: HTMLElement) =>
  Array.from(panel.querySelectorAll<HTMLElement>(MODAL_FOCUSABLE_SELECTOR));

export const trapModalFocus = (event: KeyboardEvent, panel: HTMLElement) => {
  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements = getModalFocusableElements(panel);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements.at(-1);

  if (!firstElement || !lastElement) {
    event.preventDefault();
    panel.focus();
    return;
  }

  const activeElement = document.activeElement;
  const focusLastElement =
    event.shiftKey &&
    (activeElement === firstElement || activeElement === panel || !panel.contains(activeElement));
  const focusFirstElement =
    !event.shiftKey && (activeElement === lastElement || !panel.contains(activeElement));

  if (focusLastElement || focusFirstElement) {
    event.preventDefault();
    (focusLastElement ? lastElement : firstElement).focus();
  }
};
