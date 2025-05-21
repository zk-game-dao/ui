import { PropsWithChildren, memo } from "react";

import { motion } from "framer-motion";
import classNames from "classnames";

export const ToggleComponent = memo<
  PropsWithChildren<{
    isOn: boolean;
    onChange(isOn: boolean): void;
    className?: string;
  }>
>(({ isOn, onChange, className, children }) => {
  return (
    <button
      onClick={() => onChange(!isOn)}
      className={classNames(
        className,
        "bg-material-main-1 rounded-[12px] w-[66px] h-[42px] p-1 pr-6",
      )}
    >
      <motion.div
        variants={{
          on: { x: "1.25rem" },
          off: { x: 0 },
        }}
        initial={false}
        animate={isOn ? "on" : "off"}
        className="bg-material-main-1 rounded-[8px] w-[36px] h-full flex justify-center items-center shadow-inner-light-regular-default"
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
      >
        {children}
      </motion.div>
    </button>
  );
});
