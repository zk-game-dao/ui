import classNames from 'classnames';
import { memo } from 'react';

import { useTheme } from '../../context/theme.context';
import { Image } from '../image/image.component';

export const LoadingSpinnerComponent = memo<{ className?: string }>(
  ({ className }) => {
    const { isDark } = useTheme();
    return (
      <div
        className={classNames("flex justify-center items-center", className)}
      >
        <div className="relative w-6 h-6">
          <Image
            type="svg"
            src={`/icons/loading${isDark ? "" : "-dark"}-inner.svg`}
            alt="Loading spinner inner"
            className="w-6 h-6 opacity-30"
          />
          <Image
            type="svg"
            src={`/icons/loading${isDark ? "" : "-dark"}-outer.svg`}
            alt="Loading spinner outer"
            className="absolute object-cover animate-stepped-spin left-0 top-0 w-6 h-6"
          />
        </div>
      </div>
    );
  },
);

export default LoadingSpinnerComponent;
