import { PropsWithChildren, ReactNode, memo } from "react";
import { Interactable, InteractableProps } from "./interactable.component";

export type LabelProps = {
  ctas?: (InteractableProps & { label: ReactNode })[];
  for?: string;
};

export const Label = memo<PropsWithChildren<LabelProps>>(
  ({ children, for: forId, ctas = [] }) => (
    <label
      className="type-button-3 text-material-main-3 flex flex-row items-center"
      htmlFor={forId}
    >
      {children}
      {ctas?.length > 0 && (
        <>
          <div className="flex flex-1" />
          {ctas.map(({ label, ...interactableProps }, i) => (
            <Interactable
              key={i}
              {...interactableProps}
              className="type-button-3 bg-blue rounded-full px-2 py-1 text-material-medium-2 material"
            >
              {label}
            </Interactable>
          ))}
        </>
      )}
    </label>
  ),
);
