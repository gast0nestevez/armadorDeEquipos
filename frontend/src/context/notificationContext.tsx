import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type NotificationKind = 'error' | 'success';

type Notification = {
  message: string;
  kind: NotificationKind;
};

type NotificationContextType = {
  notify: (message: string, kind?: NotificationKind) => void;
};

const NOTIFICATION_DURATION: number = 4000;

const NotificationContext: React.Context<NotificationContextType> =
  createContext<NotificationContextType>({} as NotificationContextType);

type NotificationProviderProps = {
  children: React.ReactNode;
};

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const notify: (message: string, kind?: NotificationKind) => void = useCallback(
    (message: string, kind: NotificationKind = 'error'): void => {
      window.clearTimeout(timeoutRef.current);
      setNotification({ message, kind });
      timeoutRef.current = window.setTimeout((): void => {
        setNotification(null);
      }, NOTIFICATION_DURATION);
    },
    []
  );

  const value: NotificationContextType = useMemo(
    (): NotificationContextType => ({ notify }),
    [notify]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notification && (
        <div
          role={notification.kind === 'error' ? 'alert' : 'status'}
          className={`fixed bottom-6 left-1/2 z-[60] w-max max-w-[90vw] -translate-x-1/2 rounded px-5 py-3 text-center shadow-lg white-text ${notification.kind === 'error' ? 'bg-red-600' : 'bg-green-600'}`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

const useNotification: () => NotificationContextType = (): NotificationContextType =>
  useContext(NotificationContext);

export type { NotificationKind };

export { NotificationProvider, useNotification };
