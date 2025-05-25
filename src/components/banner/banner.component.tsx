import Interactable, { InteractableProps, IsInteractableEnabled } from "components/interactable.component";
import { memo, PropsWithChildren, ReactNode } from "react";

import ChevRight from "./chevron-right-grey-small.svg";

export type BannerProps = {
  children: ReactNode;
} & Omit<InteractableProps, 'style' | 'className'>;

export const BannerComponent = memo<BannerProps>(({ children, ...interactable }) => {
  return (
    <div className="w-full bg-linear-to-t to-primary-950 to-[4px] from-primary-transparent p-4 z-100 type-caption">
      <Interactable className="flex flex-row justify-center items-center container w-full group cursor-pointer">
        {children}
        {IsInteractableEnabled(interactable) && <img src={ChevRight} className="ml-2 transition-transform group-hover:translate-x-1" />}
      </Interactable>
    </div>
  );
});
