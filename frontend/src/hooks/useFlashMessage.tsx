import { useRef, useState } from 'react';

const useFlashMessage = (duration: number = 1500) => {
  const [visible, setVisible] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  const trigger = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(true);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setVisible(false);
    }, duration);
  };

  return { visible, trigger, hide };
};

export { useFlashMessage };
