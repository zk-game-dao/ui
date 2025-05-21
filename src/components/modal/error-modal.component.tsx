import {
  PropsWithChildren,
  createContext,
  memo,
  useContext,
  useState,
} from "react";

import { Modal } from "./modal";
import { ErrorComponent } from "../error/error.component";

export const ErrorModalComponent = memo<{
  children?: any;
  title?: string;
  onClose(): void;
}>(({ children, title = "Error", onClose }) => (
  <Modal title={title} onClose={onClose}>
    <ErrorComponent error={children} />
  </Modal>
));

const ErrorModalContext = createContext<{
  showErrorModal(error: any): void;
}>({
  showErrorModal: () => { },
});

export const ProvideErrorModalContext = memo<PropsWithChildren>(
  ({ children }) => {
    const [error, setError] = useState<any>();
    return (
      <ErrorModalContext.Provider value={{ showErrorModal: setError }}>
        {error && (
          <ErrorModalComponent onClose={() => setError(undefined)}>
            {error}
          </ErrorModalComponent>
        )}
        {children}
      </ErrorModalContext.Provider>
    );
  },
);

export const useErrorModal = () => useContext(ErrorModalContext).showErrorModal;
