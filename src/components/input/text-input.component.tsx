import classNames from 'classnames';
import { ChangeEvent, memo, ReactNode, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { InputWrapperComponent } from './input-wrapper.component';

export type TextInputProps = {
  label: ReactNode;
  defaultValue?: string;
  value?: string;
  type?: "text" | "email";
  error?: string;
  icon?: ReactNode;
  isArea?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  pattern?: string;
  onChange?(value: string): void;
};

export const TextInputComponent = memo<TextInputProps>(
  ({
    isArea = false,
    icon,
    value: externalValue,
    defaultValue,
    type = "text",
    onChange,
    label,
    placeholder,
    disabled,
    maxLength,
    pattern,
    error,
  }) => {
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const [internalValue, setInternalValue] = useState<string | undefined>(externalValue ?? defaultValue ?? '');
    const [isEditing, setIsEditing] = useState(false);

    // Sync with external value when it changes
    useEffect(() => {
      if (externalValue !== undefined && externalValue !== internalValue && !isEditing) {
        setInternalValue(externalValue);
      }
    }, [externalValue, internalValue, isEditing]);

    const validateInput = useCallback((value: string): string => {
      if (!value) return '';

      if (maxLength !== undefined && value.length > maxLength) {
        return value.slice(0, maxLength);
      }

      if (pattern && !new RegExp(pattern).test(value)) {
        return internalValue || '';
      }

      if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value !== '') {
        // Allow partial email input but validate on blur
        if (isEditing) return value;
        return internalValue || '';
      }

      return value;
    }, [internalValue, maxLength, pattern, type, isEditing]);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const validatedValue = validateInput(newValue);

        setInternalValue(validatedValue);
        if (onChange) onChange(validatedValue);
      },
      [onChange, validateInput]
    );

    const handleFocus = useCallback(() => {
      setIsEditing(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsEditing(false);

      if (!inputRef.current) return;

      const inputValue = inputRef.current.value;
      const validatedValue = validateInput(inputValue);

      setInternalValue(validatedValue);
      if (onChange) onChange(validatedValue);
    }, [onChange, validateInput]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !isArea) {
          inputRef.current?.blur();
        }

        if (e.key === 'Escape') {
          setInternalValue('');
          if (onChange) onChange('');
        }
      },
      [isArea, onChange]
    );

    const handleClear = useCallback(() => {
      setInternalValue('');
      if (onChange) onChange('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }, [onChange]);

    const Element = useMemo(() => isArea ? "textarea" : "input", [isArea]) as any;

    // Determine the displayed value
    const displayValue = externalValue !== undefined ? externalValue : internalValue;

    return (
      <InputWrapperComponent
        showClear={!!displayValue}
        onClear={handleClear}
        label={label}
        // error={error}
        isFixedHeight={!isArea}
        rightPadding={!isArea}
      >
        <div className="flex flex-row w-full h-full justify-start items-center">
          {icon && <div className="ml-2">{icon}</div>}
          <Element
            ref={inputRef}
            type={type}
            defaultValue={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || `${label}`}
            disabled={disabled}
            maxLength={maxLength}
            className={classNames(
              "bg-transparent w-full h-full inline focus:outline-none",
              isArea ? "min-h-[42px] py-2" : "h-full",
              icon ? "ml-2" : "",
              { "opacity-50": disabled }
            )}
          />
        </div>
      </InputWrapperComponent>
    );
  }
);