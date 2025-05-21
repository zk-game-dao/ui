import { memo, ReactNode, useCallback, useMemo } from 'react';

import { DateToBigIntTimestamp } from '../../utils/time';
import { InputWrapperComponent } from './input-wrapper.component';
import { RawNumberInputComponent } from './raw-number-input.component';

type DateInputComponentProps = {
  datetime_ns?: bigint;
  min_ns?: bigint;
  max_ns?: bigint;

  showSeconds?: boolean;
  showTime?: boolean;
  label?: ReactNode;
  onChange?: (date: bigint) => void;
};

type DateComponents = {
  nanoSeconds: bigint;
  seconds: bigint;
  minutes: bigint;
  hours: bigint;
  days: bigint;
  months: bigint;
  years: bigint;
}

const DateComponent = memo<{
  value: bigint;
  min: number;
  max: number;
  onChange: (value: bigint) => void;
  suffix: ReactNode;
}>(({ value, min, max, onChange, suffix }) => (
  <div className='flex flex-row'>
    <RawNumberInputComponent
      value={Number(value)}
      min={min}
      max={max}
      step={1}
      onChange={(v) => onChange(BigInt(v))}
      orientation="right"
      pad={2}
    />
    <span className='text-material-heavy-1 ml-[1px]'>{suffix}</span>
  </div>
));

export const DateInputComponent = memo<DateInputComponentProps>(
  ({
    label,
    datetime_ns = DateToBigIntTimestamp(new Date()),
    min_ns,
    max_ns,
    showSeconds = false,
    showTime = true,
    onChange
  }) => {
    const components = useMemo(() => {
      const msSinceEpoch = Number(datetime_ns / 1_000_000n);
      const date = new Date(msSinceEpoch);

      return {
        nanoSeconds: datetime_ns % 1_000_000n,
        seconds: BigInt(date.getSeconds()),
        minutes: BigInt(date.getMinutes()),
        hours: BigInt(date.getHours()),
        days: BigInt(date.getDate()),     // 1-31
        months: BigInt(date.getMonth() + 1), // 1-12
        years: BigInt(date.getFullYear())
      };
    }, [datetime_ns]);

    const patchComponents = useCallback((patch: Partial<DateComponents>) => {
      if (!onChange) return;

      const updated = {
        nanoSeconds: patch.nanoSeconds ?? components.nanoSeconds,
        seconds: patch.seconds ?? components.seconds,
        minutes: patch.minutes ?? components.minutes,
        hours: patch.hours ?? components.hours,
        days: patch.days ?? components.days,
        months: patch.months ?? components.months,
        years: patch.years ?? components.years,
      };

      // Normalize time components
      let totalSeconds = Number(updated.seconds);
      let totalMinutes = Number(updated.minutes) + Math.floor(totalSeconds / 60);
      totalSeconds %= 60;
      if (totalSeconds < 0) {
        totalSeconds += 60;
        totalMinutes--;
      }

      let totalHours = Number(updated.hours) + Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
      if (totalMinutes < 0) {
        totalMinutes += 60;
        // totalHours;
      }

      // Create base date and handle date rollover
      const date = new Date(
        Number(updated.years),
        0, // Start at January
        1, // Start at day 1
        0, 0, 0
      );

      // Add months (handles rollover across years)
      date.setMonth(date.getMonth() + Number(updated.months) - 1);

      // Add days (handles month/year rollover)
      date.setDate(date.getDate() + Number(updated.days) - 1);

      // Add normalized hours
      date.setHours(totalHours);
      date.setMinutes(totalMinutes);
      date.setSeconds(totalSeconds);

      // Convert to nanoseconds
      const msSinceEpoch = BigInt(date.getTime());
      let nsSinceEpoch = msSinceEpoch * 1_000_000n + updated.nanoSeconds;

      if (min_ns && nsSinceEpoch < min_ns)
        nsSinceEpoch = min_ns;

      if (max_ns && nsSinceEpoch > max_ns)
        nsSinceEpoch = max_ns;

      onChange(nsSinceEpoch);
    }, [components, onChange, min_ns, max_ns]);

    return (
      <InputWrapperComponent isRight label={label ?? "Date"}>
        <div className='flex flex-row gap-2'>
          <div className='flex flex-row gap-0.5 bg-material-main-1 rounded-full px-2 py-0.5 w-full'>
            <DateComponent
              value={components.years}
              min={2000}
              max={2999}
              onChange={(years) => patchComponents({ years })}
              suffix='Y'
            />
            <DateComponent
              value={components.months}
              min={0}
              max={13}
              onChange={(months) => patchComponents({ months })}
              suffix='M'
            />
            <DateComponent
              value={components.days}
              min={0}
              max={32}
              onChange={(days) => patchComponents({ days })}
              suffix='D'
            />
          </div>
          {showTime && (
            <div className='flex flex-row gap-0.5 bg-material-main-1 rounded-full px-2 py-0.5'>
              <DateComponent
                value={components.hours}
                min={-1}
                max={24}
                onChange={(hours) => patchComponents({ hours })}
                suffix='h'
              />
              <DateComponent
                value={components.minutes}
                min={-1}
                max={60}
                onChange={(minutes) => patchComponents({ minutes })}
                suffix='m'
              />
              {showSeconds && (
                <DateComponent
                  value={components.seconds}
                  min={-1}
                  max={60}
                  onChange={(seconds) => patchComponents({ seconds })}
                  suffix='s'
                />
              )}
            </div>
          )}
        </div>
      </InputWrapperComponent>
    );
  },
);