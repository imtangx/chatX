import type { Meta, StoryObj } from '@storybook/react';

import MessageItem from '../Chat/MessageItem';

const meta: Meta<typeof MessageItem> = {
  component: MessageItem,
};

export default meta;
type Story = StoryObj<typeof MessageItem>;

export const Default: Story = {};
