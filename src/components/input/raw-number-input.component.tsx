import { Big, BigSource } from 'big.js';
import classNames from 'classnames';
import {
  ChangeEvent, forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState
} from 'react';

export type Num = BigSource;

export const SafeNumber = (value: Num, fallback = Big(0)): Big => {
  try {
    return Big(value);
  } catch (e) {
    return fallback;
  }
}

export const ApplyMaxDecimals = (value: Num, maxDecimals?: number): Big => {
  if (maxDecimals === undefined) return SafeNumber(value);
  const power = Big(10).pow(maxDecimals);
  return SafeNumber(value).mul(power).round().div(power);
}

export type RawNumberInputValue = {
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: Num;
  min?: Num;
  max?: Num;
  step?: Num;
  maxDecimals?: number;
  pad?: number;
  orientation?: 'left' | 'right';
  onChange?(number: number): void;
  onChangeBigFloat?(number: Big): void;
  value?: Num;
  className?: string;
};

// Define an interface for the ref methods we want to expose
export interface RawNumberInputRef {
  setInternalValue: (value: Num | undefined) => void;
  getInternalValue: () => Big | undefined;
  clear: () => void;
  focus: () => void;
}

export const RawNumberInputComponent = memo(
  forwardRef<RawNumberInputRef, RawNumberInputValue>(
    (
      {
        disabled,
        placeholder,
        defaultValue,
        min,
        max,
        step,
        onChange: onChangeFloat,
        onChangeBigFloat,
        value: _value,
        maxDecimals: _maxDecimals = 8,
        className,
        pad = 0,
        orientation = 'left',
      },
      ref,
    ) => {
      // If the max decimals is less than the step, we need to round the step to the max decimals
      const maxDecimals = useMemo(() => {
        if (step === undefined) return _maxDecimals;
        const stepValue = Big(step);
        const stepDecimals = stepValue.toString().split('.')[1]?.length || 0;
        return Math.max(_maxDecimals, stepDecimals);
      }, [_maxDecimals, step]);
      const inputRef = useRef<HTMLInputElement>(null);
      const [internalValue, setInternalValueState] = useState<Big | undefined>((_value ?? defaultValue) ? Big((_value ?? defaultValue)!) : undefined);
      const [isEditing, setIsEditing] = useState(false);

      const onChange = useCallback(
        (value: Num) => {
          const v = Big(value);
          if (onChangeFloat) onChangeFloat(v.toNumber());
          if (onChangeBigFloat) onChangeBigFloat(v);
        },
        [onChangeFloat, onChangeBigFloat],
      );

      const formatValue = useCallback((value: Big | undefined) => {
        if (value === undefined) return '';
        if (!pad) return value.toFixed();
        return value.toFixed().padStart(pad, '0');
      }, [pad]);

      const normalizeValue = useCallback((value?: Num): Big | undefined => {
        if (value === undefined || value === '' || value === '-' || value === '.') return undefined;

        let numValue = Big(value);
        // if (numValue) return undefined;

        if (step !== undefined) {
          numValue = Big(step).mul(Math.floor(numValue.div(Big(step)).toNumber()));
        }

        if (min !== undefined && numValue.lt(min)) return Big(min);
        if (max !== undefined && numValue.gt(max)) return Big(max);

        numValue = ApplyMaxDecimals(numValue, maxDecimals);

        return numValue;
      }, [min?.toString(), max?.toString(), step?.toString(), maxDecimals?.toString()]);

      // Sync with external value prop when its normalized form differs from internalValue's normalized form
      useEffect(() => {
        const normalizedIncoming = normalizeValue(_value);
        const normalizedCurrent = normalizeValue(internalValue);

        if (normalizedIncoming === normalizedCurrent) return;
        setInternalValueState(normalizedIncoming);

        if (!inputRef.current) return;
        inputRef.current.value = formatValue(normalizedIncoming);
      }, [_value?.toString(), internalValue?.toFixed(), isEditing, normalizeValue, formatValue]);

      const onClear = useCallback(() => {
        if (inputRef.current) {
          inputRef.current.value = '';
          inputRef.current.focus();
        }
        setInternalValueState(undefined);
        if (onChange) onChange(0);
      }, [onChange]);

      useImperativeHandle(
        ref,
        () => ({
          setInternalValue: (value: Num | undefined) => {
            const normalized = normalizeValue(value?.toString() || '');
            setInternalValueState(normalized);
            if (inputRef.current) {
              inputRef.current.value = formatValue(normalized);
            }
            if (onChange && normalized !== undefined) onChange(normalized);
          },
          getInternalValue: () => internalValue,
          focus: () => inputRef.current?.focus(),
          clear: onClear,
        }),
        [internalValue?.toFixed(), onChange, normalizeValue, formatValue, onClear],
      );

      const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const isValidInput =
          /^-?\d*\.?\d*$/.test(newValue) || newValue === '' || newValue === '-' || newValue === '.';

        if (!isValidInput) {
          e.preventDefault();
          return false;
        }
      }, []);

      const handleBlur = useCallback(() => {
        setIsEditing(false);
        if (!inputRef.current) return;

        const inputValue = inputRef.current.value;
        const normalizedValue = normalizeValue(inputValue);

        if (normalizedValue !== undefined) {
          const formattedValue = formatValue(normalizedValue);
          if (inputValue !== formattedValue) {
            inputRef.current.value = formattedValue;
          }
          setInternalValueState(normalizedValue);
          if (onChange) onChange(normalizedValue);
        } else {
          inputRef.current.value = '';
          setInternalValueState(undefined);
        }
      }, [normalizeValue, onChange, formatValue]);

      const handleFocus = useCallback(() => {
        setIsEditing(true);
      }, []);

      const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            if (inputRef.current) {
              const value = normalizeValue(inputRef.current.value);
              if (value !== undefined) {
                inputRef.current.value = formatValue(value);
                setInternalValueState(value);
                if (onChange) onChange(value);
              }
              inputRef.current.blur();
            }
          }

          if (e.key === 'Escape') {
            onClear();
          }

          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();

            if (!inputRef.current) return;

            let currentValue: Big;
            try {
              currentValue = Big(inputRef.current.value === '' ? 0 : inputRef.current.value);
            } catch {
              currentValue = Big(0);
            }

            const stepSize = Big(step === undefined ? 1 : step);
            const direction = Big(e.key === 'ArrowUp' ? 1 : -1);


            let newValue: Big;
            if (step !== undefined) {
              newValue = (currentValue.add(stepSize.mul(direction)).div(stepSize)).round().mul(stepSize);
              if (newValue.eq(currentValue)) {
                newValue = currentValue.add(direction.mul(stepSize));
              }
            } else {
              newValue = currentValue.add(direction.mul(stepSize));
            }

            if (min !== undefined && newValue.lt(min)) newValue = Big(min);
            if (max !== undefined && newValue.gt(max)) newValue = Big(max);

            newValue = ApplyMaxDecimals(newValue, maxDecimals);
            inputRef.current.value = formatValue(newValue);
            setInternalValueState(newValue);
            if (onChange) onChange(newValue);
          }
        },
        [normalizeValue, onChange, step?.toString(), min?.toString(), max?.toString(), maxDecimals?.toString(), onClear, formatValue],
      );

      return (
        <input
          ref={inputRef}
          disabled={disabled}
          type="text"
          min={min?.toString()}
          max={max?.toString()}
          inputMode="numeric"
          placeholder={placeholder}
          defaultValue={internalValue !== undefined ? internalValue.toString() : ''}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{
            fontVariantNumeric: 'tabular-nums',
            width: step === 1 && max !== undefined ? `${max.toString().length + 1}ch` : undefined,
          }}
          className={classNames(
            className,
            'bg-transparent active:outline-hidden focus:outline-hidden',
            orientation === 'left' ? 'text-left' : 'text-right',
            { 'opacity-50': disabled },
          )}
        />
      );
    },
  ),
);