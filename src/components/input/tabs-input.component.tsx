import classNames from "classnames";
import { Key, ReactNode } from "react";

import { TabsComponent, TabsComponentProps } from "../tabs/tabs.component";

export function TabsInputComponent<Value extends Key>({
  label,
  ...tabsProps
}: Omit<TabsComponentProps<Value>, 'variant'> & { label?: ReactNode }) {
  if (!label) return <TabsComponent {...tabsProps} />;

  return (
    <div
      className={classNames(
        "flex flex-col justify-start items-start gap-2",
        tabsProps.className,
      )}
    >
      <div className="type-callout text-material-medium-2">{label}</div>
      <TabsComponent {...tabsProps} className="w-full" variant="buttons" />
    </div>
  );
}
