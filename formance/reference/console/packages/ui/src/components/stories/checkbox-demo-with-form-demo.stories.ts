import { Meta, StoryObj } from '@storybook/react';
import { CheckboxDemoWithFormDemo } from '../demo/checkbox-demo-with-form-demo';

const meta = {
  title: 'Shadcn/form',
  component: CheckboxDemoWithFormDemo,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CheckboxDemoWithFormDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CheckboxDemoWithForm: Story = {
  name: 'Checkbox Demo With Form Demo',
  args: {},
};
