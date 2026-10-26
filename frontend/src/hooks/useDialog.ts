import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR: string =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const useDialog: (onClose: () => void) => React.RefObject<HTMLDivElement | null> = (
  onClose: () => void
) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef<() => void>(onClose);

  useEffect((): void => {
    onCloseRef.current = onClose;
  });

  useEffect((): (() => void) => {
    const dialog: HTMLDivElement | null = dialogRef.current;
    const previouslyFocused: HTMLElement | null =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    dialog?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialog) {
        return;
      }

      const focusable: HTMLElement[] = [
        ...dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ];
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first: HTMLElement = focusable[0];
      const last: HTMLElement = focusable[focusable.length - 1];
      const active: Element | null = document.activeElement;

      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  return dialogRef;
};

export { useDialog };
