import { createContext, memo, PropsWithChildren, ReactNode, useContext, useState } from "react";
import { Modal, ModalFooterPortal } from "./modal";
import ButtonComponent from "../button/button.component";

type Props = {
  children: ReactNode;
  title: ReactNode;
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
}

const ConfirmModalComponent = memo<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
} & Props>(({
  isOpen,
  title,
  onClose,
  onConfirm,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  children
}) => (
  <Modal
    open={isOpen}
    onClose={onClose}
    title={title}
  >
    {children}
    <ModalFooterPortal>
      <ButtonComponent variant="naked" onClick={onClose} >
        {cancelLabel}
      </ButtonComponent>
      <ButtonComponent onClick={onConfirm} >
        {confirmLabel}
      </ButtonComponent>
    </ModalFooterPortal>
  </Modal>
))

type ConfirmModalContext = {
  confirm(options: Omit<Props, 'children'>, ...children: ReactNode[]): Promise<void>;
};

const ConfirmModalContext = createContext<ConfirmModalContext>({
  confirm: async () => { },
});

export const ProvideConfirmModal = memo<PropsWithChildren>(({
  children,
}) => {
  const [openModal, setOpenModal] = useState<{ props: Props; onClose(): void; onConfirm(): void; } | undefined>(undefined);

  const confirm = (options: Omit<Props, 'children'>, ...children: ReactNode[]) =>
    new Promise<void>((resolve, reject) => {
      setOpenModal({
        props: {
          ...options,
          children,
          cancelLabel: "Cancel",
          confirmLabel: "Confirm",
        },
        onClose: () => {
          setOpenModal(undefined);
          reject('Manually rejected');
        },
        onConfirm: () => {
          setOpenModal(undefined);
          resolve();
        }
      });
    });

  return (
    <ConfirmModalContext.Provider value={{ confirm }}>
      {children}
      {openModal && (
        <ConfirmModalComponent
          isOpen
          onClose={openModal.onClose}
          onConfirm={openModal.onConfirm}
          {...openModal.props}
        />
      )}
    </ConfirmModalContext.Provider>
  );
});

export const useConfirmModal = () => useContext(ConfirmModalContext).confirm;
