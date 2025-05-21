import classNames from 'classnames';
import { List, ListItem } from 'components/list/list.component';
import { AnimatePresence } from 'framer-motion';
import { memo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useLayoutConfig } from '../../components/layout/layout.component';
import { Image } from '../image/image.component';
import { Interactable } from '../interactable.component';
import { useLayout } from '../layout/layout.component';
import { LinkTab, NavbarTabComponent } from './navbar-tab.component';

import Hamburger from '../../../assets/svgs/hamburger.svg';
import { useConfig } from 'context';

export const NavbarTabsComponent = memo<{ variant?: "tabs" | "droppel" }>(
  ({ variant = "tabs" }) => {
    const { navbarTabs } = useLayoutConfig();
    switch (variant) {
      case "droppel":
        return (
          <>
            <List variant={{ type: "droppel", side: "right" }}>
              {navbarTabs
                .filter((v): v is LinkTab => v.type === "link")
                .map((tab, i) => (
                  <ListItem key={i} onClick={tab.onClick} href={tab.href}>
                    {tab.label}
                  </ListItem>
                ))}
            </List>
          </>
        );
      case "tabs":
        return (
          <>
            {navbarTabs.map((tab, i) => (
              <NavbarTabComponent key={i} {...tab} />
            ))}
          </>
        );
    }
  },
);


export type NavbarComponentProps = {
  hideUser?: boolean;
};

export const NavbarComponent = memo<NavbarComponentProps>(({ hideUser }) => {
  const { container } = useLayout();
  const { pathname } = useLocation();
  const [showDroppel, setShowDroppel] = useState(false);

  const { NavbarUserComponent, isOverlay, navbarRightSide } = useLayoutConfig();
  const { theme } = useConfig();

  useEffect(() => setShowDroppel(false), [pathname]);

  return (
    <>
      <nav className={classNames("flex flex-col w-full z-40 fixed left-0 top-0 px-4 pt-[var(--navbar-space-top)]")}>
        <div
          className={classNames(
            "ease container ease-in-out transition-[max-width] duration-[750ms] relative z-[1] p-0",
            {
              "max-w-none lg:max-w-[3000px]": container === "large",
            },
          )}
        >
          <div
            className={classNames(
              "w-full gap-3 flex items-center flex-row justify-between",
              !isOverlay && [
                "material h-[var(--navbar-inner-height)] pl-3 pr-0 lg:px-2.5",
                {
                  'rounded-[18px] lg:rounded-full': theme === 'zkpoker',
                  "rounded-[18px] shadow-inner border-material-main-2 border-1": theme === 'purepoker',
                },
              ]
            )}
          >
            <Interactable
              href="/"
              className="relative z-[1] flex flex-row gap-2 items-center justify-start pointer-events-auto"
            >
              <Image
                type="png"
                width={46}
                height={46}
                src="/logo.png"
                alt="logo"
                className='size-[32px]'
                sizes={3}
              />
              <span className="type-button-2 text-neutral-200/70">Beta</span>
            </Interactable>

            {!isOverlay ? (
              <NavbarTabsComponent />
            ) : (
              <div className="flex flex-1" />
            )}

            {navbarRightSide}

            <div className='flex flex-row justify-center items-center'>
              {!hideUser && <NavbarUserComponent />}
              <Interactable
                className='pl-2 pr-4 flex lg:hidden'
                onClick={() => setShowDroppel((prev) => !prev)}
              >
                <Image
                  type="svg"
                  src={Hamburger}
                  alt="hamburger"
                  className="w-[15px] h-[11px] pointer-events-auto"
                />
              </Interactable>
            </div>
          </div>

          {showDroppel && (
            <div className="absolute top-full mt-0.5 right-0">
              <AnimatePresence>
                <NavbarTabsComponent variant="droppel" />
              </AnimatePresence>
            </div>
          )}
        </div>

        {!isOverlay && (
          <>
            {theme === 'zkpoker' && <div className="pb-[1px] bg-gradient-to-r from-transparent via-[rgba(0,0,0,0.12)] to-transparent w-full" />}
            <div className="absolute top-0 inset-x-0 z-[0] h-[calc(var(--navbar-height)/2+0.5rem)] linear-gradient-mask" />
          </>
        )}
      </nav>
      {!isOverlay && <div className="h-[var(--navbar-height)]" />}
    </>
  );
},
);

export default NavbarComponent;
