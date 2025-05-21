import { AnimatePresence, motion } from 'framer-motion';
import { createContext, memo, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ToastComponent, ToastComponentProps } from './toast.component';

const ToastContext = createContext<{
  addToast(props: ToastComponentProps): void;
  addStickyToast(props: ToastComponentProps, id?: string): () => void;
}>({
  addToast: () => undefined,
  addStickyToast: () => () => { },
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ToastProvider = memo<{ children: ReactNode }>(({ children }) => {
  const [toasts, setToasts] = useState<
    { props: ToastComponentProps; id: string; isSticky: boolean }[]
  >([]);

  const addToast = useCallback(async (props: ToastComponentProps) => {
    const id = uuidv4();
    setToasts((_toasts) => [..._toasts, { props, id, isSticky: false }]);
    await delay(6000);
    setToasts((_toasts) => _toasts.filter((t) => t.id !== id));
  }, []);

  const addStickyToast = useCallback(
    (props: ToastComponentProps, id = uuidv4()) => {
      setToasts((_toasts) => [..._toasts, { props, id, isSticky: true }]);
      return () => setToasts((_toasts) => _toasts.filter((t) => t.id !== id));
    },
    [],
  );

  // Put sticky toasts at the top
  const sortedToasts = useMemo(
    () =>
      toasts.sort((a, b) =>
        a.isSticky === b.isSticky ? 0 : a.isSticky ? -1 : 1,
      ),
    [toasts],
  );

  return (
    <ToastContext.Provider value={{ addToast, addStickyToast }}>
      <motion.div className="fixed top-4 w-0 flex left-1/2 items-center flex-col gap-1 z-[53] pointer-events-auto">
        <AnimatePresence>
          {sortedToasts.map(({ props, id }) => (
            <ToastComponent key={id} {...props} />
          ))}
        </AnimatePresence>
      </motion.div>
      {children}
    </ToastContext.Provider>
  );
});

export const useToast = () => useContext(ToastContext);
