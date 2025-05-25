import classNames from 'classnames';
import Interactable, {
  InteractableProps, IsInteractableEnabled
} from 'components/interactable.component';
import { useConfig } from 'context/config.context';
import { memo, ReactNode } from 'react';

import ChevRight from './chevron-right-grey-small.svg';

export type BannerProps = {
  children: ReactNode;
} & Omit<InteractableProps, 'style' | 'className'>;

export const BannerComponent = memo<BannerProps>(({ children, ...interactable }) => {

  const { theme } = useConfig();

  return (
    <Interactable
      className={classNames(
        "flex flex-row group justify-center relative items-center w-full py-3 px-4 flex-shrink-0 z-100 overflow-hidden animation-scroll-gradient-slow bg-size-[200%_100%]",
        'bg-gradient-to-r type-button-3',
        {
          'from-primary-500 via-primary-600 to-primary-500': theme === 'zkpoker',
          'from-primary-500 via-primary-700 to-primary-500': theme === 'purepoker',
        },
      )}
      {...interactable}
    >
      {children}
      {IsInteractableEnabled(interactable) && <img src={ChevRight} className="ml-2 transition-transform group-hover:translate-x-1" />}
    </Interactable>
  )
});
