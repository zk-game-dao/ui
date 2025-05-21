import { memo, ReactNode } from "react";

import { DropdownComponentProps } from "../dropdown/dropdown.component";
import {
  NumberInputComponent,
  NumberInputValue,
} from "./number-input.component";
import { SwitchInputComponent } from "./switch-input.component";
import { TextInputComponent } from "./text-input.component";
import { DropdownInputComponent } from "./dropdown-input.component";
import {
  SliderInputComponent,
  SliderInputValue,
} from "./slider-input.component";

export type TextField = {
  type: "text" | "email";
  label: ReactNode;
  defaultValue?: string;
  error?: string;
};

export type NumberField = { type: "number" } & NumberInputValue;

export type ToggleField = {
  type: "toggle";
  label: ReactNode;
  defaultValue?: boolean;
};

export type DropdownField = {
  type: "dropdown";
  label: ReactNode;
  defaultValue?: string | number;
  options?: DropdownComponentProps["options"];
};

export type ButtonField = {
  type: "button";
  label: ReactNode;
  defaultValue: never;
};

export type SliderField = {
  type: "slider";
  label: ReactNode;
  defaultValue?: never;
} & SliderInputValue;

export type Field =
  | TextField
  | ToggleField
  | NumberField
  | DropdownField
  | ButtonField
  | SliderField;

export type FieldComponentProps<
  F extends Field = Field,
  V = F["defaultValue"],
> = F & {
  value?: V;
  borderRadius?: "all" | "top" | "bottom";
  onChange: (value: any) => void;
};

export const FieldComponent = memo<FieldComponentProps>(
  ({ onChange, value, ...field }) => {
    switch (field.type) {
      case "text":
      case "email":
        return (
          <TextInputComponent
            error={field.error}
            label={field.label}
            value={value as TextField["defaultValue"]}
            onChange={onChange}
            type={field.type}
          />
        );
      case "toggle":
        return (
          <SwitchInputComponent
            checked={
              typeof value === "undefined"
                ? field.defaultValue
                : (value as ToggleField["defaultValue"])
            }
            onChange={onChange}
            label={field.label}
          />
        );
      case "slider":
        return (
          <SliderInputComponent
            value={value as number}
            onChange={onChange}
            label={field.label}
            min={field.min}
            max={field.max}
          />
        );
      case "dropdown":
        return (
          <DropdownInputComponent
            placeholder={"" + field.defaultValue}
            value={value as DropdownField["defaultValue"]}
            onChange={onChange}
            options={field.options}
            label={field.label}
          />
        );
      case "button":
        return <button onClick={onChange}>{field.label}</button>; // Assuming the button triggers the onChange
      case "number":
        return (
          <NumberInputComponent
            {...field}
            value={value as any}
            onChange={onChange}
          />
        );
      default:
        return <p>Unkown field type {(field as any).type}</p>;
    }
  },
);
