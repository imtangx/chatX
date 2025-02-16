import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import ChatWindow from '../Chat/ChatWindow';
import {DialogProvider} from '../../context/DialogContext'

const meta: Meta<typeof ChatWindow> = {
  component: ChatWindow,
  decorators: [
    Story => (
      <DialogProvider>
        <Story />
      </DialogProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatWindow>;

export const Default: Story = {}; 