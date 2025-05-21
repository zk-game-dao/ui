import type { Meta, StoryObj } from '@storybook/react';

import { TimeInputComponent } from '../time-input.component';
import { List, ListItem } from 'components/list';
import { useState } from 'react';
import { DateToBigIntTimestamp } from 'utils';

const dt = new Date('2023-10-01T12:00:00Z');

const meta: Meta<typeof TimeInputComponent> = {
  title: 'Inputs/Time Input',
  render: (args) => {
    const [value, setValue] = useState<bigint | undefined>(args.seconds);
    return <TimeInputComponent {...args} seconds={value} onChangeSeconds={setValue} />
  },
  args: {
    label: 'Example label',
    seconds: 1234n,
  }
};

export default meta;
type Story = StoryObj<typeof TimeInputComponent>;

export const Default: Story = {};
export const WithoutLabel: Story = { args: { label: undefined } };
export const Empty: Story = { args: { seconds: undefined } };
export const WidthSeconds: Story = { args: { showSeconds: true } };
export const InList: Story = {
  decorators:
    [
      (Story) => (
        <List>
          <ListItem>Hello</ListItem>
          <Story />
          <ListItem>World</ListItem>
        </List>
      )
    ]
};
