import type { Meta, StoryObj } from '@storybook/react';

import { TextInputComponent } from '../text-input.component';
import { List, ListItem } from 'components/list';
import { useState } from 'react';

const meta: Meta<typeof TextInputComponent> = {
  title: 'Inputs/Text',
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(args.value);
    return <TextInputComponent {...args} value={value} onChange={setValue} />
  },
  args: {
    label: 'Example label',
    value: 'ASDF asdf 33',
  }
};

export default meta;
type Story = StoryObj<typeof TextInputComponent>;

export const Default: Story = {};
export const WithoutLabel: Story = { args: { label: undefined } };
export const Empty: Story = { args: { value: undefined } };
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
