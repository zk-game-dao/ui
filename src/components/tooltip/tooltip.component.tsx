import classNames from 'classnames';
import { memo, ReactNode, useState } from 'react';

import Interactable from '../interactable.component';
import { Modal } from '../modal/modal';

export const TooltipComponent = memo<{
  className?: string;
  overlayClassName?: string;
  children: ReactNode;
  title?: ReactNode;
}>(({ children, className, overlayClassName, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Interactable
        onClick={() => setIsOpen(true)}
        className={classNames(
          "relative inline-flex justify-center items-center group material rounded-full w-5 h-5",
          className,
        )}
      >
        <p className="pointer-events-none type-tiny">?</p>
      </Interactable>

      <Modal title={title} open={isOpen} onClose={() => setIsOpen(false)} contentClassName={overlayClassName}>
        {children}
      </Modal>
    </>
  );
});
