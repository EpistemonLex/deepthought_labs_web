import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ChallengeResponseAuthenticator from './ChallengeResponseAuthenticator';

const meta: Meta<typeof ChallengeResponseAuthenticator> = {
  title: 'Components/ChallengeResponseAuthenticator',
  component: ChallengeResponseAuthenticator,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
