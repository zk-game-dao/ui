import type { Meta, StoryObj } from '@storybook/react';

import { ErrorComponent, UserError as UE } from '../error.component';

const meta: Meta<typeof ErrorComponent> = {
  title: 'UI/Error',
  component: ErrorComponent,
  args: {
  }
};

export default meta;
type Story = StoryObj<typeof ErrorComponent>;

export const UserError: Story = { args: { error: new UE("Test error") } };
export const BackendError: Story = { args: { error: { SuperTest: "here is an example backend error" } } };
export const UnknownError: Story = { args: { error: new Error("Uncaught (in promise) Error: Phantom isn't installed") } };