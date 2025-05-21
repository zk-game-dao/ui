import { motion } from "framer-motion";
import { memo, PropsWithChildren, useRef } from "react";

import { useElementSize } from "../../hooks/element-box";
import classNames from "classnames";

export const DynamicSizeComponent = memo<
  PropsWithChildren<{
    className?: string;
    animateWidth?: boolean;
    animateHeight?: boolean;
  }>
>(({ className, children, animateWidth, animateHeight }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(ref);

  return (
    <>
      <div
        className={classNames(
          "absolute opacity-0 left-0 pointer-events-none whitespace-nowrap",
          className,
        )}
        ref={ref}
      >
        {children}
      </div>
      <motion.div
        animate={{
          width: animateWidth ? width : undefined,
          height: animateHeight ? height : undefined,
        }}
        className={classNames("flex", className, {
          "flex-row": className?.indexOf("flex-col") === -1,
        })}
        // animate={{ width: animateWidth ? width : undefined, height: animateHeight ? width : undefined }}
        // style={{ width: animateWidth ? 0 : undefined, height: animateHeight ? 0 : undefined }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        {children}
      </motion.div>
    </>
  );
});
