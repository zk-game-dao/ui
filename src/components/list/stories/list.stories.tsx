import type { Meta, StoryObj } from '@storybook/react';

import { List, ListItem } from '../list.component';
import { useState } from 'react';
import { NumberInputComponent, TextInputComponent } from 'components/input';

const meta: Meta = {
  title: 'UI/List',

};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState([
      { index: 0, rightLabel: 'Right content' },
      { index: 1 },
      { index: 2 },
    ]);
    return (
      <List ctas={[{
        label: 'Add item', onClick: () => {
          setItems((prev) => [...prev, { index: prev.reduce((acc, item) => Math.max(acc, item.index), -1) + 1 }]);
        }
      }]}>
        {items.map(({ index, rightLabel }) => (
          <ListItem
            key={index}
            rightLabel={rightLabel}
            onClick={() => {
              setItems((prev) => prev.filter((item) => index !== item.index));
            }}
          >
            {index + 1}
          </ListItem>
        ))}
      </List>
    )
  }
};

export const Inputs: Story = {
  render: () => (
    <List>
      <TextInputComponent onChange={() => { }} label="Text input" />
      <NumberInputComponent onChange={() => { }} value={1234.43523134} label="Number input" />
    </List>
  )
}

export const InputsSmallScreen: Story = {
  render: () => (
    <div className='w-64 mx-auto'>
      <List >
        <TextInputComponent onChange={() => { }} label="Text input" />
        <NumberInputComponent onChange={() => { }} value={1234.43523134} label="Number input" />
      </List>
    </div>
  )
}