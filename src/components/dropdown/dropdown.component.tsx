import classNames from 'classnames';
import { motion } from 'framer-motion';
import {
  memo,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useScreenSize } from '../../hooks/screen-size';
import { Image } from '../image/image.component';
import { Interactable } from '../interactable.component';

import ChevronDownWhite from '../../../assets/svgs/chevron-down-white.svg';

export type DropdownComponentProps = {
  value?: string | number;
  placeholder?: string;
  isOpenInitially?: boolean;
  onChange: (value?: string | number) => void;
  options?:
  | string[]
  | number[]
  | { value: string | number; label: string | ReactNode }[];
  className?: string;
};

type Box = {
  top?: number;
  left?: number;
  height?: number;
};

export const DropdownComponent = memo<DropdownComponentProps>(
  ({
    className,
    isOpenInitially = false,
    value: activeValue,
    placeholder,
    onChange,
    options,
  }) => {
    const normalizedOptions = useMemo(() => {
      if (!options) return [];

      return options.map((option) => {
        if (typeof option === 'object') {
          return {
            ...option,
            label: option.label, // in case it’s a ReactNode
            value: String(option.value),
            realValue: option.value,
          };
        }
        return {
          value: String(option),
          realValue: option,
          label: option ?? '',
        };
      });
    }, [options]);

    const selectedOption = useMemo(() => {
      const v = activeValue ?? placeholder;
      return normalizedOptions.find(
        (opt) => opt.realValue === v || opt.value === v
      );
    }, [activeValue, placeholder, normalizedOptions]);

    const [open, setOpen] = useState(isOpenInitially);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const innerDialogRef = useRef<HTMLDivElement>(null);
    const interactableRef = useRef<HTMLButtonElement>(null);

    const size = useScreenSize();
    const [position, setPosition] = useState<Box>();

    // Calculate position/size of the dropdown menu
    useEffect(() => {
      if (!open) {
        setPosition(undefined);
        return;
      }

      let canceled = false;

      const positionDropdown = () => {
        if (
          canceled ||
          !interactableRef.current ||
          !innerDialogRef.current
        ) {
          return;
        }

        const triggerRect =
          interactableRef.current.getBoundingClientRect();
        const dropdownRect =
          innerDialogRef.current.getBoundingClientRect();

        // Constrain to viewport with 16px "padding"
        const left = Math.min(
          size.width - dropdownRect.width - 16,
          Math.max(16, triggerRect.left)
        );
        const top = Math.min(
          size.height - dropdownRect.height - 16,
          Math.max(16, triggerRect.top)
        );

        const newBox: Box = { top, left };

        // If dropdown doesn’t fit vertically, limit height
        if (newBox.top !== undefined && newBox.top < 16) {
          newBox.top = 16;
          newBox.height = size.height - 32;
        }

        setPosition(newBox);
      };

      requestAnimationFrame(positionDropdown);

      return () => {
        canceled = true;
      };
    }, [open, size]);

    // Open/close the <dialog> element
    useEffect(() => {
      const dialogEl = dialogRef.current;
      if (!dialogEl) return;

      if (open) {
        dialogEl.showModal();

        // Close if user clicks the backdrop
        const handleBackdropClick = (e: MouseEvent) => {
          if (e.target === dialogEl) {
            setOpen(false);
          }
        };

        // Close if <dialog> fires a close event
        const handleClose = () => setOpen(false);

        window.addEventListener('click', handleBackdropClick);
        dialogEl.addEventListener('close', handleClose);

        return () => {
          window.removeEventListener('click', handleBackdropClick);
          dialogEl.removeEventListener('close', handleClose);
        };
      } else {
        // Safely close
        dialogEl.close();
      }
    }, [open]);

    return (
      <>
        {/* The dropdown trigger */}
        <Interactable
          ref={interactableRef}
          onClick={() => setOpen((prev) => !prev)}
          className={classNames(
            'type-button-2 flex flex-row items-center whitespace-nowrap',
            className
          )}
        >
          {selectedOption?.label ?? placeholder}
          <Image
            src={ChevronDownWhite}
            className="ml-2"
            type="svg"
            alt="chevron down"
          />
        </Interactable>

        {/* The dropdown menu using <dialog> */}
        <dialog
          ref={dialogRef}
          className={classNames(
            'overflow-visible bg-transparent text-white type-button-2 text-left transition-opacity duration-75 z-10',
            {
              'opacity-0': !position, // hides until positioned
            }
          )}
          style={{
            position: 'absolute',
            top: position?.top,
            left: position?.left,
            height: position?.height,
          }}
        >
          {/* Framer Motion container */}
          <motion.div
            variants={{
              closed: { opacity: 0, y: -4, scale: 0.9 },
              open: { opacity: 1, y: 0, scale: 1 },
            }}
            initial={false}
            animate={open ? 'open' : 'closed'}
            ref={innerDialogRef}
            className="flex flex-col whitespace-nowrap bg-material rounded-[12px] p-1 gap-1 -mt-1 overflow-auto"
            style={{ maxHeight: position?.height ?? 'auto' }}
          >
            {normalizedOptions.map(({ value, realValue, label }) => (
              <Interactable
                key={value}
                onClick={() => {
                  setOpen(false);
                  onChange(realValue);
                }}
                className={classNames(
                  'w-full py-2 px-4 text-left rounded-[8px] cursor-pointer hover:bg-material',
                  {
                    'bg-green-500': activeValue === realValue,
                  }
                )}
              >
                {label}
              </Interactable>
            ))}
          </motion.div>
        </dialog>
      </>
    );
  }
);
