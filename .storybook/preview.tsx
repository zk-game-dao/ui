import type { Preview } from '@storybook/react';
import '../styles-local.css';

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ProvideTheme } from '../src/context/theme.context';
import { ProvideConfig } from '../src/context/config.context';

declare global {
  interface BigInt {
    toJSON(): Number;
  }
}

BigInt.prototype.toJSON = function () { return Number(this) }

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'zkpoker',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'zkpoker', icon: 'paintbrush', title: 'zkpoker' },
          { value: 'purepoker', icon: 'paintbrush', title: 'PurePoker' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'zkpoker',
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col h-screen">
        <Story />
      </div>
    ),
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
    (Story, c) => (
      <ProvideConfig theme={c.globals.theme}>
        <ProvideTheme isDark>
          <Story />
        </ProvideTheme>
      </ProvideConfig>
    ),
  ],
};

export default preview;