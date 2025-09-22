import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChallengeResponseAuthenticator from './ChallengeResponseAuthenticator';
import * as sovereign from '@/lib/api/sovereign';
import { ApiError } from '@/lib/api';
import { expect } from 'vitest';

// Mock the sovereign module
vi.mock('@/lib/api/sovereign', async () => {
    return {
        verifySignature: vi.fn(),
    };
});

const mockedVerifySignature = sovereign.verifySignature as vi.Mock;

describe('ChallengeResponseAuthenticator', () => {
  beforeEach(() => {
    mockedVerifySignature.mockClear();
  });

  it('renders the login button', () => {
    render(<ChallengeResponseAuthenticator />);
    expect(screen.getByText('Login with DeepThought')).toBeInTheDocument();
  });

  it('shows loading states and success message on successful login', async () => {
    mockedVerifySignature.mockImplementation(async () => {
      // Add a small delay to allow the 'Verifying signature...' state to render
      await new Promise(resolve => setTimeout(resolve, 10));
      return { session_token: 'test-token' };
    });

    render(<ChallengeResponseAuthenticator />);
    fireEvent.click(screen.getByText('Login with DeepThought'));

    expect(screen.getByText('Status: Waiting for DeepThought app...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Status: Verifying signature...')).toBeInTheDocument();
    }, { timeout: 2000 }); // Increased timeout to handle 1s delay in component

    await waitFor(() => {
      expect(screen.getByText('Status: Login successful!')).toBeInTheDocument();
    });

    expect(screen.getByText('Session Token: test-token')).toBeInTheDocument();
  });

  it('shows an error message on failed login', async () => {
    mockedVerifySignature.mockRejectedValue(new ApiError('Invalid signature', 400));

    render(<ChallengeResponseAuthenticator />);
    fireEvent.click(screen.getByText('Login with DeepThought'));

    await waitFor(() => {
      expect(screen.getByText('Status: Failed')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      // Check for the new, more user-friendly error message.
      // We can check for a substring to make the test less brittle.
      expect(screen.getByText(/couldn't verify your session/i)).toBeInTheDocument();
      expect(screen.getByText(/(Details: Invalid signature)/i)).toBeInTheDocument();
    });
  });
});
