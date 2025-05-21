import classNames from 'classnames';
import { memo, ReactNode, useMemo } from 'react';

import { Interactable } from '../interactable.component';
import { LoadingSpinnerComponent } from '../loading-animation/loading-spinner.component';
import { useConfig } from 'context';

type Color = "green" | "orange" | "black" | "purple" | "red" | "grey" | 'blue';

export type ButtonProps = {
  onClick?(): void;
  href?: string;
  children?: ReactNode;
  variant?: "filled" | "outline" | "naked" | "material";
  /** @deprecated use purpose instead; green -> primary, purple -> secondary, red -> error */
  color?: Color;
  purpose?: "primary" | "secondary" | "error";
  className?: string;
  isOutLink?: boolean;
  isLoading?: boolean;
};

export const ButtonComponent = memo<ButtonProps>(
  ({
    onClick,
    href,
    isOutLink = false,
    isLoading = false,
    className,
    children,
    color: _color,
    purpose,
    variant = "filled",
  }) => {

    const { theme } = useConfig();

    const color: Color = useMemo(() => {
      const primary = theme === "purepoker" ? "orange" : "green";
      switch (purpose) {
        case "primary":
          return primary;
        case "secondary":
          return "purple";
        case "error":
          return "red";
        default:
          if (_color) return _color;
          return primary;
      }
    }, [_color, purpose, theme]);

    return (
      <Interactable
        onClick={onClick}
        href={href}
        isOutLink={isOutLink}
        className={classNames(
          "rounded-[10px] leading-none group flex flex-row justify-center items-center type-button-1 cursor-pointer",
          className,
          {
            "px-5 h-[52px] border-2": variant !== "material",
            "h-11 w-11 material": variant === "material",
            "text-white": variant === "filled",

            "border-transparent": variant === "naked",
            "transition-all duration-75 origin-center active:scale-95 active:shadow-none":
              variant !== "naked",

            "border-green-400": variant !== "naked" && color === "green",
            "border-red-400": variant !== "naked" && color === "red",
            "border-blue-500": variant !== "naked" && color === "blue",
            "border-neutral-100": variant !== "naked" && color === "grey",
            "border-black": variant !== "naked" && color === "black",

            "bg-black": variant === "filled" && color === "black",

            relative: !className?.includes("absolute"),
          },
          theme === "purepoker" && [
            'bg-linear-70 from-5% via-10% to-90% shadow-inner',
            {
              "from-green-500 via-green-400 to-green-600": variant === "filled" && color === "green",
              "from-primary-500 via-primary-400 to-primary-500": variant === "filled" && color === "orange",

              "border-primary-400": variant !== "naked" && color === "orange",

              "from-red-500 via-red-400 to-red-500": variant === "filled" && color === "red",
              "from-blue-600 via-blue-500 to-blue-600": variant === "filled" && color === "blue",
              "from-fuchsia-500 via-fuchsia-400 to-fuchsia-500": variant === "filled" && color === "purple",
              "border-fuchsia-400": variant !== "naked" && color === "purple",
              "from-neutral-300 to-neutral-200": variant === "filled" && color === "grey",
            }
          ],
          theme === "zkpoker" && {

            "border-orange-400": variant !== "naked" && color === "orange",
            "border-purple-400": variant !== "naked" && color === "purple",

            "bg-green-500": variant === "filled" && color === "green",
            "bg-orange-500": variant === "filled" && color === "orange",
            "bg-red-500": variant === "filled" && color === "red",
            "bg-blue-600": variant === "filled" && color === "blue",
            "bg-purple-500": variant === "filled" && color === "purple",
            "bg-neutral-200": variant === "filled" && color === "grey",

          }
        )}
        disabled={isLoading}
      >
        {color !== 'black' && (
          <div className='absolute pointer-events-none z-[0] inset-0 overflow-hidden rounded-[8px]'>
            <div
              className={classNames(
                'absolute pointer-events-none origin-right group-active:origin-left z-[0] left-0 w-full top-1/2 blur-2xl -translate-y-1/2 aspect-square scale-x-0 transition-transform group-active:scale-x-125 duration-[150ms] group-active:duration-[750ms] ease-out',
                {
                  "bg-green-400": variant === "filled" && color === "green",
                  "bg-orange-400": variant === "filled" && color === "orange" && theme === "zkpoker",
                  "bg-primary-400": variant === "filled" && color === "orange" && theme === "purepoker",
                  "bg-red-400": variant === "filled" && color === "red",
                  "bg-purple-400": variant === "filled" && color === "purple",
                  "bg-neutral-100": variant === "filled" && color === "grey",
                },
              )}
            />
          </div>
        )}
        {isLoading && <LoadingSpinnerComponent className="absolute inset-0" />}
        <div
          className={classNames(
            "transition-opacity duration-75 relative z-[1] flex flex-row flex-nowrap whitespace-nowrap justify-center items-center gap-1",
            {
              "text-green-500": variant !== "filled" && color === "green",
              "text-orange-500": variant !== "filled" && color === "orange" && theme === "zkpoker",
              "text-primary-500": variant !== "filled" && color === "orange" && theme === "purepoker",
              "text-red-500": variant !== "filled" && color === "red",
              "text-purple-500": variant !== "filled" && color === "purple",
              "text-blue-500": variant !== "filled" && color === "blue",
              "text-neutral-200": variant !== "filled" && color === "grey",
              "text-black": variant !== "filled" && color === "black",
              "opacity-0": isLoading,
            },
          )}
        >
          {children}
        </div>
      </Interactable>
    )
  },
);

export default ButtonComponent;
