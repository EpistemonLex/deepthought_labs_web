import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ErrorMessage from './ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'Components/ErrorMessage',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text', description: 'The main error message to display.' },
    title: { control: 'text', description: 'An optional title for the error message box.' },
    code: { control: 'text', description: 'An optional error code to display.' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'An unexpected error has occurred.',
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Connection Failed',
    message: 'Could not connect to the server. Please try again later.',
  },
};

export const WithCode: Story = {
  args: {
    title: 'Authentication Error',
    message: 'The provided credentials are invalid.',
    code: 'AUTH_401',
  },
};

export const OnlyMessage: Story = {
    args: {
      message: 'This is a simple error message without a title or code.',
    },
  };