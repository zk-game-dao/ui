import type { Meta, StoryObj } from '@storybook/react';

import { LayoutComponent, LayoutProvider, OverrideLayoutConfigComponent, ProvideLayoutConfig } from '../layout.component';
// import { List, ListItem } from 'components/list';
import { useState } from 'react';

const meta: Meta<typeof OverrideLayoutConfigComponent> = {
  title: 'Layout/Override Layout Config',
  component: OverrideLayoutConfigComponent,
  decorators: [
    (Story) => (
      <ProvideLayoutConfig
        navbarTabs={[
          { type: 'link', label: 'Link 1', href: '/link1' },
          { type: 'link', label: 'Link 2', href: '/link2' },
          { type: 'link', label: 'Link 3', href: '/link3' },
          { type: 'link', label: 'Link 4', href: '/link4' },
        ]}
        footerLinks={[]}
        NavbarUserComponent={() => <>User</>}
      >
        <LayoutProvider>
          <Story />
        </LayoutProvider>
      </ProvideLayoutConfig>
    )
  ],
  args: {
    isOverlay: true,
    NavbarUserComponent: () => <>User overriden</>,
  }
};

export default meta;
type Story = StoryObj<typeof OverrideLayoutConfigComponent>;

export const Default: Story = {};
