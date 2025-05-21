import type { Meta, StoryObj } from '@storybook/react';

import { FooterComponent } from '../footer.component';

const meta: Meta<typeof FooterComponent> = {
  title: 'Layout/Footer',
  component: FooterComponent,
  args: {
  }
};

export default meta;
type Story = StoryObj<typeof FooterComponent>;

export const Default: Story = {};
export const FullWidth: Story = { args: { fullWidth: true } };
