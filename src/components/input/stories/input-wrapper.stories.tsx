import type { Meta, StoryObj } from '@storybook/react';

import { InputWrapperComponent } from '../input-wrapper.component';

const meta: Meta<typeof InputWrapperComponent> = {
  title: 'Inputs/Wrapper',
  component: InputWrapperComponent,
  args: {
    children: (
      <div className='flex flex-row justify-between w-full'>
        <p>Example left</p>
        <p>Example right</p>
      </div>
    ),
    quickActions: [
      { label: 'Action 1', action: () => alert('Action 1') },
      { label: 'Action 2', action: () => alert('Action 2') },
    ],
    showClear: true,
    onClear: () => alert('Clear'),
  }
};

export default meta;
type Story = StoryObj<typeof InputWrapperComponent>;

export const Default: Story = {};