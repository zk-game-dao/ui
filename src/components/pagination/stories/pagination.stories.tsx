import type { Meta, StoryObj } from '@storybook/react';

import { PaginationComponent } from '../pagination.component';
import { useState } from 'react';

const meta: Meta<typeof PaginationComponent> = {
  title: 'UI/Pagination',
  render: (args) => {
    const [value, setValue] = useState(args.currentPage ?? 0);
    return (
      <PaginationComponent
        {...args}
        currentPage={value}
        onPageChange={setValue}
      />
    )
  },
  args: {
    totalPages: 10,

  }
};

export default meta;
type Story = StoryObj<typeof PaginationComponent>;

export const Default: Story = {

};