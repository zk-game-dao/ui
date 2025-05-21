import type { Meta, StoryObj } from '@storybook/react';

import { NavbarComponent } from '../navbar.component';
import { LayoutConfig, ProvideLayoutConfig } from 'components/layout';

type Props = Pick<LayoutConfig, 'isOverlay'>;

const meta: Meta<Props> = {
  title: 'Layout/Navbar',
  render: (props) => (
    <ProvideLayoutConfig
      navbarTabs={[
        { label: "Tab 1", type: "link", href: "/tab1" },
        { label: "Tab 2", type: "link", comingSoon: true },
        { label: "Tab 3", type: "link", href: "/tab3" },
        { type: 'seperator' },
        { label: "Tab 4", type: "link", href: "/tab4" },
        { label: "Tab 5", type: "link", href: "/tab5" },
      ]}
      footerLinks={[]}
      isOverlay={props.isOverlay}
      NavbarUserComponent={() => <>User</>}
    >
      <NavbarComponent />
    </ProvideLayoutConfig>
  )
};

export default meta;
type Story = StoryObj;

export const Navbar: Story = {};
export const MobileNavbar: Story = {
  globals: {
    viewport: 'mobile1',
  }
};
export const TabletNavbar: Story = {
  globals: {
    viewport: 'mobile2',
    viewportRotated: true,
  }
};
export const NavbarAsOverlay: Story = {
  args: {
    isOverlay: true,
  }
};