import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  memo,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

import { useRouting } from "../../hooks/routing";
import { Label, LabelProps } from "../label.component";
import { Modal, ModalProps } from "../modal/modal";

type ListVariant =
  | {
    type: "default";
    readonly?: boolean;
    variant?: 'alert';
  }
  | {
    type: "droppel";
    side: "right" | "left";
  };

type SublistProps = Pick<ListProps, 'label' | 'ctas' | 'items'>;

export type ListHeaderProps = {
  type: "header";
  description?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  rightSide?: ReactNode;
};

export type ListItemProps =
  | PropsWithChildren<{
    type?: "item";
    icon?: ReactNode;
    href?: string;
    rightLabel?: ReactNode;
    rightIcon?: ReactNode;
    className?: string;
    onClick?(): void;
    modal?: Omit<ModalProps, 'open' | 'onClose'>;
    list?: SublistProps;
    direction?: "row" | "column";
  }>
  | { type: "seperator" } | ListHeaderProps;

type ListContextType = {
  attach(id: string, item: ListItemProps): void;
  detatch(id: string): void;
  listId?: string;
  variant: ListVariant;
};

const ListContext = createContext<ListContextType>({
  attach: () => { },
  detatch: () => { },
  variant: { type: "default" },
});

const RenderedListItem = memo<
  ListItemProps & { first: boolean; last: boolean; openSublist(sublist: SublistProps): void; }
>(({ first, last, openSublist, ...props }) => {
  const { variant } = useContext(ListContext);
  const { push } = useRouting();
  let bg = 'bg-material-main-1';

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant.type === 'default' && variant.variant === 'alert')
    bg = 'bg-red-500/20';

  switch (props.type) {
    case "seperator":
      return (
        <tr>
          {variant.type !== "droppel" && <td className={classNames("w-4")} />}
          <td colSpan={variant.type === "droppel" ? 4 : 3}>
            <div className={classNames("h-[3px] w-full rounded-full", bg)} />
          </td>
          <td
            className={classNames(variant.type === "droppel" ? "w-1" : "w-4")}
          />
        </tr>
      );

    case "item":
    default: {

      const isReadonly = !!(variant.type === "default" && variant.readonly);

      const cellBg = classNames(
        "py-0",
        variant.type === "default"
          ? ["border-b px-0", bg]
          : "px-2",
      );
      const cell = classNames(
        cellBg,
        variant.type === "default" &&
        (!last ? "border-material-main-1" : "border-transparent"),
      );
      const roundingLeft =
        variant.type === "droppel"
          ? "rounded-l-lg"
          : classNames({
            "rounded-tl-[12px]": variant.type === "default" && first,
            "rounded-bl-[12px]": variant.type === "default" && last,
          });
      const roundingRight =
        variant.type === "droppel"
          ? "rounded-r-lg"
          : classNames({
            "rounded-tr-[12px]": variant.type === "default" && first,
            "rounded-br-[12px]": variant.type === "default" && last,
          });

      if (props.type === 'header')
        return (
          <tr>
            {variant.type !== "droppel" && <td className={classNames(cellBg, "border-transparent", roundingLeft, "w-4")} />}
            <td className={cell}>
              <div className="flex flex-col py-3 gap-1">
                {(props.subtitle || props.rightSide) && (
                  <div className="flex flex-row type-button-3 text-material-medium-3">
                    {props.subtitle}
                    {props.rightSide && (
                      <>
                        <div className="flex flex-1" />
                        {props.rightSide}
                      </>
                    )}
                  </div>
                )}
                <p className="type-header">
                  {props.title}
                </p>
                <p className="type-callout text-material-medium-3">
                  {props.description}
                </p>
              </div>
              {/* <div className="h-[3px] w-full rounded-full bg-material-main-1" /> */}
            </td>
            <td
              className={classNames(
                cell,
                roundingRight,
                variant.type === "droppel" ? "w-1" : "w-4"
              )}
            />
          </tr>
        )

      const {
        icon,
        href,
        rightLabel,
        rightIcon = (
          <img
            src="/icons/chevron-right-grey-small.svg"
            width={7}
            height={11}
            alt="Icon right"
          />
        ),
        onClick,
        modal,
        children,
        className,
        list
      } = props;

      let click = onClick || (list && (() => openSublist(list))) || (modal && (() => setIsModalOpen(true))) || undefined;

      const rightSide = rightLabel !== undefined || href || click ? (
        <>
          <div className="w-2" />
          {rightLabel}
          {!!(href || click) && variant.type === "default" && (
            <div className="ml-4 transform group-hover:translate-x-1 transition-transform">
              {rightIcon}
            </div>
          )}
        </>
      ) : undefined;

      if (!click && href) click = () => push(href);

      return (
        <motion.tr
          variants={{
            hidden: {
              opacity: 1,
            },
            visible: {
              opacity: 1,
            },
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={classNames(className, "w-full overflow-hidden group", {
            "cursor-pointer": click,
            "hover:bg-material-main-1": !!click && variant.type === "droppel",
            "type-callout text-material-heavy-1": isReadonly,
          })}
          onClick={click}
        >
          <td
            className={classNames(
              variant.type === "droppel" ? "w-1" : "w-4",
              "border-transparent",
              cellBg,
              roundingLeft,
            )}
          >
            {modal && (
              <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                {...modal}
                title={modal.title ?? props.children}
              />
            )}
            {icon && (
              <div className="flex flex-row justify-center items-center">
                {icon}
              </div>
            )}
          </td>
          <td className={classNames(cell)}>
            <div className="flex flex-row justify-between gap-5">
              <div
                className={classNames(
                  "flex flex-row items-center flex-grow",
                  isReadonly ? "py-3 min-h-[21px]" : "min-h-[44px] py-2",
                )}
              >
                {children}
              </div>
              {rightSide && (
                <>
                  {/* {variant.type === "default" && <div className="w-5 ml-auto" />} */}
                  <div
                    className={classNames(
                      "flex flex-row justify-end items-center text-right relative flex-grow",
                      isReadonly ? "py-3 min-h-[21px]" : "min-h-[44px] py-2",
                    )}
                  >
                    {rightSide}
                  </div>
                </>
              )}
            </div>
          </td>
          {/* {!!rightSide && (
            <td className={classNames(cell, "pl-2")}>
            </td>
          )} */}
          <td
            width={(variant.type === "droppel" ? 1 : 4) * 4}
            className={classNames(
              cell,
              roundingRight,
              // variant.type === "droppel" ? "w-1" : "w-4",
            )}
          />
        </motion.tr>
      );
    }
  }
});

export const ListItem = memo<ListItemProps>((props) => {
  const { attach, detatch, listId } = useContext(ListContext);
  const id = useId();

  useEffect(() => () => detatch(id), [attach, detatch, id, listId]);
  useEffect(() => attach(id, props), [attach, detatch, id, props]);

  if (listId) return <></>;

  return (
    <List>
      <ListItem {...props} />
    </List>
  );
});

export const ListHeader = memo<Omit<ListHeaderProps, 'type'>>((props) => <ListItem {...props} type="header" />);

export const ListSeperator = memo(() => <ListItem type="seperator" />);

export type ListProps = {
  label?: ReactNode;
  ctas?: LabelProps["ctas"];
  variant?: ListVariant;
  className?: string;
  items?: ListItemProps[];
};

export const List = memo<PropsWithChildren<ListProps>>(
  ({ children, label, ctas, variant = { type: "default" }, className }) => {
    const [items, setItems] = useState<{
      [id: string]: { index: number; item?: ListItemProps };
    }>({});
    const itemsArray = useMemo(() => Object.entries(items), [items]);
    const listId = useId();
    const [openSublist, setOpenSublist] = useState<SublistProps>();

    const contextValue = useMemo<ListContextType>(
      () => ({
        attach(id, item) {
          setItems((prevItems) => ({
            ...prevItems,
            [id]: {
              item,
              index: prevItems[id]?.index ?? Object.keys(prevItems).length,
            },
          }));
        },
        detatch(id) {
          setItems((prevItems) => {
            const newItems = { ...prevItems };
            delete newItems[id].item;
            return newItems;
          });
        },
        listId,
        variant,
      }),
      [listId],
    );

    return (
      <ListContext.Provider value={contextValue}>
        <div className="flex flex-col gap-2 w-full relative">
          {!!(label || ctas) && <Label ctas={ctas}>{label}</Label>}
          {openSublist && <div className="absolute left-"><List {...openSublist} variant={{ type: 'droppel', side: 'left' }} /></div>}
          <motion.table
            variants={
              variant.type === "droppel"
                ? {
                  closed: {
                    opacity: 0,
                    y: -8,
                    scale: 0.8,
                    transition: { ease: "backOut", duration: 0.15 },
                  },
                  open: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { ease: "backOut", duration: 0.3 },
                  },
                }
                : {
                  closed: { opacity: 0 },
                  open: { opacity: 1 },
                }
            }
            initial="closed"
            animate="open"
            exit="closed"
            className={classNames(
              className,
              "w-full table-auto overflow-auto",
              variant.type !== "droppel"
                ? "origin-top-left"
                : [
                  variant.side === "left"
                    ? "origin-top-left"
                    : "origin-top-right",
                  "border-spacing-y-[2px] rounded-xl min-w-[280px] px-1 py-0.5 border-separate shadow-modal bg-material",
                ],
            )}
          >
            <colgroup>
              <col
                style={{
                  width: itemsArray.every(([, { item }]) => {
                    if (!item) return true;
                    switch (item.type) {
                      case "seperator":
                      case "header":
                        return true;
                      default:
                        return !item.icon;
                    }
                  })
                    ? "1rem"
                    : "auto",
                }}
              />
              <col style={{ width: "auto", overflow: "auto" }} />
              <col style={{ width: "1rem" }} />
            </colgroup>
            <tbody>
              <AnimatePresence>
                {itemsArray
                  .filter(([, { item }]) => !!item)
                  .map(([id, { item }], i, arr) => (
                    <RenderedListItem
                      {...item}
                      key={id + i}
                      last={i === arr.length - 1}
                      first={i === 0}
                      openSublist={setOpenSublist}
                    />
                  ))}
              </AnimatePresence>
            </tbody>
          </motion.table>
          {children}
        </div>
      </ListContext.Provider>
    );
  },
);

export const useIsInList = () => useContext(ListContext).listId !== undefined;
