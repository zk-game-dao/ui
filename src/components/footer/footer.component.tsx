import classNames from 'classnames';
import { useConfig } from 'context/config.context';
import { memo, useMemo } from 'react';

import { useLayoutConfig } from '../../components/layout/layout.component';
import Interactable, { InteractableProps } from '../interactable.component';

export type FooterLink = InteractableProps & { label: string; };

export const FooterComponent = memo<{ fullWidth?: boolean; }>(({ fullWidth }) => {
  const { footerLinks } = useLayoutConfig();
  const { theme } = useConfig();

  return (
    <footer className="bg-primary-950 h-[52px] w-full flex flex-col justify-center items-center sticky bottom-0 backdrop-blur-[40px] z-[40]">
      <div
        className={classNames(
          "container mx-auto gap-8 flex-row items-center flex w-full type-button-3 text-neutral-200/70",
          {
            "max-w-none": fullWidth,
          },
        )}
      >
        <p>© {theme === 'zkpoker' ? 'ZKPoker' : 'PurePoker'} 2025</p>
        <div className="flex flex-row gap-4">
          <Interactable
            href={`https://x.com/${theme === 'zkpoker' ? 'zkpokerapp?t=L5smCG0u8sNX9h0vCjgDiQ&s=09' : 'purepokerapp'}`}
            isOutLink
          >
            <img src="/icons/twitter-gray.svg" />
          </Interactable>
        </div>
        <div className="hidden lg:flex gap-8 flex-1 flex-row justify-end items-center">
          {footerLinks?.map((link) => (
            <Interactable
              key={link.label.toString()}
              {...link}
            >
              {link.label}
            </Interactable>
          ))}
        </div>
      </div>
    </footer>
  );
});