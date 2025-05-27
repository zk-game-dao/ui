import type { Meta, StoryObj } from '@storybook/react';

import { ProvideUI } from '../../../context';
import { LayoutComponent, LayoutProvider, ProvideLayoutConfig } from '../layout.component';

type Props = {
  footer?: boolean;
  banner?: boolean;
  fullScreen?: boolean;
}

const meta: Meta<Props> = {
  title: 'Layout/Layout',
  render: (args) => {
    return (
      <ProvideLayoutConfig
        navbarTabs={[]}
        footerLinks={[]}
        isOverlay={args.fullScreen}
        NavbarUserComponent={() => <>User</>}
      >
        <LayoutProvider>
          <LayoutComponent {...args}>
            {Array.from({ length: 10 }, (_, i) => (
              <p key={i} className='container py-10'>
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
              </p>
            ))}
          </LayoutComponent>
        </LayoutProvider>
      </ProvideLayoutConfig>
    );
  },
  decorators: [
    (Story, { globals, args }) => {
      return (
        <ProvideUI
          theme={globals.theme}
          banner={args.banner ? {
            children: <p>This is an example banner 😳</p>,
            onClick: () => alert('Banner clicked!'),
          } : undefined}
        >
          <Story />
        </ProvideUI>
      )
    }
  ],
  args: {
    footer: true,
    fullScreen: false,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<Props>;

export const Default: Story = {};
export const WithBanner: Story = {
  args: { banner: true }
};
export const WithBannerFullScreen: Story = {
  args: { banner: true, fullScreen: true }
};
