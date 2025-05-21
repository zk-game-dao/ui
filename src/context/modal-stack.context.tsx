import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

const ModalContext = createContext<{
  register(id: string): void;
  unRegister(id: string): void;
  getStackIndex(id: string): number;
}>({
  register: () => {},
  unRegister: () => {},
  getStackIndex: () => -1,
});

export const ProvideModalStack = memo<{ children: React.ReactNode }>(
  ({ children }) => {
    const [stack, setStack] = useState<string[]>([]);

    const register = useCallback(
      (id: string) => setStack((v) => [...v, id]),
      [],
    );
    const unRegister = useCallback(
      (id: string) => setStack((v) => v.filter((i) => i !== id)),
      [],
    );
    const getStackIndex = useCallback(
      (id: string) => stack.length - stack.indexOf(id) - 1,
      [stack],
    );

    return (
      <ModalContext.Provider value={{ register, unRegister, getStackIndex }}>
        {children}
      </ModalContext.Provider>
    );
  },
);

export const useCurrentModalStackIndex = (isOpen: boolean) => {
  const { register, unRegister, getStackIndex } = useContext(ModalContext);

  const id = useId();

  useEffect(() => {
    if (isOpen) register(id);
    else unRegister(id);
    return () => unRegister(id);
  }, [id, isOpen]);

  useEffect(() => {
    return () => unRegister(id);
  }, []);

  return useMemo(() => getStackIndex(id), [id, getStackIndex]);
};
