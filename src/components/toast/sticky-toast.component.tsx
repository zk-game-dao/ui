import { memo, useEffect, useId } from "react";

import { useToast } from "./toast-provider.context";
import { ToastComponentProps } from "./toast.component";

export const StickyToastComponent = memo<Omit<ToastComponentProps, "sticky">>(
  (props) => {
    const { addStickyToast } = useToast();
    const id = useId();

    useEffect(() => addStickyToast(props, id), [props.ctas, props.error, id]);

    return <></>;
  },
);
