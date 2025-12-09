import React from 'react';

import { Meta, StoryObj } from '@storybook/react';
import { buttonVariants } from '../button';
import { Skeleton } from '../skeleton';
import { Loader, LoaderDataTable } from '../loader';

const meta = {
  title: 'Shadcn/skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SkeletonLoader: Story = {
  args: {},
  render: () => <Loader />,
};

type LoaderTableProps = StoryObj<typeof LoaderDataTable>;

export const SkeletonLoaderTable: LoaderTableProps = {
  args: {
    rows: 4,
    columns: 4,
    hasToolbar: true,
    hasPagination: true,
  },
  argTypes: {
    columns: {
      control: { type: 'number' },
    },
    rows: {
      control: { type: 'number' },
    },
    hasToolbar: {
      control: { type: 'boolean' },
    },
    hasPagination: {
      control: { type: 'boolean' },
    },
  },
  render: (args) => <LoaderDataTable {...args} />,
};

export const SkeletonCardNotification: Story = {
  args: {},
  render: () => (
    <>
      <Skeleton className="flex h-64 w-[250px] flex-col gap-2 bg-slate-300 p-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-20 bg-slate-400" />
          <Skeleton className="h-4 w-20 bg-slate-400" />
        </div>

        <Skeleton className="rounred h-16 w-full bg-slate-400 " />
        <Skeleton className="h-4 w-full bg-slate-400" />
        <Skeleton className="h-4 w-full bg-slate-400" />
        <Skeleton className="h-4 w-full bg-slate-400" />

        <Skeleton
          className={
            buttonVariants({
              variant: 'default',
              size: 'default',
            }) + ' w-full bg-slate-400'
          }
        />
      </Skeleton>
    </>
  ),
};
