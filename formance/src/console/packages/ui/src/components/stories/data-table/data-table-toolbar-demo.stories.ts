import { Meta, StoryObj } from '@storybook/react';
import { DataTableToolbarDemo } from '../../demo/data-table/data-table-toolbar-demo';

//meta
const meta = {
  title: 'Shadcn/data-table',
  component: DataTableToolbarDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DataTableToolbarDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DataTableToolbarDemoStory: Story = {
  name: 'DataTableToolbarDemo',
  args: {
    searchConfig: [
      {
        placeholder: 'Search name',
        columnKey: 'name',
      },
      {
        placeholder: 'Search email',
        columnKey: 'email',
      },
    ],
    filtersConfig: [
      {
        title: 'Status',
        column: 'status',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ],
      },
      {
        title: 'Columns',
        column: 'name',
        options: [
          { label: 'Status', value: 'status' },
          { label: 'Name', value: 'name' },
          { label: 'Email', value: 'email' },
        ],
      },
    ],
  },
};
