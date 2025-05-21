import { memo, ReactNode, useCallback, useMemo } from 'react';

import { InputWrapperComponent } from './input-wrapper.component';
import { RawNumberInputComponent } from './raw-number-input.component';

type TimeInputComponentProps = {
  nanoseconds?: bigint;
  seconds?: bigint;
  maxHours?: bigint;
  label?: ReactNode;
  hideHours?: boolean;
  showSeconds?: boolean;
  onChangeNanoseconds?: (nanoseconds: bigint) => void;
  onChangeSeconds?: (nanoseconds: bigint) => void;
};

const InputComp = memo<{
  value: number;
  suffix: ReactNode;
  min?: number;
  max: number;
  onChange: (value: number) => void;
}>(({ value, suffix, min = -1, max, onChange }) => (
  <label className='rounded-full flex flex-row'>
    <RawNumberInputComponent
      value={value}
      min={min}
      max={max}
      step={1}
      onChange={onChange}
      orientation="right"
      pad={2}
    />
    <span className='text-material-heavy-1 ml-[1px]'>{suffix}</span>
  </label>
));

export const TimeInputComponent = memo<TimeInputComponentProps>(({
  label,
  nanoseconds: _nanoseconds,
  seconds: _seconds,
  showSeconds = false,
  hideHours = false,
  onChangeNanoseconds,
  onChangeSeconds,
  maxHours = 9999n,
}) => {
  const fullSeconds = useMemo(() => _seconds ?? (_nanoseconds ? _nanoseconds / BigInt(1e9) : BigInt(0)), [_nanoseconds, _seconds]);
  const shownSeconds = useMemo(() => fullSeconds % 60n, [fullSeconds]);
  const shownMinutes = useMemo(() => (fullSeconds / 60n) % 60n, [fullSeconds]);
  const shownHours = useMemo(() => fullSeconds / 3600n, [fullSeconds]);

  const maxSeconds = useMemo(() => maxHours * 3600n + 59n * 60n + 59n, [maxHours]);

  const updateTime = useCallback((cb: (seconds: bigint) => bigint) => {
    let seconds = cb(fullSeconds);
    if (seconds < 0) seconds = 0n;
    if (seconds > maxSeconds) seconds = maxSeconds;

    if (onChangeNanoseconds)
      onChangeNanoseconds(seconds * BigInt(1e9));
    if (onChangeSeconds)
      onChangeSeconds(seconds);
  }, [onChangeNanoseconds, onChangeSeconds, fullSeconds, maxHours]);

  return (
    <>
      <InputWrapperComponent isRight label={label}>

        <div className='flex flex-row gap-0.5 justify-center bg-material-main-1 rounded-full px-2 py-0.5'>
          {!hideHours && (
            <InputComp
              value={Number(shownHours)}
              suffix='h'
              max={Number(maxHours)}
              onChange={(value) => updateTime(() => BigInt(value) * 3600n + (shownMinutes * 60n) + shownSeconds)}
            />
          )}

          <InputComp
            value={Number(shownMinutes)}
            suffix='m'
            max={60}
            onChange={(value) => updateTime(() => shownHours * 3600n + (BigInt(value) * 60n) + shownSeconds)}
          />

          {showSeconds && (
            <InputComp
              value={Number(shownSeconds)}
              suffix='s'
              max={60}
              onChange={(value) => updateTime(() => shownHours * 3600n + (shownMinutes * 60n) + BigInt(value))}
            />
          )}
        </div>
      </InputWrapperComponent>
    </>
  );
});