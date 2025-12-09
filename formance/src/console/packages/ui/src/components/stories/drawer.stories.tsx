import type { Meta, StoryObj } from '@storybook/react';

import { DrawerDemo } from '../demo/drawer-demo';

const meta = {
  title: 'Shadcn/drawer',
  component: DrawerDemo,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DrawerDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
