import type { Meta, StoryObj } from '@storybook/react';

import { MouseHighlightComponent } from '../mouse-highlight.component';

const meta: Meta<typeof MouseHighlightComponent> = {
  title: 'Mouse Highlight',
  component: MouseHighlightComponent,
  args: {
    className: 'size-128 border',
    children: (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-2xl">Hover me</div>
        <div className="text-sm">I am a child</div>
      </div>
    ),
  }
};

export default meta;

type Story = StoryObj<typeof MouseHighlightComponent>;

export const MouseHighlight: Story = {};
