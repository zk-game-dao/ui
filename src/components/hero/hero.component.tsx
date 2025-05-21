import { memo, PropsWithChildren, ReactNode } from 'react';

import Image, { ImageProps } from '../image/image.component';
import PillComponent, { PillProps } from '../pill/pill.component';
import classNames from 'classnames';

export type HeroComponentProps = PropsWithChildren<{
  title: ReactNode;
  subTitle?: ReactNode;
  image?: ImageProps;
  mobileImage?: ImageProps;
  ctas?: PillProps[];
}>;

export const HeroComponent = memo<HeroComponentProps>(
  ({ children, title, subTitle, ctas, image, mobileImage }) => (
    <div className="container mx-auto mb-8">
      {mobileImage && <Image {...mobileImage} className="flex mb-8 lg:hidden" />}
      <div className='max-w-[800px] flex flex-col mx-auto'>
        <h1 className="type-top lg:type-display text-center mb-6">{title}</h1>
        {subTitle && (
          <p className="type-header text-center mb-8 text-material-medium-2 max-w-[650px] mx-auto">
            {subTitle}
          </p>
        )}
        {ctas && ctas.length > 0 && (
          <div className="flex flex-row mb-6 gap-2 w-full justify-center">
            {ctas?.map((v, i) => <PillComponent {...v} key={i} />)}
          </div>
        )}
      </div>
      {image && (
        <Image
          {...image}
          className={classNames(
            // '-mx-16',
            {
              "hidden lg:flex": mobileImage,
            }
          )}
        />
      )}
      {children}
    </div>
  ),
);
