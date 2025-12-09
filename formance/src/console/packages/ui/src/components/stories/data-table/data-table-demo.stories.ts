import { Meta, StoryObj } from '@storybook/react';
import { DataTableDemo } from '../../demo/data-table/data-table-demo';

//meta
const meta = {
  title: 'Shadcn/data-table',
  component: DataTableDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DataTableDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DataTableDemoStory: Story = {
  name: 'DataTableDemo',
  args: {},
};
