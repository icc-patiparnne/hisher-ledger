import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DateRangePicker } from '../../date';

const meta = {
  title: 'Shadcn/date',
  args: {
    variant: 'default',
  },
  render: () => (
    <DateRangePicker
      onUpdate={(values) => console.log(values)}
      initialDateFrom="2023-01-01"
      initialDateTo="2023-12-31"
      align="start"
      locale="en-GB"
      showCompare={false}
    />
  ),
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<{}>;
export default meta;

type Story = StoryObj<typeof meta>;

//colors
export const DateRangeDemo: Story = {
  args: {},
};
