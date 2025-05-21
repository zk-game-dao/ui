import classNames from "classnames";
import { domAnimation, LazyMotion, m } from "framer-motion";
import { memo, ReactNode } from "react";

import { LoadingSpinnerComponent } from "./loading-spinner.component";

export const LoadingAnimationComponent = memo<{
  dark?: boolean;
  children?: ReactNode;
  className?: string;
  variant?: "spinner" | "shimmer";
}>(({ children, className, variant = "spinner" }) => (
  <LazyMotion features={domAnimation}>
    <m.div
      variants={{
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto" },
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={classNames(
        "flex flex-row items-center justify-center gap-4",
        className,
      )}
    >
      {variant === "spinner" && <LoadingSpinnerComponent />}
      {children && (
        <div
          className={classNames("type-callou", {
            "text-animation-shimmer": variant === "shimmer",
          })}
        >
          {children}...
        </div>
      )}
    </m.div>
  </LazyMotion>
));
