import type { Meta, StoryObj } from '@storybook/react';

import { ButtonComponent } from '../button.component';

const meta: Meta<typeof ButtonComponent> = {
  title: 'UI/Button/Default',
  component: ButtonComponent,
  args: {
    children: "Button",
  }
};

export default meta;
type Story = StoryObj<typeof ButtonComponent>;

export const Green: Story = { args: { color: 'green' } };
export const Orange: Story = { args: { color: 'orange' } };
export const Black: Story = { args: { color: 'black' } };
export const Purple: Story = { args: { color: 'purple' } };
export const Blue: Story = { args: { color: 'blue' } };
export const Red: Story = { args: { color: 'red' } };
export const Grey: Story = { args: { color: 'grey' } };

export const Primary: Story = { args: { purpose: 'primary' } };
export const Secondary: Story = { args: { purpose: 'secondary' } };
export const Error: Story = { args: { purpose: 'error' } };

export const OutlineGreen: Story = { args: { color: 'green', variant: 'outline' } };
export const OutlineOrange: Story = { args: { color: 'orange', variant: 'outline' } };
export const OutlineBlack: Story = { args: { color: 'black', variant: 'outline' } };
export const OutlinePurple: Story = { args: { color: 'purple', variant: 'outline' } };
export const OutlineBlue: Story = { args: { color: 'blue', variant: 'outline' } };
export const OutlineRed: Story = { args: { color: 'red', variant: 'outline' } };
export const OutlineGrey: Story = { args: { color: 'grey', variant: 'outline' } };

export const NakedGreen: Story = { args: { color: 'green', variant: 'naked' } };
export const NakedOrange: Story = { args: { color: 'orange', variant: 'naked' } };
export const NakedBlack: Story = { args: { color: 'black', variant: 'naked' } };
export const NakedPurple: Story = { args: { color: 'purple', variant: 'naked' } };
export const NakedBlue: Story = { args: { color: 'blue', variant: 'naked' } };
export const NakedRed: Story = { args: { color: 'red', variant: 'naked' } };
export const NakedGrey: Story = { args: { color: 'grey', variant: 'naked' } };
