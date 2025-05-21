import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ButtonComponent, ButtonProps } from "../button/button.component";
import { ErrorComponent } from "../error/error.component";
import { List } from "../list/list.component";
import { ModalFooterPortal } from "../modal/modal";
import { Field, FieldComponent } from "../input/field.component";
import { Num } from "components/input";

export type FormProps = {
  fields: (Field & {
    /** Used to identify fields, useful if fields are replaced */
    name?: string;
  })[];
  values?: (string | boolean | Num | undefined)[];
  onConfirm?: (values: (string | boolean | Num | undefined)[]) => void;
  onChange?: (values: (string | boolean | Num | undefined)[]) => void;
  onCancel?: () => void;
  cancelLabel?: ReactNode;
  cancelColor?: ButtonProps["color"];
  isLoading?: boolean;
  confirmLabel?: ReactNode;
  children?: ReactNode | ReactNode[];
};

export const FormComponent = memo<FormProps>(
  ({
    fields,
    onChange,
    onConfirm,
    onCancel,
    cancelLabel = "Cancel",
    confirmLabel = "Confirm",
    values: valuesFromProps,
    children,
    isLoading = false,
    cancelColor,
  }) => {
    const [valuesFromState, setValues] = useState<
      (string | boolean | Num | undefined)[]
    >(fields.map((v) => v.defaultValue));
    useEffect(() => setValues(fields.map((v) => v.defaultValue)), [fields]);

    const values = useMemo(
      () => valuesFromProps || valuesFromState,
      [valuesFromProps, valuesFromState],
    );
    const [error, setError] = useState<unknown>();

    const confirm = useCallback(() => {
      if (!onConfirm) return;
      try {
        onConfirm(values);
      } catch (e) {
        setError(e);
      }
    }, [onConfirm, values]);

    return (
      <List>
        {fields.map((field, index) => (
          <FieldComponent
            key={field.name ?? "" + index}
            {...field}
            value={values[index]}
            onChange={(newValue) => {
              if (valuesFromProps) {
                const newValues = [
                  ...JSON.parse(JSON.stringify(valuesFromProps)),
                ];
                newValues[index] = newValue;
                if (onChange)
                  onChange(newValues);
              } else {
                setValues((currentValues) => {
                  const newValues = [...currentValues];
                  newValues[index] = newValue;
                  return newValues;
                });
              }
            }}
          />
        ))}

        {children}

        <ErrorComponent error={error} />

        {(onConfirm || onCancel) && (
          <ModalFooterPortal>
            {onCancel ? (
              <ButtonComponent
                color={cancelColor}
                onClick={onCancel}
                variant="naked"
              >
                {cancelLabel}
              </ButtonComponent>
            ) : (
              <div />
            )}
            {onConfirm && (
              <ButtonComponent
                onClick={confirm}
                variant="filled"
                isLoading={isLoading}
              >
                {confirmLabel}
              </ButtonComponent>
            )}
          </ModalFooterPortal>
        )}
      </List>
    );
  },
);
