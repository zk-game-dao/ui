import classNames from "classnames";
import { motion } from "framer-motion";
import { memo } from "react";

import { Root } from "@radix-ui/react-switch";

export type SwitchComponentProps = {
  checked?: boolean;
  onChange?(checked: boolean): void;
  disabled?: boolean;
};

export const SwitchComponent = memo<SwitchComponentProps>(
  ({ onChange, disabled = false, checked = false }) => (
    <Root
      className="relative w-[52px] h-[30px] inline-flex items-center m-0 p-[2px]"
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
    >
      <div
        className={classNames(
          "absolute rounded-full w-full h-full left-0 top-0 transition-colors pointer-events-none z-[0] duration-300 shadow-switch-box",
          checked ? "bg-green-500" : "bg-black/[0.12]",
        )}
      />
      <motion.div
        initial={false}
        animate={{ x: checked ? 22 : 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
        className={classNames(
          "h-full z-[1] aspect-square rounded-full bg-neutral-200 shadow-switch-box-knob ",
          { "opacity-50": disabled },
        )}
      />
    </Root>
  ),
);
