import { Meta, StoryObj } from '@storybook/react';
import { DatePickerWithRange } from '../../demo/date/date-picker-with-range-demo';

//meta
const meta = {
  title: 'Shadcn/date',
  component: DatePickerWithRange,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DatePickerWithRange>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DatePickerWithRangeDemo: Story = {
  name: 'DatePickerWithRange',
  args: {},
};
