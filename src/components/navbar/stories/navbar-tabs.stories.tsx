import type { Meta, StoryObj } from '@storybook/react';

import { NavbarTabComponent } from '../navbar-tab.component';

const meta: Meta<typeof NavbarTabComponent> = {
  title: 'Layout/Navbar/Tab',
  component: NavbarTabComponent,
  args: {
  }
};

export default meta;
type Story = StoryObj<typeof NavbarTabComponent>;

export const Seperator: Story = { args: { type: "seperator" } };

export const Tab: Story = {
  args: {
    label: "Tab",
    type: "link",
  }
};

export const ComingSoon: Story = {
  args: {
    label: "Tab",
    type: "link",
    comingSoon: true,
  }
};