import classNames from "classnames";
import { memo, ReactNode, useEffect, useMemo, useState } from "react";

import * as Slider from "@radix-ui/react-slider";

import { InputWrapperComponent } from "./input-wrapper.component";

export type SliderInputValue = {
  min?: number;
  max?: number;
  step?: number;
  label?: ReactNode;
};

type SliderInputComponentProps = SliderInputValue & {
  value: number;
  onChange: (value: number) => void;
};

export const SliderInputComponent = memo<SliderInputComponentProps>(
  ({ min, max, label, step, value, onChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [didChange, setDidChange] = useState<undefined | boolean>();

    useEffect(() => {
      if (!value) return;
      if (didChange === undefined) {
        setDidChange(false);
        return;
      }
      setDidChange(true);
      const timeout = setTimeout(() => setDidChange(false), 1000);
      return () => clearTimeout(timeout);
    }, [value]);

    const showValue = useMemo(
      () => didChange || isDragging,
      [didChange, isDragging],
    );

    return (
      <InputWrapperComponent label={label} isRight>
        <Slider.Root
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          className="w-full relative flex items-center h-[10px] min-w-[120px]"
        >
          <Slider.Track className="relative h-full w-full material overflow-hidden">
            <Slider.Range className="absolute h-full material bg-white/70 rounded-full min-w-[10px]">
              <div className="absolute right-[2px] w-[6px] h-[6px] top-[2px] bg-black rounded-full" />
            </Slider.Range>
          </Slider.Track>
          <Slider.Thumb
            className={classNames("h-full relative transition-all")}
          >
            <div
              className={classNames(
                "p-3 type-button-2 bg-white text-black rounded-[12px] shadow-md transition-all duration-150",
                showValue
                  ? "opacity-100 scale-100 -translate-y-8"
                  : "opacity-0 scale-95 -translate-y-7",
              )}
            >
              {value.toFixed(0)}
            </div>
          </Slider.Thumb>
        </Slider.Root>
      </InputWrapperComponent>
    );
  },
);
