import { Meta, StoryObj } from '@storybook/react';
import { DatePickerForm } from '../../demo/date/date-picker-with-form';

const meta = {
  title: 'Shadcn/form',
  component: DatePickerForm,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DatePickerForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DatePickerFormDemo: Story = {
  args: {},
};
