import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ErrorMessage from './ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'Components/ErrorMessage',
  component: ErrorMessage,
  argTypes: {
    message: { control: 'text' },
    title: { control: 'text' },
    code: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

export const Default: Story = {
  args: {
    message: 'This is a default error message.',
  },
};

export const WithTitleAndCode: Story = {
  args: {
    title: 'Authentication Failed',
    message: 'Your credentials could not be verified.',
    code: 'AUTH_001',
  },
};
