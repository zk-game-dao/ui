import classNames from "classnames";
import { memo, PropsWithChildren, ReactNode, useMemo } from "react";

import { Interactable } from "../interactable.component";
import { ListItem, useIsInList } from "../list/list.component";

import XMark from '../../../assets/svgs/xmark.svg';

type Props = {
  label?: ReactNode;
  className?: string;
  showClear?: boolean;
  onClear?(): void;
  isRight?: boolean;
  isFixedHeight?: boolean;
  rightPadding?: boolean;
  quickActions?: { label: string, action(): void; }[];
};

export const InputWrapperComponent = memo<PropsWithChildren<Props>>(
  ({
    children,
    label,
    className,
    showClear,
    onClear,
    isRight,
    isFixedHeight = true,
    rightPadding = true,
    quickActions: _quickActions,
  }) => {
    const isInList = useIsInList();

    const clearButton = useMemo(() => {
      if (!showClear || !onClear) return null;
      return (
        <Interactable
          onClick={onClear}
          className={classNames(
            "absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full w-6 h-6 bg-material-main-1 cursor-pointer",
            isInList ? "right-0" : "right-3",
          )}
        >
          <img
            src={XMark}
            className="w-[12px] h-[12px]"
            alt="Clear"
          />
        </Interactable>
      );
    }, [isInList, showClear, onClear]);

    const quickActions = useMemo(() => {
      if (!_quickActions) return null;
      return (
        <div className="flex flex-row gap-1 mr-2">
          {_quickActions.map((action, index) => (
            <Interactable
              key={index}
              className="bg-material-main-1 flex flex-row whitespace-nowrap rounded-[8px] px-2 py-1 type-tiny"
              onClick={action.action}
            >
              {action.label}
            </Interactable>
          ))}
        </div>
      )
    }, [_quickActions]);

    if (isInList) {
      return (
        <ListItem
          rightLabel={
            isRight ? (
              <>
                {children}
                {!isRight && clearButton}
              </>
            ) : undefined
          }
        >
          {!isRight ? (
            <div className="relative w-full truncate">
              {quickActions}
              {children}
              {clearButton}
            </div>
          ) : (
            <div className="whitespace-nowrap truncate flex-shrink flex-row flex flex-wrap justify-start gap-4 items-center">
              {label}
              {quickActions}
            </div>
          )}
        </ListItem>
      );
    }

    return (
      <div
        className={classNames(
          "flex flex-col justify-start items-start gap-2",
          className,
        )}
      >
        {label && (
          <div className="type-callout text-material-medium-2">{label}</div>
        )}
        <div
          className={classNames(
            "bg-material-main-1 pl-4 rounded-[12px] w-full relative flex flex-row justify-start items-center min-h-[42px] transition-all duration-75",
            { "h-[42px]": isFixedHeight, "pr-4": rightPadding && !clearButton, 'pr-12': clearButton },
          )}
        >
          {quickActions}
          {children}
          {clearButton}
        </div>
      </div>
    );
  },
);
