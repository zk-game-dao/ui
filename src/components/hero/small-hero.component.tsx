import { memo } from "react";
import { PillComponent } from "../pill/pill.component";
import classNames from "classnames";
import { Image, ImageProps } from "../image/image.component";

export const SmallHeroComponent = memo<{
  onBack?(): void;
  title: string;
  subtitle?: string;
  icon?: ImageProps;
  className?: string;
}>(({ onBack, title, subtitle, icon, className }) => (
  <div
    className={classNames(
      "flex flex-col gap-4 m-auto justify-center text-center items-center",
      className,
    )}
  >
    {icon && <Image {...icon} />}
    <p className="text-neutral-200/70 type-top">{title}</p>
    {subtitle && <p className="text-neutral-200/70 ">{subtitle}</p>}
    {onBack && (
      <PillComponent size="large" onClick={onBack}>
        Go back
      </PillComponent>
    )}
  </div>
));
