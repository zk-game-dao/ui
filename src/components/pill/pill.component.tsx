import classNames from "classnames";
import { memo, ReactNode } from "react";

import { Interactable, InteractableProps } from "../interactable.component";
import { LoadingSpinnerComponent } from "../loading-animation/loading-spinner.component";

export type PillProps = {
  children?: ReactNode;
  size?: "small" | "large";
  filled?: boolean;
  className?: string;
  straightRight?: boolean;
  straightLeft?: boolean;
  isLoading?: boolean;
} & Omit<InteractableProps, "style" | "className">;

export const PillComponent = memo<PillProps>(
  ({
    size = "small",
    straightRight = false,
    straightLeft = false,
    filled = false,
    className,
    children,
    isLoading,
    ...interactableProps
  }) => (
    <Interactable
      {...interactableProps}
      className={classNames(
        className,
        filled ? 'bg-white text-black' : 'material hover:bg-material-main-2',
        "active:scale-95 transition-all flex flex-row gap-2 justify-center items-center",
        size === "small"
          ? "type-button-3 px-[14px] h-9"
          : "type-button-2 h-10 px-4",
        straightRight
          ? "rounded-r-[8px]"
          : size === "small"
            ? "rounded-r-[36px]"
            : "rounded-r-[40px]",
        straightLeft
          ? "rounded-l-[8px]"
          : size === "small"
            ? "rounded-l-[36px]"
            : "rounded-l-[40px]",
        {
          "relative text-opacity-0":
            isLoading && !className?.includes("absolute"),
        },
      )}
    >
      {isLoading && <LoadingSpinnerComponent className="absolute inset-0" />}
      <div
        className={classNames(
          "whitespace-nowrap flex flex-row justify-center items-center transition-opacity",
          { "opacity-0": isLoading },
        )}
      >
        {children}
      </div>
    </Interactable>
  ),
);

export default PillComponent;
