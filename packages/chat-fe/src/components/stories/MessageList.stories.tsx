import type { Meta, StoryObj } from '@storybook/react';

import MessageList from '../Chat/MessageList';

const meta: Meta<typeof MessageList> = {
  component: MessageList,
};

export default meta;
type Story = StoryObj<typeof MessageList>;

export const Default: Story = {};
