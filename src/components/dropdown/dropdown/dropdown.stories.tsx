import type { Meta, StoryObj } from '@storybook/react';

import { DropdownComponent } from '../dropdown.component';
import { useState } from 'react';

const meta: Meta<typeof DropdownComponent> = {
  title: 'UI/Dropdown',
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <DropdownComponent className='m-auto' {...args} value={value} onChange={setValue} />
  },
  args: {
    placeholder: 'Select an option',
    options: [
      {
        value: 'free-roll',
        label: 'Freeroll',
      },
      {
        value: 'direct-debit',
        label: 'Direct debit',
      }
    ]
  }
};

export default meta;
type Story = StoryObj<typeof DropdownComponent>;

export const Default: Story = {};
export const DefaultOpen: Story = { args: { isOpenInitially: true } };
export const MobileDropdownCompnent: Story = {
  globals: {
    viewport: 'mobile1',
  },
}