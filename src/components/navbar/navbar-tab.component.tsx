import classNames from 'classnames';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import { Interactable } from '../interactable.component';

export type SeperatorTab = { type: "seperator" };
export type LinkTab = {
  type: "link";
  label: string;
  href?: string;
  onClick?: () => void;
  comingSoon?: boolean;
};

export type Tab = (SeperatorTab | LinkTab) & { mobileOnly?: boolean };

export const NavbarTabComponent = memo<Tab>((tab) => {
  const { pathname } = useLocation();

  if (tab.mobileOnly) return null;

  switch (tab.type) {
    case "link":
      return (
        <Interactable
          className={classNames("hidden lg:flex type-button-2 justify-center items-center", {
            "text-material-medium-2": pathname === tab.href,
            "text-white": pathname !== tab.href,
          })}
          {...tab}
        >
          {tab.label}
          {tab.comingSoon && (
            <span className="text-material-medium-2 rounded-full overflow-hidden material px-2 py-1 type-tiny ml-1">
              Soon
            </span>
          )}
        </Interactable>
      );
    case "seperator":
      return (
        <div className="h-[24px] w-[1px] bg-material-main-2 hidden lg:flex" />
      );
  }
});
