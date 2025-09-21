'use client';

import { useState } from 'react';
import { verifySignature } from '@/lib/api/sovereign';
import { ApiError } from '@/lib/api';

export default function ChallengeResponseAuthenticator() {
  const [status, setStatus] = useState('Idle');
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const handleLogin = async () => {
    setStatus('Waiting for DeepThought app...');

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
    } catch (error) {
      if (error instanceof ApiError) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus('An unknown error occurred.');
      }
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={status.includes('...')}>
        Login with DeepThought
      </button>
      <p>Status: {status}</p>
      {sessionToken && <p>Session Token: {sessionToken}</p>}
    </div>
  );
}
