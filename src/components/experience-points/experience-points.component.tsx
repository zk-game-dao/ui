import classNames from 'classnames';
import { memo } from 'react';

import { BigIntToString } from '../../utils/bigint';

export const XP_DECIMALS = 0;

export const ExperiencePointsComponent = memo<{
  experience_points?: [] | [bigint];
  className?: string;
  size?: "big" | "medium" | "small";
}>(({ experience_points = [], className, size = 'medium' }) => {
  const xp = experience_points[0] || 0n;

  return (
    <div
      className={classNames(
        "inline items-center justify-center whitespace-nowrap text-material-heavy-1",
        className,
        {
          "type-header": size === "big",
          "type-button-2": size === "medium",
          "type-button-3": size === "small",
        }
      )}
    >
      {`${BigIntToString(xp, XP_DECIMALS)} XP`}
    </div>
  );
});
