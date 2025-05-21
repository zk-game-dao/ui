import classNames from "classnames";
import {
  CSSProperties,
  forwardRef,
  memo,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

// import { useAnalytics } from "../context/analytics.context";

import { useRouting } from "../hooks/routing";
import { Link } from "react-router-dom";

export type InteractableProps = {
  href?: string;
  onClick?(): void;
  disabled?: boolean;
  isSubmit?: boolean;
  isOutLink?: boolean;
  className?: string;
  style?: CSSProperties;
  eventName?: string;
};

export const Interactable = memo(
  forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    PropsWithChildren<InteractableProps>
  >(
    (
      {
        disabled,
        isOutLink = false,
        style,
        href,
        onClick,
        children,
        className,
        isSubmit,
        eventName,
      },
      forwardedRef,
    ) => {
      const cls = useMemo(
        () =>
          classNames(
            {
              "cursor-pointer": onClick && !disabled,
              "pointer-events-none": disabled,
            },
            className,
          ),
        [className, onClick, disabled],
      );

      const refButton = useRef<HTMLButtonElement>(null);
      const refLink = useRef<HTMLAnchorElement>(null);

      useEffect(() => {
        const node = refButton.current || refLink.current;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (
            forwardedRef as React.MutableRefObject<
              HTMLButtonElement | HTMLAnchorElement | null
            >
          ).current = node;
        }
      }, [forwardedRef, refButton.current, refLink.current]);

      const isDescendantOfRef = useCallback(
        (element: Node | null) => {
          const target = element;
          const ref = refButton.current ? refButton : refLink;

          const _isDescendantOfRef = (node: Node | null) => {
            while (node && node !== document.body) {
              if (node === ref.current) {
                return true;
              }
              node = node.parentNode;
            }
            return false;
          };

          return _isDescendantOfRef(target);
        },
        [refButton, refLink],
      );

      const { getHref, push } = useRouting();
      // const { track } = useAnalytics();

      const trackClick = useCallback(
        (
          e: MouseEvent<
            HTMLAnchorElement | HTMLButtonElement,
            globalThis.MouseEvent
          >,
        ) => { },
          // track("button-click", {
          //   content:
          //     eventName || (e.target as HTMLElement).textContent || "unknown",
          // }),
        // [track, eventName],
        [eventName],
      );

      const determinedClick = useCallback(
        (
          e: MouseEvent<
            HTMLAnchorElement | HTMLButtonElement,
            globalThis.MouseEvent
          >,
        ) => {
          trackClick(e);
          if (disabled) return;
          if (isOutLink) return;
          // if (href && e.currentTarget instanceof HTMLAnchorElement) {
          //   e.preventDefault();
          //   e.stopPropagation();
          //   e.nativeEvent.stopImmediatePropagation();
          //   push(href);
          //   return false;
          // }
          if (!onClick || !isDescendantOfRef(e.target as Node)) return;
          onClick();
        },
        [trackClick, onClick, isDescendantOfRef],
      );

      if (href) {
        if (isOutLink)
          return (
            <a
              href={isOutLink ? href : getHref(href)}
              ref={refLink}
              className={cls}
              onClick={determinedClick}
              target={isOutLink ? "_blank" : undefined}
            >
              {children}
            </a>
          );
        return (
          <Link
            to={href}
            ref={refLink}
            className={cls}
            onClick={determinedClick}
            target={isOutLink ? "_blank" : undefined}
          >
            {children}
          </Link>
        )
      }
      if (isSubmit)
        return (
          <button
            className={cls}
            ref={refButton}
            onClick={trackClick}
            type="submit"
            disabled={disabled}
            style={style}
          >
            {children}
          </button>
        );

      if (onClick)
        return (
          <button
            className={cls}
            ref={refButton}
            onClick={determinedClick}
            disabled={disabled}
            style={style}
          >
            {children}
          </button>
        );
      return (
        <div className={cls} style={style}>
          {children}
        </div>
      );
    },
  ),
);

export default Interactable;
