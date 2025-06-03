import type { Meta, StoryObj } from '@storybook/react';

import { List, ListItem } from 'components/list';
import { useState } from 'react';

import { NumberInputComponent } from '../number-input.component';
import { Num } from '../raw-number-input.component';

const meta: Meta<typeof NumberInputComponent> = {
  title: 'Inputs/Number',
  render: (args) => {
    const [value, setValue] = useState<Num | undefined>(args.value);
    return <NumberInputComponent {...args} value={value} onChange={setValue} />
  },
  args: {
    label: 'Example label',
    value: 123.4567,
    step: 0.0001,
    min: -1000,
    max: 1000,
    maxDecimals: 1000,
  }
};

export default meta;
type Story = StoryObj<typeof NumberInputComponent>;

export const Default: Story = {};
export const WithoutLabel: Story = { args: { label: undefined } };
export const Empty: Story = { args: { value: undefined } };
export const ReallyPreciseFloat: Story = { args: { step: '0.000000000001' } };
export const QuickActions: Story = {
  args: {
    minQuickAction: true,
    maxQuickAction: true,
  }
};
export const InList: Story = {
  args: { minQuickAction: true, maxQuickAction: true },
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

export const MinMaxInList: Story = {
  decorators: [
    (Story) => (
      <List>
        <Story />
      </List>
    )
  ],
  args: {
    min: 0,
    max: 99,
    step: 1,
  }
}

export const WithSymbolInList: Story = {
  decorators: [
    (Story) => (
      <List>
        <Story />
      </List>
    )
  ],
  args: {
    symbol: 'USD',
  }
}