import type { Meta, StoryObj } from '@storybook/react';

import { DateInputComponent } from '../date-input.component';
import { List, ListItem } from 'components/list';
import { useState } from 'react';
import { DateToBigIntTimestamp } from 'utils';

const dt = new Date('2023-10-01T12:00:00Z');

const meta: Meta<typeof DateInputComponent> = {
  title: 'Inputs/Date Input',
  render: (args) => {
    const [value, setValue] = useState<bigint | undefined>(args.datetime_ns);
    return <DateInputComponent {...args} datetime_ns={value} onChange={setValue} />
  },
  args: {
    label: 'Example label',
    datetime_ns: DateToBigIntTimestamp(dt),
  }
};

export default meta;
type Story = StoryObj<typeof DateInputComponent>;

export const Default: Story = {};
export const WithoutLabel: Story = { args: { label: undefined } };
export const Empty: Story = { args: { datetime_ns: undefined } };
export const NoTime: Story = { args: { showTime: false } };
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
