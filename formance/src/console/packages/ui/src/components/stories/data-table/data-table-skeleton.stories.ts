import { Meta, StoryObj } from '@storybook/react';
import { DataTableSkeleton } from '../../data-table';

//meta
const meta = {
  title: 'Shadcn/data-table',
  component: DataTableSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DataTableSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DataTableSkeletonStory: Story = {
  name: 'DataTableSkeleton',
  args: {
    columnCount: 4,
    rowCount: 10,
    searchableColumnCount: 2,
    filterableColumnCount: 2,
    showViewOptions: true,
  },
};
