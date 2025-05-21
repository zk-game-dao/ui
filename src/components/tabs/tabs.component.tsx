import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Key, ReactNode, useMemo } from 'react';

import { Interactable } from '../interactable.component';
import { useIsInsideModal } from '../modal/modal';

export type TabsComponentProps<Value extends Key> = {
  tabs: { value: Value; label: ReactNode; disabled?: boolean }[];
  value: Value;
  className?: string;
  onChange(active: Value): void;
  variant?: "tabs" | "buttons";
};

export function TabsComponent<Value extends Key>({
  tabs,
  value,
  onChange,
  className,
  variant = "tabs",
}: TabsComponentProps<Value>) {
  // const activeTabIndex = useMemo(() => tabs.findIndex(tab => tab.value === value), [tabs, value]);
  const style = useMemo(() => {
    if (variant !== "tabs") return;
    const activeTabIndex = tabs.findIndex((tab) => tab.value === value);
    if (activeTabIndex === -1) return;
    const width = 100 / tabs.length;
    return {
      left: `${(activeTabIndex * width).toFixed(2)}%`,
      right: `${((tabs.length - activeTabIndex - 1) * width).toFixed(2)}%`,
    };
  }, [tabs, value, variant]);

  const isInModal = useIsInsideModal();

  return (
    <div
      className={classNames(
        "flex flex-row relative",
        {
          "shadow-switch-box bg-black/[0.12] p-1 rounded-full": variant === "tabs",
          [classNames({
            '-mx-4 w-[calc(100%+16px*2)] px-4 lg:-mx-8 lg:w-[calc(100%+32px*2)] lg:px-8': isInModal
          }, "gap-0.5 overflow-auto")]: variant === "buttons",
        },
        className,
      )}
    >
      {variant === "tabs" && (
        <div className="absolute inset-1">
          <AnimatePresence>
            {style && (
              <motion.div
                variants={{
                  shown: { opacity: 1, ...style },
                  hidden: { opacity: 0, ...style },
                }}
                animate="shown"
                exit="hidden"
                initial="hidden"
                transition={{ duration: 0.3 }}
                className="rounded-full material absolute h-full top-0 bottom-0 z-0"
              />
            )}
          </AnimatePresence>
        </div>
      )}
      {tabs.map(({ value: tabValue, label, disabled }) => (
        <Interactable
          key={tabValue}
          className={classNames(
            "flex justify-center items-center px-4 relative z-1",
            {
              "opacity-50": disabled,
              "w-full h-8 type-button-3 rounded-full": variant === 'tabs',
              [
                classNames("type-button-2 material rounded-xl h-[42px] whitespace-nowrap", {
                  "bg-white text-black": value === tabValue,
                  "text-white": value !== tabValue,
                })
              ]: variant === 'buttons'
            },
          )}
          onClick={disabled ? undefined : () => onChange(tabValue)}
        >
          {label}
        </Interactable>
      ))}
    </div>
  );
}
