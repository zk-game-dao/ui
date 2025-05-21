import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { createContext, memo, ReactNode, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';

import { useCurrentModalStackIndex } from '../../context/modal-stack.context';
import { Image } from '../image/image.component';
import { Interactable } from '../interactable.component';

import ChevronRightGreySmall from '../../../assets/svgs/chevron-right-grey-small.svg';
import Xmark from '../../../assets/svgs/xmark.svg';
import { useConfig } from 'context';

export type ModalProps = {
  title?: ReactNode;
  children?: ReactNode;
  open?: boolean;
  onClose?(): void;
  contentClassName?: string;
  /** give it as gap-[n] */
  contentGap?: string;
};

type FooterProps = {
  children: ReactNode;
};

type TitleProps = {
  children: ReactNode;
};

type BackButtonProps = {
  children: ReactNode;
  onClick(): void;
};

type ModalContextType = {
  setFooter(item: FooterProps & { id: string }): void;
  removeFooter(id: string): void;

  setTitle(item: TitleProps & { id: string }): void;
  removeTitle(id: string): void;

  setBackButton(item: BackButtonProps & { id: string }): void;
  removeBackButton(id: string): void;

  modalId?: string;
  title?: string;
  registerChildModal?(id: string): void;
  unregisterChildModal?(id: string): void;
  close(): void;
};

const ModalContext = createContext<ModalContextType>({
  setFooter: () => { },
  removeFooter: () => { },
  close: () => { },
  setTitle: () => { },
  removeTitle: () => { },
  setBackButton: () => { },
  removeBackButton: () => { },
});

export const ModalFooterPortal = memo<{ children: ReactNode }>(
  ({ children }) => {
    const { setFooter, removeFooter, modalId } = useContext(ModalContext);
    const id = useId();

    useEffect(() => {
      if (!modalId) return;
      setFooter({ children, id });
      return () => removeFooter(id);
    }, [children, id]);

    if (!modalId) return <div className="flex flex-row mt-3">{children}</div>;

    return <></>;
  },
);

export const ModalTitlePortal = memo<{ children: ReactNode }>(({ children }) => {
  const { setTitle, removeTitle, modalId } = useContext(ModalContext);
  const id = useId();

  useEffect(() => {
    if (!modalId) return;
    setTitle({ children, id });
    return () => removeTitle(id);
  }, [id, children]);

  if (!modalId) return <div className="flex flex-row mt-3">{children}</div>;

  return <></>;
});

export const ModalBackButtonPortal = memo<{ children: ReactNode; onClick(): void; }>(({ children, onClick }) => {
  const { setBackButton, removeBackButton, modalId } = useContext(ModalContext);
  const id = useId();

  useEffect(() => {
    if (!modalId) return;
    setBackButton({ children, onClick, id });
    return () => removeBackButton(id);
  }, [id, children, onClick]);

  if (!modalId) return <div className="flex flex-row mt-3">{children}</div>;

  return <></>;
});

const InnerModal = memo<
  Pick<ModalProps, "children" | "open" | "contentClassName" | "onClose"> & {
    stackIndex: number;
    hasFooter: boolean;
    onScrollStateUpdate(isScrolled: boolean): void;
  }
>(({ children, open, stackIndex, onClose, hasFooter, contentClassName, onScrollStateUpdate }) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!ref.current || !ref.current) return;

    if (!open) return ref.current.close();

    ref.current.showModal();

    if (!onClose) return;

    const handler = (e: MouseEvent) => {
      if (e.target !== ref.current) return;
      onClose();
    };

    requestAnimationFrame(() => window.addEventListener("click", handler));

    ref.current.addEventListener("close", onClose);

    return () => {
      window.removeEventListener("click", handler);
      // ref.current?.removeEventListener("scroll", scrollHandler);
      ref.current?.removeEventListener("close", onClose);
    };
  }, [open]);

  const _isScrolled = useRef(false);

  const { theme } = useConfig();

  return (
    <dialog
      className={classNames(
        "backdrop:bg-black/30 backdrop:z-0 z-50 open:opacity-100 pt-8 lg:py-10",
        "flex flex-col justify-center mt-auto mx-0 mb-0 lg:items-center",
        "lg:m-auto bg-transparent self-center overflow-visible",
      )}
      style={{
        overscrollBehavior: 'contain'
      }}
      ref={ref}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            variants={{
              closed: { opacity: 0, y: 4, scale: 1 - stackIndex * 0.1 },
              open: { opacity: 1, y: 0, scale: 1 - stackIndex * 0.1 },
            }}
            initial="closed"
            animate="open"
            exit="closed"
            className={classNames(
              "text-white w-screen",
              {
                'border-l border-material-main-2': theme === 'purepoker',
              },
              { 'pb-4': !hasFooter },
              "overflow-hidden bg-material z-50 shadow-modal origin-bottom backdrop-blur-2xl rounded-t-[16px] lg:rounded-b-[16px] w-full lg:w-[31.25rem] flex flex-col",
              contentClassName,
            )}
            onScrollCapture={(e => {
              const target = e.target as HTMLDialogElement;
              const isScrolled = target.scrollTop > 0;
              if (_isScrolled.current !== isScrolled) {
                _isScrolled.current = isScrolled;
                onScrollStateUpdate(isScrolled);
              }
            })}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
});

export const Modal = memo<ModalProps>(
  ({ title: _title, onClose, open = true, contentClassName, children, contentGap }) => {
    const id = useId();

    const [footer, setFooter] = useState<{ children: ReactNode; id: string; }>();
    const [backButton, setBackButton] = useState<{ children: ReactNode; onClick(): void; id: string; }>();
    const [title, setTitle] = useState<{ children: ReactNode; id: string } | undefined>(_title ? { children: _title, id: 'props' } : undefined);

    const stackIndex = useCurrentModalStackIndex(open);

    const [scrolled, setScrolled] = useState(false);

    const value = useMemo(
      (): ModalContextType => ({
        modalId: id,
        setFooter: (item: { children: ReactNode, id: string }) => setFooter(item),
        removeFooter: (id) => setFooter(v => v && v.id !== id ? v : undefined),
        setTitle: (item: { children: ReactNode, id: string }) => setTitle(item),
        removeTitle: (id) => setTitle(v => v && v.id !== id ? v : undefined),
        setBackButton: (item: { children: ReactNode; onClick(): void; id: string }) => setBackButton(item),
        removeBackButton: (id) => setBackButton(v => v && v.id !== id ? v : undefined),
        title: title?.toString(),
        close: () => onClose?.(),
      }),
      [id, title],
    );
    const { theme } = useConfig();

    if (!open) return null;

    return (
      <ModalContext.Provider value={value}>
        <InnerModal
          open={open}
          stackIndex={stackIndex}
          hasFooter={!!footer?.children}
          onClose={onClose}
          contentClassName={contentClassName}
          onScrollStateUpdate={(isScrolled) => {
            if (scrolled !== isScrolled) {
              setScrolled(isScrolled);
            }
          }}
        >
          {(title || onClose || backButton) && (
            <div
              className={classNames(
                "flex justify-between items-center h-13 border-b flex-shrink-0 relative z-[1] transition-all duration-150 !bg-transparent rounded-b-[0px]",
                { "opacity-30": stackIndex, 'px-10': onClose },
                !scrolled ? 'border-transparent' : [
                  'border-material-main-1',
                  theme === 'purepoker' &&
                  'shadow-inner-ultra-light-regular-default bg-linear-to-r from-transparent to-material-main-1'
                ],
              )}
            >
              {backButton && (
                <Interactable
                  key={backButton.id}
                  className="absolute left-3 h-8 flex justify-center items-center outline-hidden group z-[1]"
                  onClick={backButton.onClick}
                >
                  <span className='size-6 text-center type-button-3 flex justify-center items-center transition-transform group-hover:-translate-x-1'>
                    <Image
                      type="svg"
                      alt="Close"
                      src={ChevronRightGreySmall}
                      className="flex pointer-events-none rotate-180"
                    />
                  </span>
                  {backButton.children}
                </Interactable>
              )}
              <AnimatePresence initial={false}>
                {title?.children && (
                  <motion.div
                    key={title.id}
                    initial={{ opacity: 0, x: -8, position: 'relative' }}
                    animate={{ opacity: 1, x: 0, position: 'relative' }}
                    exit={{ opacity: 0, x: -16, position: 'absolute' }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 22,
                    }}
                    className={classNames(
                      "grow text-center flex-row flex justify-center items-center type-medior z-0 w-full",

                    )}
                  >
                    {title.children}
                  </motion.div>
                )}
              </AnimatePresence>
              {onClose && (
                <Interactable
                  className="absolute right-3 h-8 w-8 flex justify-center items-center outline-hidden z-[1]"
                  onClick={onClose}
                >
                  <Image
                    type="svg"
                    alt="Close"
                    src={Xmark}
                    className="flex pointer-events-none"
                  />
                </Interactable>
              )}
            </div>
          )}

          <div
            className={classNames(
              "flex flex-col grow overflow-auto px-4 lg:px-8 pb-4 pt-4 transition-opacity",
              { "opacity-50": stackIndex },
            )}
          >
            <div className={classNames("flex flex-col shrink-0 grow whitespace-normal", contentGap ?? 'gap-8')}>
              {children}
            </div>
          </div>

          {footer?.children && (
            <div
              key={footer.id}
              className={classNames(
                "flex flex-col lg:flex-row justify-start lg:justify-between lg:items-center p-4 transition-opacity w-full",
                { "opacity-50": stackIndex },
              )}
            >
              {footer?.children}
            </div>
          )}
        </InnerModal>
      </ModalContext.Provider>
    );
  }
);

export const ConsumeModal = ModalContext.Consumer;

export const useModal = () => useContext(ModalContext);
export const useIsInsideModal = () => useModal().modalId !== undefined;
