import { memo, ReactNode } from "react";

import {
  DropdownComponent,
  DropdownComponentProps,
} from "../dropdown/dropdown.component";
import { InputWrapperComponent } from "./input-wrapper.component";
import { useIsInList } from "../list/list.component";
import classNames from "classnames";

type DropdownInputComponentProps = Omit<DropdownComponentProps, "className"> & {
  label?: ReactNode;
};

export const DropdownInputComponent = memo<DropdownInputComponentProps>(
  ({ label, ...dropdownProps }) => {
    const inList = useIsInList();
    return (
      <InputWrapperComponent isRight label={label}>
        <DropdownComponent
          {...dropdownProps}
          className={classNames({ "w-full": !inList })}
        />
      </InputWrapperComponent>
    );
  },
);
