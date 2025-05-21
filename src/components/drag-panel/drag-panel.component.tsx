import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useElementSize } from '../../hooks/element-box';
import { useScreenSize } from '../../hooks/screen-size';

export const DragPanelComponent = memo<
  PropsWithChildren<{
    className?: string;
    minSize?: { width: number; height: number };
    shown?: boolean;
  }>
>(
  ({
    shown = false,
    className,
    children,
    minSize = { width: 343, height: 200 },
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const refResize = useRef<HTMLDivElement>(null);
    const dockRef = useRef<HTMLDivElement>(null);

    const [draggingOffset, setDraggingOffset] = useState<{
      x: number;
      y: number;
      type: "dragging" | "resizing";
    }>();
    const [size, setSize] = useState<{ width: number; height: number }>(
      minSize,
    );
    const [position, setPosition] = useState<{ x: number; y: number }>({
      x: 0,
      y: 0,
    });
    const [isDocked, setIsDocked] = useState(true);

    const renderedBox = useMemo((): Pick<
      DOMRect,
      "height" | "width" | "left" | "top"
    > => {
      if (dockRef.current && isDocked) {
        const dockRect = dockRef.current.getBoundingClientRect();
        return {
          left: dockRect.left,
          top: dockRect.top,
          width: dockRect.width,
          height: dockRect.height,
        };
      }
      return {
        height: Math.max(minSize.height, size.height),
        width: Math.max(minSize.width, size.width),
        left: position.x,
        top: position.y,
      };
    }, [size, position, isDocked, dockRef.current]);

    const realElementSize = useElementSize(ref);
    const windowSize = useScreenSize();
    const [dockHeight, setDockHeight] = useState(
      windowSize.height - 24 * 4 * 2,
    );

    useEffect(() => {
      if (!isDocked || !dockRef.current) return;
      setPosition({
        x: dockRef.current?.getBoundingClientRect().left ?? 0,
        y: dockRef.current?.getBoundingClientRect().top ?? 0,
      });
    }, [windowSize]);

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top } = ref.current.getBoundingClientRect();
        const offsetX = clientX - left;
        const offsetY = clientY - top;

        setDraggingOffset({
          x: offsetX,
          y: offsetY,
          type: e.target === refResize.current ? "resizing" : "dragging",
        });
      },
      [ref.current],
    );

    useEffect(() => {
      if (!draggingOffset) return;
      const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current || !realElementSize.width || !realElementSize.height)
          return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (draggingOffset.type === "resizing") {
          setDockHeight(e.clientY - position.y);
          if (!isDocked) {
            setSize({
              width: Math.max(minSize.width, e.clientX - position.x),
              height: Math.max(minSize.height, e.clientY - position.y),
            });
          }
          return false;
        }

        const newPosition = {
          x: Math.min(
            windowSize.width - realElementSize.width,
            Math.max(0, e.clientX - draggingOffset.x),
          ),
          y: Math.min(
            windowSize.height - realElementSize.height,
            Math.max(0, e.clientY - draggingOffset.y),
          ),
        };

        if (dockRef.current) {
          const dockRect = dockRef.current.getBoundingClientRect();

          // if the mouse is anywhere within 16 px of the draggin offset of the dock, dock it
          if (
            e.clientX > dockRect.left &&
            e.clientX < dockRect.right &&
            e.clientY > dockRect.top &&
            e.clientY < dockRect.bottom
          ) {
            setIsDocked(true);
            setPosition({ x: dockRect.left, y: dockRect.top });
            return false;
          }
        }

        setIsDocked(false);
        setPosition(newPosition);

        return false;
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        setDraggingOffset(undefined);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      document.body.style.cursor =
        draggingOffset.type === "resizing"
          ? `${!isDocked ? "se" : "ns"}-resize`
          : "grabbing";
      document.body.style.userSelect = "none";

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }, [
      draggingOffset,
      windowSize,
      realElementSize,
      isDocked,
      dockRef.current,
      minSize,
      position,
    ]);

    return createPortal(
      <AnimatePresence>
        <div className="absolute h-screen w-screen top-0 left-0 overflow-hidden pointer-events-none">
          <motion.div
            className={classNames("absolute z-30 group pointer-events-auto", {
              "cursor-grab": !draggingOffset,
              "pointer-events-none": draggingOffset,
            })}
            ref={ref}
            onMouseDown={handleMouseDown}
            variants={
              isDocked
                ? {
                    hidden: { x: "100%", left: "100%" },
                    shown: (v) => ({ x: 0, left: v.left }),
                  }
                : {
                    hidden: { x: 0, opacity: 0, y: 16 },
                    shown: { x: 0, opacity: 1, y: 0 },
                  }
            }
            initial={false}
            custom={renderedBox}
            animate={shown ? "shown" : "hidden"}
            style={{
              width: renderedBox.width,
              height: isDocked
                ? Math.max(
                    Math.min(windowSize.height - 24 * 4 * 2, dockHeight),
                    minSize.height,
                  )
                : renderedBox.height,
              left: renderedBox.left,
              top: renderedBox.top,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 22,
            }}
          >
            <div className="absolute top-0 type-callout flex justify-center items-center left-0 w-full h-12 z-[2] bg-material-main-1 rounded-t-[16px] backdrop-blur-[40px]">
              Chat
            </div>
            <div className={classNames(className, "absolute inset-0 z-[1]")}>
              {children}
            </div>
            <div
              className={classNames(
                "absolute z-[0]",
                isDocked
                  ? [
                      "left-4 right-4 h-1 -bottom-4 cursor-ns-resize rounded-full",
                      draggingOffset?.type === "resizing"
                        ? "bg-material-medium-2"
                        : "bg-material-main-2 hover:bg-material-main-3",
                    ]
                  : [
                      "border-b-[3px] h-8 w-8 -right-2 -bottom-2 rounded-br-[20px] border-r-[3px] cursor-se-resize",
                      draggingOffset?.type === "resizing"
                        ? "border-material-medium-2"
                        : "border-material-main-2 hover:border-material-main-3",
                    ],
              )}
              ref={refResize}
            />
          </motion.div>
          <motion.div
            ref={dockRef}
            className={classNames(
              "absolute bg-material-main-1 rounded-[16px] top-24 right-4 z-[29] pointer-events-none",
              {
                "opacity-0": draggingOffset?.type !== "dragging" || isDocked,
              },
            )}
            style={{
              width: minSize.width,
              height: Math.max(
                Math.min(windowSize.height - 24 * 4 * 2, dockHeight),
                minSize.height,
              ),
            }}
          />
        </div>
      </AnimatePresence>,
      document.body,
    );
  },
);
