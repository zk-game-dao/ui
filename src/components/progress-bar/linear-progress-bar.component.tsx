import classNames from 'classnames';
import { motion } from 'framer-motion';
import { memo, useMemo, useRef } from 'react';

import { useElementSize } from '../../hooks/element-box';

export const LinearProgressBarComponent = memo<{
  progress: number;
  className?: string;
}>(({ progress, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const size = useElementSize(ref);

  const progressWidth = useMemo(
    () =>
      size.width && size.height
        ? Math.max(size.height, size.width * Math.max(0, Math.min(1, progress)))
        : undefined,
    [size.width, progress],
  );

  return (
    <div
      className={classNames(
        className,
        "h-[10px] backdrop-blur-2xl rounded-full",
        { relative: !className?.includes("absolute") },
      )}
      ref={ref}
    >
      <svg
        width="100%"
        height="10"
        className="absolute left-0 top-0 pointer-events-none"
        viewBox={`0 0 ${size.width ?? 0 + 1} 10`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <g transform="translate(-8 -5)">
          <g filter="url(#filter0_bd_2902_2722)">
            <rect
              x="8"
              y="5"
              width={size.width}
              height="10"
              rx="5"
              fill="white"
              fillOpacity="0.12"
              shapeRendering="crispEdges"
            />
          </g>
          <g filter="url(#filter1_ddi_2902_2722)">
            <motion.rect
              x="8"
              y="5"
              animate={{ width: progressWidth }}
              height="10"
              rx="5"
              fill="white"
              fillOpacity="0.7"
              shapeRendering="crispEdges"
            />
          </g>
          <defs>
            <filter
              id="filter0_bd_2902_2722"
              x="-32"
              y="-35"
              width={(size.width ?? 0) * 2}
              height="90"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="20" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_2902_2722"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.5" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_backgroundBlur_2902_2722"
                result="effect2_dropShadow_2902_2722"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow_2902_2722"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_ddi_2902_2722"
              x="0"
              y="0"
              width={(size.width ?? 0) * 2}
              height="26"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2902_2722"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="3" />
              <feGaussianBlur stdDeviation="4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_2902_2722"
                result="effect2_dropShadow_2902_2722"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow_2902_2722"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect3_innerShadow_2902_2722"
              />
            </filter>
          </defs>
        </g>
      </svg>
    </div>
  );
});
