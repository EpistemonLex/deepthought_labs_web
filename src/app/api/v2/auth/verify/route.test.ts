import { POST } from './route';
import { NextRequest } from 'next/server';
import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { generateKeyPairSync, createSign } from 'crypto';

describe('POST /api/v2/auth/verify', () => {
  const mockChallenge = 'nonce_12345';
  const mockJwtSecret = 'test-secret';

  const { publicKey, privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'secp521r1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  const sign = createSign('sha512');
  sign.update(mockChallenge);
  sign.end();
  const validSignature = sign.sign(privateKey, 'base64');
  const invalidSignature = 'invalid_signature';

  process.env.JWT_SESSION_SECRET = mockJwtSecret;

  it('should return a session token for a valid signature', async () => {
    const mockToken = 'mock_jwt_token';
    const signSpy = vi.spyOn(jwt, 'sign').mockReturnValue(mockToken);

    const request = new NextRequest('http://localhost/api/v2/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        public_key: publicKey,
        challenge: mockChallenge,
        signature: validSignature,
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
        public_key: publicKey,
        challenge: mockChallenge,
        signature: invalidSignature,
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.status).toBe('failed');
    expect(body.reason_code).toBe('invalid_signature');
  });

  it('should return a 401 for a malformed public key', async () => {
    const request = new NextRequest('http://localhost/api/v2/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        public_key: 'malformed-key',
        challenge: mockChallenge,
        signature: validSignature,
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
        signature: validSignature,
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
            public_key: publicKey,
            signature: validSignature,
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
            public_key: publicKey,
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
