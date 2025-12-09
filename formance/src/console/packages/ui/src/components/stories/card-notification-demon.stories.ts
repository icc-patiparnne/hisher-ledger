import { Meta, StoryObj } from '@storybook/react';
import { CardDemoNotification } from '../demo/card-notification-demo';

const meta = {
  title: 'Shadcn/card',
  component: CardDemoNotification,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CardDemoNotification>;

type Story = StoryObj<typeof meta>;

export const CardNotificationDemo: Story = {
  args: {},
};
export default meta;
