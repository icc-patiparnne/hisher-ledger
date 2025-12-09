import { Meta, StoryObj } from '@storybook/react';
import BreadcrumbDemo from '../demo/breadcrumb-demo';

const meta = {
  title: 'Shadcn/breadcrumb',
  component: BreadcrumbDemo,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof BreadcrumbDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

// Variant
export const Default: Story = {
  args: {},
};
