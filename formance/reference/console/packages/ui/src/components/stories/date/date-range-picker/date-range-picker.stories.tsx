import { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from '../../../date';

const meta = {
  title: 'date/DateRangePicker',
  component: DateRangePicker,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

// Variant
export const Default: Story = {
  args: {},
};
