import { POST } from './route';
import { NextRequest } from 'next/server';
import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';


describe('POST /api/v2/auth/verify', () => {
  const mockChallenge = 'nonce_12345';
  const mockValidPublicKey = '-----BEGIN PUBLIC KEY-----\nMOCK_VALID_KEY\n-----END PUBLIC KEY-----';
  const mockInvalidPublicKey = '-----BEGIN PUBLIC KEY-----\nINVALID_KEY\n-----END PUBLIC KEY-----';
  const mockValidSignature = 'MOCK_VALID_SIGNATURE_BASE64';
  const mockInvalidSignature = 'INVALID_SIGNATURE_BASE64';
  const mockJwtSecret = 'test-secret';

  process.env.JWT_SESSION_SECRET = mockJwtSecret;

  it('should return a session token for a valid signature', async () => {
    const mockToken = 'mock_jwt_token';
    const signSpy = vi.spyOn(jwt, 'sign').mockReturnValue(mockToken as any);

    const request = new NextRequest('http://localhost/api/v2/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        public_key: mockValidPublicKey,
        challenge: mockChallenge,
        signature: mockValidSignature,
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('verified');
    expect(body.session_token).toBe(mockToken);
    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: 'mock_user_id' },
      mockJwtSecret,
      { expiresIn: '15m' }
    );
    signSpy.mockRestore();
  });

  it('should return a 401 for an invalid signature', async () => {
    const request = new NextRequest('http://localhost/api/v2/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        public_key: mockInvalidPublicKey,
        challenge: mockChallenge,
        signature: mockInvalidSignature,
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.status).toBe('failed');
    expect(body.reason_code).toBe('invalid_signature');
  });

  it('should return a 400 for a missing public_key', async () => {
    const request = new NextRequest('http://localhost/api/v2/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        challenge: mockChallenge,
        signature: mockValidSignature,
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('invalid_request');
  });

  it('should return a 400 for a missing challenge', async () => {
    const request = new NextRequest('http://localhost/api/v2/auth/verify', {
        method: 'POST',
        body: JSON.stringify({
            public_key: mockValidPublicKey,
            signature: mockValidSignature,
        }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('invalid_request');
  });

  it('should return a 400 for a missing signature', async () => {
    const request = new NextRequest('http://localhost/api/v2/auth/verify', {
        method: 'POST',
        body: JSON.stringify({
            public_key: mockValidPublicKey,
            challenge: mockChallenge,
        }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('invalid_request');
  });

  it('should return a 400 for invalid JSON', async () => {
    const request = new NextRequest('http://localhost/api/v2/auth/verify', {
        method: 'POST',
        body: '{"invalid_json":,}',
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('invalid_json');
  });
});
