import classNames from "classnames";
import { memo, ReactNode } from "react";

export const TitleTextComponent = memo<{ title?: ReactNode; text?: ReactNode; leftAligned?: boolean; className?: string }>(
  ({ title, text, leftAligned, className }) => (
    <div className={classNames(className, "gap-3 flex flex-col justify-center text-center", { 'text-left items-start': leftAligned, 'text-center items-center': !leftAligned })}>
      {title && <h1 className="type-top">{title}</h1>}
      {text && <p className="type-body text-neutral-200/70">{text}</p>}
    </div>
  ),
);
