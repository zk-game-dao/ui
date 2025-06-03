import classNames from 'classnames';
import { memo, ReactNode, useMemo, useRef } from 'react';

import { InputWrapperComponent } from './input-wrapper.component';
import { Num, RawNumberInputComponent, RawNumberInputRef } from './raw-number-input.component';
import Big from 'big.js';

export type NumberInputValue = {
  disabled?: boolean;
  /** @deprecated it is now by default showing in list, use hideLabelInList to hide the label */
  showLabelInList?: boolean;
  hideLabelInList?: boolean;
  label?: ReactNode;
  defaultValue?: Num;
  symbol?: ReactNode;
  min?: Num;
  max?: Num;
  step?: Num;
  minQuickAction?: boolean;
  maxQuickAction?: boolean;
  maxDecimals?: number;
  hideClear?: boolean;
  quickActions?: { label: string, value: Num }[];
};

type NumberInputProps = NumberInputValue & {
  onChange?(number: number): void;
  onChangeBigFloat?(number: Big): void;
  value?: Num;
  className?: string;
};

export const NumberInputComponent = memo<NumberInputProps>(
  ({
    disabled,
    label,
    defaultValue,
    symbol,
    min,
    max,
    step,
    onChange: onChangeFloat,
    onChangeBigFloat,
    value: _value,
    maxDecimals = 8,
    hideLabelInList = false,
    className,
    hideClear = false,
    quickActions: _quickActions,
    minQuickAction,
    maxQuickAction
  }) => {
    const inputRef = useRef<RawNumberInputRef>(null);
    const showClear = useMemo(() => inputRef.current?.getInternalValue() !== undefined && !hideClear, [inputRef.current, hideClear]);

    const onChange = (value: Num) => {
      const v = Big(value);
      if (onChangeFloat)
        onChangeFloat(v.toNumber());
      if (onChangeBigFloat)
        onChangeBigFloat(v);
    };


    const quickActions = useMemo(() => {
      const actions = _quickActions || [];
      if (minQuickAction && min !== undefined)
        actions.push({ label: 'Min', value: min });
      if (maxQuickAction && max !== undefined)
        actions.push({ label: 'Max', value: max });

      if (actions.length === 0 || !onChange) return undefined;
      return actions.map((action) => ({
        ...action,
        action: () => onChange(action.value),
      }));
    }, [minQuickAction, maxQuickAction, min, max, _quickActions]);

    return (
      <InputWrapperComponent
        label={label}
        showClear={showClear}
        onClear={(!disabled && inputRef.current?.clear) || undefined}
        isRight={!hideLabelInList}
        className={className}
        quickActions={quickActions}
      >
        <div className="flex flex-row w-full h-full justify-end items-center">
          <RawNumberInputComponent
            ref={inputRef}
            value={_value}
            min={min}
            max={max}
            step={step}
            onChangeBigFloat={onChange}
            maxDecimals={maxDecimals}
            orientation="right"
            defaultValue={defaultValue}
            disabled={disabled}
            className="w-full"
          />
          {symbol && <span className={classNames("ml-2", { 'opacity-50': disabled })}>{symbol}</span>}
        </div>
      </InputWrapperComponent>
    );
  },
);