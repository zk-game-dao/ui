import classNames from 'classnames';
import { motion } from 'framer-motion';
import { memo, ReactNode } from 'react';

import { useCopyToClipboard } from '../../hooks/clipboard';
import { Image } from '..//image/image.component';
import { Interactable } from '..//interactable.component';
import { PillComponent } from '..//pill/pill.component';

export type CardItemProps = {
  title: string;
  value: ReactNode;
  isHeader?: boolean;
}

const TableItem = memo<CardItemProps>(
  ({ title, value, isHeader }) => (
    <div
      className={classNames(
        "flex flex-row gap-4",
        isHeader ? "type-button-1 text-white" : "type-button-3",
      )}
    >
      <div>{title}</div>
      <div className="flex-1" />
      <div className="type-button-3">{value}</div>
    </div>
  ),
);

export type CardComponentProps = {
  index?: number;
  variant?: "large" | "small";
  image?: ReactNode;
  background?: ReactNode;
  items?: CardItemProps[];
  joinLabel?: ReactNode;
  joinUrl?: string;
  leftLabel?: ReactNode;
}

export const CardComponent = memo<CardComponentProps>(
  ({
    index,
    variant = "large",
    image,
    background,
    items = [],
    joinLabel,
    joinUrl,
    leftLabel,
  }) => {
    const copyUrlToClipboard = useCopyToClipboard(joinUrl);
    return (
      <motion.div
        variants={{
          hidden: { y: -4, opacity: 0, transition: index !== undefined ? { delay: 0 } : { delay: 0 } },
          visible: { y: 0, opacity: 1, transition: index !== undefined ? { delay: index * 0.02 } : { delay: 0 } },
        }}
        initial="hidden"
        animate="visible"
        className="flex rounded-[16px] material relative"
      >
        {background && (
          <div className="absolute inset-0 rounded-[16px] z-0 flex flex-1 justify-stretch items-stretch">
            {background}
          </div>
        )}
        <Interactable
          href={joinUrl}
          className={classNames(
            "w-full h-full flex relative z-[1]",
            variant === "small"
              ? "cursor-pointer flex-row gap-4 p-6"
              : "flex-col gap-4 lg:gap-8 p-4 lg:p-8",
          )}
        >
          {image && (
            <div className={classNames(
              variant === "small" ? " h-[69px] w-[120px] " : "h-48 lg:-mx-4",
            )}>
            </div>
          )}

          <div
            className={classNames(
              "flex flex-col gap-[10px] type-body text-neutral-200/70",
              { "justify-center": variant === "small" },
            )}
          >

            {variant === "small" ? (
              <>
                <p className="type-button-1 text-white">{items[0]?.title}</p>
                <p className="type-button-3 text-white">
                  {items[0]?.value}
                </p>
              </>
            ) : (
              <>
                {items.map((item, i) => (
                  <TableItem key={i} {...item} />
                ))}
              </>
            )}
          </div>

          {variant === "large" && (
            <div className="flex flex-row w-full justify-between mt-auto items-center">
              {leftLabel ?? <div />}
              {joinLabel && joinUrl && (
                <>
                  <PillComponent href={joinUrl}>
                    {joinLabel}
                  </PillComponent>
                  <Interactable
                    onClick={copyUrlToClipboard}
                    className="material hover:shadow-none w-9 h-9 rounded-full flex justify-center items-center"
                  >
                    <Image
                      type="png"
                      src="/icons/link.png"
                      alt="Copy link"
                      width={48}
                      height={48}
                    />
                  </Interactable>
                </>
              )}
            </div>
          )}
        </Interactable>
      </motion.div>
    );
  },
);
