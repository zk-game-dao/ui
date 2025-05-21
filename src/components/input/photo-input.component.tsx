import classNames from "classnames";
import { ChangeEvent, memo, ReactNode, useCallback, useId } from "react";

import { InputWrapperComponent } from "./input-wrapper.component";
import { PillComponent } from "../pill/pill.component";

export type PhotoInputProps = {
  label: ReactNode;
  value?: File | null;
  error?: string;
  onChange: (value?: File) => void;
};

export const PhotoInputComponent = memo<PhotoInputProps>(
  ({ value, onChange, label }) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.files?.[0]),
      [onChange],
    );
    const id = useId();

    return (
      <InputWrapperComponent label={label} isFixedHeight={false}>
        <label
          htmlFor={id}
          className={classNames(
            "flex w-full cursor-pointer items-center",
            !value
              ? "gap-6 py-8 flex-col justify-start"
              : "flex-row justify-between gap-3",
          )}
        >
          {value ? (
            <>
              <img
                src={URL.createObjectURL(value)}
                className="w-[48px] h-[48px] rounded-[8px] my-3"
              />
              <p>{value.name}</p>
              <div className="flex flex-1" />
            </>
          ) : (
            <p className="text-material-medium-1 type-button-3">
              Drop here or...
            </p>
          )}
          <PillComponent
            size="small"
            className="pointer-events-none text-material-diabolical"
          >
            {!value ? "Select" : "Upload new"}
          </PillComponent>
        </label>
        <input
          type="file"
          id={id}
          onChange={handleChange}
          placeholder={"" + label}
          className={classNames("hidden")}
        />
      </InputWrapperComponent>
    );
  },
);
