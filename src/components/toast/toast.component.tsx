import classNames from "classnames";
import { motion } from "framer-motion";
import { memo, PropsWithChildren, ReactNode } from "react";
import { InteractableProps } from "../interactable.component";
import { PillComponent } from "../pill/pill.component";

export type ToastComponentProps = {
  ctas?: PropsWithChildren<
    Omit<InteractableProps, "style" | "className"> & { isLoading?: boolean }
  >[];
  error?: unknown;
  children?: ReactNode;
};

export const ToastComponent = memo<ToastComponentProps>(
  ({ ctas, children, error }) => (
    <motion.div
      role="dialog"
      className={classNames(
        "text-white rounded-full flex flex-nowrap whitespace-nowrap flex-row items-center shadow-material z-[52] relative",
        !error ? "bg-black" : "bg-red-500",
        ctas && ctas?.length > 0 ? "pl-4 pr-1 py-1" : "px-4 py-2",
      )}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: -16 },
      }}
      style={{ pointerEvents: "all" }}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {children}
      {error ? "" + error : null}
      {ctas && ctas?.length > 0 && (
        <div className="flex flex-1 flex-row justify-end items-center gap-0.5 ml-2">
          {ctas?.map((cta, index) => (
            <PillComponent
              className="bg-neutral-300/30"
              key={index}
              {...cta}
              straightLeft={index > 0 && ctas.length > 1}
              straightRight={index < ctas.length - 1 && ctas.length > 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  ),
);
