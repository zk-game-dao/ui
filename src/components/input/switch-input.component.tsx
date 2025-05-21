import { memo, ReactNode } from "react";

import { ListItem } from "../list/list.component";
import {
  SwitchComponent,
  SwitchComponentProps,
} from "../switch/switch.component";

type SwitchProps = { label?: ReactNode } & SwitchComponentProps;

export const SwitchInputComponent = memo<SwitchProps>(
  ({ label, ...switchProps }) => (
    <ListItem rightLabel={<SwitchComponent {...switchProps} />}>
      {label}
    </ListItem>
  ),
);
