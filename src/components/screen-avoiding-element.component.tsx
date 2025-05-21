import classNames from "classnames";
import { ReactNode, RefObject, memo, useMemo, useRef } from "react";
import { useElementSize } from "../hooks/element-box";
import { useScreenSize } from "../hooks/screen-size";

/** Only works in screen and overflow hidden containers */
export const ScreenAvoidingElement = memo<{
  children: ReactNode | ReactNode[];
  container?: RefObject<HTMLDivElement>;
  className?: string;
}>(({ children, className }) => {
  const realElement = useRef<HTMLDivElement>(null);

  const size = useElementSize(realElement);
  const screenSize = useScreenSize();

  const safeArea = useMemo(() => {
    const e = getComputedStyle(document.documentElement);
    return {
      // --safe-area-inset-top
      // --safe-area-inset-right
      // --safe-area-inset-bottom
      // --safe-area-inset-left

      top: parseInt(e.getPropertyValue("--safe-area-inset-top")),
      right: parseInt(e.getPropertyValue("--safe-area-inset-right")),
      bottom: parseInt(e.getPropertyValue("--safe-area-inset-bottom")),
      left: parseInt(e.getPropertyValue("--safe-area-inset-left")),
    };
  }, []);

  const maxTop = useMemo(() => {
    if (screenSize.width < 1024) return Math.max(safeArea.top, 16) + 48;
    return Math.max(safeArea.top, 16);
  }, [screenSize, safeArea]);

  const offset = useMemo(() => {
    if (!size) return undefined;
    const rect = realElement.current?.getBoundingClientRect();
    if (!rect) return undefined;
    const top = Math.floor(rect.top - 16);
    // if (screenSize.width < 1024) top -= 48;
    if (top < maxTop) return { top: -top };
    const left = Math.floor(rect.left - 16);
    if (left < safeArea.left) return { left: -left };
    const right = Math.floor(rect.right + 16);
    if (right > window.innerWidth - safeArea.right)
      return { left: window.innerWidth - rect.right - 16 };
    return undefined;
  }, [size, screenSize, safeArea]);

  return (
    <div className="relative">
      <div
        className={classNames(className, {
          "pointer-events-none invisible": offset,
        })}
        ref={realElement}
      >
        {children}
      </div>
      {offset && (
        <div
          className={classNames(className, "!absolute w-full top-0 left-0")}
          style={{
            ...offset,
            flex: "none",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
});
