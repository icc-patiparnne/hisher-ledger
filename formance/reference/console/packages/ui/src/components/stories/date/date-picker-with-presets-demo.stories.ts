import { Meta, StoryObj } from '@storybook/react';
import { DatePickerWithPresets } from '../../demo/date/date-picker-with-presets-demo';

const meta = {
  title: 'Shadcn/date',
  component: DatePickerWithPresets,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DatePickerWithPresets>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DatePickerPresets: Story = {
  name: 'DatePickerWithPresets',
  args: {},
};
