import { memo, useMemo } from "react";

type RasterizedImageProps = {
  type: "png" | "jpg";
  src: string; // The src must end with .png or .jpg
  /** @default is 3 */
  sizes?: number;
  /** The width of the actual asset (the original not the extra sizes @2/3...) */
  width: number;
  /** The height of the actual asset (the original not the extra sizes @2/3...) */
  height: number;
};

type VectorizedImageProps = {
  type: "svg";
  src: string; // The src must end with .svg
};

type GeneralImageProps = {
  className?: string;
  alt: string;
};

const VectorizedImage = memo<VectorizedImageProps & GeneralImageProps>(
  ({ src, className, alt }) => (
    <img src={src} className={className} alt={alt} />
  ),
);

const RasterizedImage = memo<RasterizedImageProps & GeneralImageProps>(
  ({ src, type, width, height, sizes = 3, className, alt }) => {
    const devicePixelRatio = window.devicePixelRatio || 1;

    const sources = useMemo(
      () =>
        Array.from(
          { length: sizes - 1 },
          (_, i): React.SourceHTMLAttributes<HTMLSourceElement> => {
            const scale = i + 2;
            return {
              srcSet: `${src.replace(
                `.${type}`,
                `@${scale}x.${type}`,
              )} ${scale}x`,
              media: `(min-width: ${
                width / devicePixelRatio
              }px) and (min-height: ${height / devicePixelRatio}px)`,
              type: `image/${type}`,
            };
          },
        ),
      [src, sizes, type, width, height, devicePixelRatio],
    );

    return (
      <picture className={className}>
        {sources.map((props) => (
          <source key={props.srcSet} {...props} />
        ))}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain object-center "
        />
      </picture>
    );
  },
);

export type ImageProps = GeneralImageProps &
  (RasterizedImageProps | VectorizedImageProps);

export const Image = memo<ImageProps>((props) => {
  switch (props.type) {
    case "png":
    case "jpg":
      return <RasterizedImage {...props} />;
    case "svg":
      return <VectorizedImage {...props} />;
  }
});

export default Image;
