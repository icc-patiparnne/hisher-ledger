import React from 'react';

import { Meta, StoryObj } from '@storybook/react';
import { Badge, TBadgeProps, badgeVariants } from '../badge';
//meta
const meta = {
  title: 'Shadcn/badge',
  render: (args) => <Badge {...args}>{args.children}</Badge>,
  tags: ['autodocs'],
  args: {
    variant: 'primary',
    children: 'Badge Formance',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'outline',
        'valid',
        'destructive',
        'emerald',
        'slate',
        'lilac',
        'gold',
        'cobalt',
        'mint',
      ],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<TBadgeProps>;

export default meta;

type Story = StoryObj<typeof meta>;

//colors
export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};
export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};
export const Valid: Story = {
  args: {
    variant: 'valid',
  },
};
export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
};
export const Emerald: Story = {
  args: {
    variant: 'emerald',
  },
};
export const Slate: Story = {
  args: {
    variant: 'slate',
  },
};
export const Lilac: Story = {
  args: {
    variant: 'lilac',
  },
};
export const Gold: Story = {
  args: {
    variant: 'gold',
  },
};
export const Cobalt: Story = {
  args: {
    variant: 'cobalt',
  },
};
export const Mint: Story = {
  args: {
    variant: 'mint',
  },
};

export const LinkWithStyleBadge: Story = {
  render: ({ variant, children }) => (
    // <Link to="#" className={badgeVariants({ variant })}>
    <>({children}),</>
  ),
  // </Link>
};
