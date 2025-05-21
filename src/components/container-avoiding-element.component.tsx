import classNames from "classnames";
import { ReactNode, RefObject, memo, useMemo, useRef } from "react";
import { useElementSize } from "../hooks/element-box";

// Todo: combine with window avoiding element
export const ContainerAvoidingElementContainer = memo<{
  children: ReactNode | ReactNode[];
  container: RefObject<HTMLDivElement>;
  className?: string;
}>(({ children, className, container }) => {
  const realElement = useRef<HTMLDivElement>(null);

  const size = useElementSize(realElement);
  const containerSize = useElementSize(container);

  const offset = useMemo(() => {
    if (!size) return undefined;
    const rect = realElement.current?.getBoundingClientRect();
    const containerRect = container.current?.getBoundingClientRect();
    if (!rect || !containerRect) return undefined;
    const left = Math.floor(containerRect.left - rect.left);
    if (left > 0) return { left };
    const right = Math.floor(containerRect.right - rect.right);
    if (right < 0) return { left: right };
  }, [size, containerSize]);

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
