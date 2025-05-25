import type { Meta, StoryObj } from '@storybook/react';


import { BannerComponent } from '../banner.component';

const meta: Meta<typeof BannerComponent> = {
  title: 'Layout/Banner',
  component: BannerComponent,
  args: {
    href: '#',
    children: (
      <p>This is a test banner</p>
    )
  }
};

export default meta;
type Story = StoryObj<typeof BannerComponent>;

export const Default: Story = {};
