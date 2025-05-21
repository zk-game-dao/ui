import classNames from 'classnames';
import { Image } from 'components/image';
import { Fragment, memo } from 'react';

import ChevronRightGreySmall from '../../../assets/svgs/chevron-right-grey-small.svg';
import Interactable from 'components/interactable.component';

const DirectionButton = memo<{ direction: 'left' | 'right'; onClick(): void; }>(({ direction, onClick }) => (
  <Interactable
    className="material rounded-full size-8 flex justify-center items-center cursor-pointer transition-all duration-150 active:scale-95"
    onClick={onClick}
  >
    <Image
      type="svg"
      alt="Close"
      src={ChevronRightGreySmall}
      className={classNames(
        "flex pointer-events-none",
        { "rotate-180": direction !== 'right', }
      )}
    />
  </Interactable>
));

const PaginationPage = memo<{
  page: number;
  isActive: boolean;
  onClick(): void;
  isFirst?: boolean;
  isLast?: boolean;
}>(
  ({ page, isActive, onClick, isFirst, isLast }) => (
    <Interactable
      className={classNames("py-1 text-center transition-all duration-150 active:scale-90", {
        "bg-material-main-1": isActive,
        'pl-1 rounded-l-full': isFirst,
        'pr-1 rounded-r-full': isLast,
        'w-11': isLast || isFirst,
        'w-10': !isLast && !isFirst,
      })}
      onClick={onClick}
    >
      {page + 1}
    </Interactable>
  )
);

export const PaginationComponent = memo<{
  className?: string;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}>(({
  className,
  totalPages,
  currentPage,
  onPageChange,
}) => {

  return (
    <div className={classNames("flex flex-row items-center justify-center gap-2", className)}>
      <DirectionButton
        direction="left"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
      />
      <div className='flex flex-row material rounded-full'>
        {Array.from({ length: totalPages }, (_, i) => (
          <Fragment
            key={i}
          >
            {i > 0 && <div className='border-l border-material-main-1' />}
            <PaginationPage
              page={i}
              isActive={i === currentPage}
              onClick={() => onPageChange(i)}
              isFirst={i === 0}
              isLast={i === totalPages - 1}
            />
          </Fragment>
        ))}
      </div>
      <DirectionButton
        direction="right"
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
      />
    </div>
  )
});
