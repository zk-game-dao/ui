import classNames from 'classnames';
import { memo, ReactNode, useEffect, useState } from 'react';

import { LinearProgressBarComponent } from '../progress-bar/linear-progress-bar.component';
import { LoadingAnimationComponent } from './loading-animation.component';

export const FauxLoadingBarAnimationComponent = memo<{
  dark?: boolean;
  children?: ReactNode;
  averageLoadingTimeInS?: number;
  className?: string;
}>(({ children, className, averageLoadingTimeInS = 5 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalSpeed = 100;
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 1) return 0;
        const diff =
          (Math.random() * intervalSpeed) / (averageLoadingTimeInS * 1000);
        const newProgress = Math.min(oldProgress + diff, 1);
        if (newProgress === 1) clearInterval(interval);
        return newProgress;
      });
    }, intervalSpeed);

    return () => clearInterval(interval);
  }, [averageLoadingTimeInS]);

  return (
    <div
      className={classNames(
        "flex flex-col gap-2 items-start justify-start",
        className,
      )}
    >
      <LoadingAnimationComponent variant="shimmer">
        {children}
      </LoadingAnimationComponent>
      <LinearProgressBarComponent
        className="w-full"
        progress={progress * 0.95}
      />
    </div>
  );
});
