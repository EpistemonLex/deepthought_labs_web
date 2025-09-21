'use client';

import { useState } from 'react';
import { verifySignature } from '@/lib/api/sovereign';
import { ApiError } from '@/lib/api';
import ErrorMessage from './ErrorMessage';

export default function ChallengeResponseAuthenticator() {
  const [status, setStatus] = useState('Idle');
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const handleLogin = async () => {
    setStatus('Waiting for DeepThought app...');
    setError(null);
    setSessionToken(null);

    // 1. Generate a Challenge
    const challenge = 'a-random-challenge-string';

    // 2. Simulate Desktop Interaction
    // In a real scenario, this would involve communicating with the desktop app.
    // For now, we'll use a mock function.
    const mockSignChallenge = async (challenge: string) => {
      // This is a mock implementation.
      // A real implementation would use a cryptographic library to sign the challenge.
      return {
        publicKey: 'mock-public-key',
        signature: `signed-${challenge}`,
      };
    };
    const { publicKey, signature } = await mockSignChallenge(challenge);

    try {
      setStatus('Verifying signature...');
      const response = await verifySignature(publicKey, challenge, signature);
      setSessionToken(response.session_token);
      setStatus('Login successful!');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setStatus('Failed');
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={status.includes('...')}>
        Login with DeepThought
      </button>
      <p>Status: {status}</p>
      {error && <ErrorMessage message={error} />}
      {sessionToken && <p>Session Token: {sessionToken}</p>}
    </div>
  );
}
