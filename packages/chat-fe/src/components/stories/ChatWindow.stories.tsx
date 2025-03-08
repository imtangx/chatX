import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import ChatWindow from '../Chat/ChatWindow';

const meta: Meta<typeof ChatWindow> = {
  component: ChatWindow,
  decorators: [
    Story => (
        <Story />
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatWindow>;

export const Default: Story = {}; 