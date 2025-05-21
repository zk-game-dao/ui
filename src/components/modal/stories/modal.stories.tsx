import type { Meta, StoryObj } from '@storybook/react';

import { Modal, ModalFooterPortal } from '../modal';
import { TitleTextComponent } from 'components/title-text';
import { memo, useState } from 'react';
import { ButtonComponent } from 'components/button';
import { ProvideModalStack } from 'context/modal-stack.context';

const ExampleComponent = memo<{ onClose(): void; }>(({ onClose }) => (
  <>
    <TitleTextComponent title="Example title" text="Example text" />
    <TitleTextComponent title="Example title" text="Example text" />
    <TitleTextComponent title="Example title" text="Example text" />
    <TitleTextComponent title="Example title" text="Example text" />
    <TitleTextComponent title="Example title" text="Example text" />
    <TitleTextComponent title="Example title" text="Example text" />
    <TitleTextComponent title="Example title" text="Example text" />
    <TitleTextComponent title="Example title" text="Example text" />
    <TitleTextComponent title="Example title" text="Example text" />
    <TitleTextComponent title="Example title" text="Example text" />
    <TitleTextComponent title="Example title" text="Example text" />

    <ModalFooterPortal>
      <ButtonComponent variant="naked" onClick={onClose}>Cancel</ButtonComponent>
      <ButtonComponent>Submit</ButtonComponent>
    </ModalFooterPortal>
  </>
));

type Props = {
  amountOfModals?: number;
}

const meta: Meta<Props> = {
  title: 'UI/Modal',
  render: ({ amountOfModals = 1 }) => {

    const [shownAmountOfModals, setShownAmountOfModals] = useState(amountOfModals);

    return (
      <>
        {Array.from({ length: shownAmountOfModals }, (_, i) => (
          <Modal
            key={i}
            open
            title={`Modal ${i + 1}`}
            onClose={() => setShownAmountOfModals((prev) => prev - 1)}
          >
            <ExampleComponent onClose={() => setShownAmountOfModals((prev) => prev - 1)} />
          </Modal>
        ))}
      </>
    )
  },
  args: {
    amountOfModals: 1,
  },
  decorators: [
    (Story) => (
      <ProvideModalStack>
        <Story />
      </ProvideModalStack>
    ),
  ]
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const MobileDefault: Story = {
  globals: {
    viewport: 'mobile1',
  }
};
export const TabletDefault: Story = {
  globals: {
    viewport: 'mobile2',
    viewportRotated: true,
  }
};

export const TwoModalsStack: Story = {
  args: {
    amountOfModals: 2,
  },
};
export const ThreeModalsStack: Story = {
  args: {
    amountOfModals: 3,
  },
};
export const MobileThreeModalsStack: Story = {
  args: {
    amountOfModals: 3,
  },
  globals: {
    viewport: 'mobile1',
  }
};