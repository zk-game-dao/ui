import classNames from "classnames";
import { memo, useMemo } from "react";
import { motion } from "framer-motion";

export const CircularProgressBarComponent = memo<{
  progress: number;
  className: string;
}>(({ progress, className }) => {
  const radius = 37;
  const thickness = 3;

  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const strokeDashoffset = useMemo(
    () => circumference - progress * circumference,
    [progress, circumference],
  );

  return (
    <div className={classNames(className, "")}>
      <svg
        viewBox="0 0 98 98"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <g transform="scale(1.22) translate(-12 -6)">
          <g filter="url(#filter0_bdi_2858_1825)">
            <circle
              cx="52"
              cy="46"
              r={radius}
              stroke="#808080"
              strokeOpacity="0.3"
              strokeWidth={thickness * 2}
              style={{ mixBlendMode: "luminosity" }}
              shapeRendering="crispEdges"
            />
          </g>
          <g filter="url(#filter1_ddi_2858_1825)">
            <motion.circle
              transform={`rotate(-90 52 46)`}
              initial={false}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
              cx="52"
              cy="46"
              r={radius}
              stroke="#EDEDED"
              strokeOpacity="0.7"
              strokeWidth={thickness * 2}
              strokeLinecap="round"
              style={{ mixBlendMode: "luminosity" }}
              shapeRendering="crispEdges"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </g>
          <defs>
            <filter
              id="filter0_bdi_2858_1825"
              x="-3.5"
              y="-9.5"
              width="111"
              height="111"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feGaussianBlur in="BackgroundImageFix" stdDeviation="8" />
              <feComposite
                in2="SourceAlpha"
                operator="in"
                result="effect1_backgroundBlur_2858_1825"
              />
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
                in2="effect1_backgroundBlur_2858_1825"
                result="effect2_dropShadow_2858_1825"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow_2858_1825"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect3_innerShadow_2858_1825"
              />
            </filter>
            <filter
              id="filter1_ddi_2858_1825"
              x="0.5"
              y="0.5"
              width="97.166"
              height="103"
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
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_2858_1825"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="6" />
              <feGaussianBlur stdDeviation="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_2858_1825"
                result="effect2_dropShadow_2858_1825"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow_2858_1825"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1" />
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
                result="effect3_innerShadow_2858_1825"
              />
            </filter>
          </defs>
        </g>
      </svg>
    </div>
  );
});
