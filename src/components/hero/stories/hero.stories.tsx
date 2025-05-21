import type { Meta, StoryObj } from '@storybook/react';

import { HeroComponent } from '../hero.component';

const meta: Meta<typeof HeroComponent> = {
  title: 'Layout/Hero',
  component: HeroComponent,
  args: {
    title: 'Hero Title',
    subTitle: 'Hero Title',
    ctas: [
      { children: 'Create table', onClick: () => { } },
      { children: 'Go to lobby', href: '/lobby', filled: true }
    ],
  }
};

export default meta;
type Story = StoryObj<typeof HeroComponent>;

export const Default: Story = {};