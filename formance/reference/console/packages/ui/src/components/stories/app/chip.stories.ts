import { padNumber } from '@platform/utils';
import { Meta, StoryObj } from '@storybook/react';
import { Chip as ChipComponent } from '../../app/chip';

const meta = {
  title: 'App/chip',
  component: ChipComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { variant: 'select' },
      options: [
        'worldAccount',
        'defaultAccount',
        'ledger',
        'asset',
        'string',

        'padNumber',
        'number',
        'numberPositive',
        'numberNegative',
        'stats',

        'NEW_TRANSACTION',
        'SET_METADATA',
        'REVERTED_TRANSACTION',

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
      control: { variant: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Chip: Story = {
  args: {
    variant: 'emerald',
    label: 'world',
    size: 'md',
  },
};

export const ChipCanCopy: Story = {
  args: {
    variant: 'emerald',
    label: 'users:1234:main',
    copyMode: 'click',
    copyValue: 'users:1234:main',
    size: 'md',
  },
};

export const ChipHasMaxWidth: Story = {
  args: {
    variant: 'emerald',
    label:
      'users:1234:main:and:this:is:very-long:1243567678:pattern:users:1234:main:and:this:is:very-long:1243567678:pattern',
    maxWidth: 'md',
    size: 'md',
  },
};

export const ChipShouldFormatLabel: Story = {
  args: {
    variant: 'emerald',
    label:
      'coupons:1234:black-friday:main:1234567890:default:12434565:this-is-long-one',
    shouldFormatLabel: true,
    size: 'md',
  },
};

export const ChipTypePadNumber: Story = {
  args: {
    variant: 'emerald',
    label: padNumber(12),
    size: 'md',
  },
};

export const ChipTypeNumber: Story = {
  args: {
    variant: 'emerald',
    label: '123 000',
    size: 'md',
  },
};
