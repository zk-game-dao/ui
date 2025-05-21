import classNames from 'classnames';
import { memo, ReactNode, useMemo, useRef } from 'react';

import { ProvideTheme } from '../../context/theme.context';
import { useElementSize } from '../../hooks/element-box';
import { Interactable } from '../interactable.component';
import { LoadingAnimationComponent } from '../loading-animation/loading-animation.component';

export type WeirdKnobProps = {
  variant?: "red" | "gray" | "black" | "orange" | "transparent" | 'green';
  children: ReactNode;
  hoverLabel?: ReactNode;

  straightRightMobile?: boolean;
  straightLeftMobile?: boolean;
  hideOnMobile?: boolean;

  isPending?: boolean;
  mutate?(): void;
  href?: string;
};

export const WeirdKnobComponent = memo<WeirdKnobProps>(
  ({ variant = "transparent", hoverLabel, children, isPending, mutate, href, straightRightMobile, straightLeftMobile, hideOnMobile }) => {
    const childRef = useRef<HTMLDivElement>(null);
    const hoverLabelRef = useRef<HTMLDivElement>(null);

    const childSize = useElementSize(childRef);
    const hoverLabelSize = useElementSize(hoverLabelRef);

    const width = useMemo(() => {
      if (!childSize.width || !hoverLabelSize.width) return "auto";
      return Math.max(childSize.width, hoverLabelSize.width);
    }, [childSize.width, hoverLabelSize.width]);

    const isDark = useMemo(() => {
      switch (variant) {
        case "gray":
          return false;
        default:
          return true;
      }
    }, [variant]);

    return (
      <ProvideTheme isDark={isDark}>
        <Interactable
          onClick={mutate}
          href={href}
          className={classNames(
            "flex type-button-2 px-5 py-3 lg:px-5 lg:py-4 justify-center items-center group whitespace-nowrap",
            "material leading-none rounded-[8px] lg:rounded-[12px] active:scale-95 relative",
            {
              "bg-red-500 text-white": variant === "red",
              "bg-neutral-200 text-black": variant === "gray",
              "bg-neutral-400 text-white": variant === "black",
              "bg-orange-500 text-white": variant === "orange",
              "bg-green-500 text-white": variant === "green",
              "bg-material text-white": variant === "transparent",
            },
            {
              "hidden lg:flex": hideOnMobile,
              "rounded-r-none lg:rounded-r-[12px]": straightRightMobile,
              "rounded-l-none lg:rounded-r-[12px]": straightLeftMobile,
            }
          )}
          disabled={isPending}
        >
          <div style={{ width }} className="flex justify-center items-center">
            {isPending && (
              <div className="absolute inset-0 flex justify-center items-center">
                <LoadingAnimationComponent />
              </div>
            )}
            <div
              ref={childRef}
              className={classNames(
                "transition-opacity leading-none flex flex-row justify-center items-center",
                {
                  "opacity-0": isPending,
                  "group-hover:opacity-0": hoverLabel,
                },
              )}
            >
              {children}
            </div>
            {hoverLabel && (
              <div
                ref={hoverLabelRef}
                className="transition-opacity hidden lg:flex pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 rounded-[25px] z-[-1]"
              >
                {hoverLabel}
              </div>
            )}
          </div>
        </Interactable>
      </ProvideTheme>
    );
  },
);
