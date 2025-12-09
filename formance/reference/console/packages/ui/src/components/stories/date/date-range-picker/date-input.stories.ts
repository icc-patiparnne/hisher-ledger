import { Meta, StoryObj } from '@storybook/react';
import { DateInput } from '../../../date';

const meta = {
  title: 'date/DateInput',
  component: DateInput,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

// Variant
export const Default: Story = {
  args: {},
};
