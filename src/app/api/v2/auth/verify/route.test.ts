import { POST } from './route';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import crypto, { Verify } from 'crypto';

// --- Test Constants ---
const JWT_TEST_SECRET = 'a-very-secure-and-long-secret-key-for-testing-purposes-only-do-not-use-in-production';

// --- Helper Functions ---
const mockRequest = (body: object): NextRequest => {
  return new NextRequest('http://localhost/api/v2/auth/verify', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });
};

const mockInvalidRequest = (body: string): NextRequest => {
    return new NextRequest('http://localhost/api/v2/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body,
    });
  };

const validBody = {
  public_key: 'test-public-key',
  challenge: 'test-challenge',
  signature: 'test-signature',
};

// Define a type for the mock verify object
type MockVerify = Partial<Verify>;

// --- Test Suite ---
describe('API - /api/v2/auth/verify', () => {

  beforeAll(() => {
    process.env.JWT_SESSION_SECRET = JWT_TEST_SECRET;
  });

  afterAll(() => {
    // Clean up the environment variable after all tests have run
    delete process.env.JWT_SESSION_SECRET;
  });

  // Test Success Case
  it('should return 200 OK and a valid JWT for a successful verification', async () => {
    vi.spyOn(crypto, 'createVerify').mockReturnValue({
      update: vi.fn(),
      end: vi.fn(),
      verify: vi.fn().mockReturnValue(true),
    } as MockVerify);
    const req = mockRequest(validBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe('verified');
    expect(data.session_token).toBeDefined();

    // Verify the JWT
    const decodedToken = jwt.verify(data.session_token, JWT_TEST_SECRET) as jwt.JwtPayload;
    expect(decodedToken.sub).toBe('mock_user_id');
    // Check if 'exp' exists and is a number
    expect(decodedToken.exp).toBeDefined();
    expect(typeof decodedToken.exp).toBe('number');
  });

  // Test Failure Cases
  it('should return 401 Unauthorized for an invalid signature', async () => {
    vi.spyOn(crypto, 'createVerify').mockReturnValue({
      update: vi.fn(),
      end: vi.fn(),
      verify: vi.fn().mockReturnValue(false),
    } as MockVerify);
    const req = mockRequest({ ...validBody, signature: 'invalid-signature' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.status).toBe('failed');
    expect(data.reason_code).toBe('invalid_signature');
  });

  it('should return 401 Unauthorized for an invalid public key', async () => {
    vi.spyOn(crypto, 'createVerify').mockReturnValue({
      update: vi.fn(),
      end: vi.fn(),
      verify: vi.fn().mockReturnValue(false),
    } as MockVerify);
    const req = mockRequest({ ...validBody, public_key: 'invalid-public-key' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.status).toBe('failed');
    expect(data.reason_code).toBe('invalid_signature');
  });

  // Test Invalid Input Cases
  it('should return 400 Bad Request if public_key is missing', async () => {
    const invalidBody = { ...validBody };
    delete (invalidBody as { public_key?: string }).public_key;
    const req = mockRequest(invalidBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error.code).toBe('bad_request');
  });

  it('should return 400 Bad Request if challenge is missing', async () => {
    const invalidBody = { ...validBody };
    delete (invalidBody as { challenge?: string }).challenge;
    const req = mockRequest(invalidBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error.code).toBe('bad_request');
  });

  it('should return 400 Bad Request if signature is missing', async () => {
    const invalidBody = { ...validBody };
    delete (invalidBody as { signature?: string }).signature;
    const req = mockRequest(invalidBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error.code).toBe('bad_request');
  });

  it('should return 400 Bad Request for a non-JSON body', async () => {
    const req = mockInvalidRequest("this is not json");
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error.code).toBe('bad_request');
    expect(data.error.message).toBe('Invalid JSON body.');
  });

  // Test Server Configuration Error
  it('should return 500 Internal Server Error if JWT secret is not configured', async () => {
    vi.spyOn(crypto, 'createVerify').mockReturnValue({
      update: vi.fn(),
      end: vi.fn(),
      verify: vi.fn().mockReturnValue(true),
    } as MockVerify);
    delete process.env.JWT_SESSION_SECRET; // Temporarily remove the secret

    const req = mockRequest(validBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error.code).toBe('internal_server_error');
    expect(data.error.message).toBe('Authentication secret is not configured.');

    process.env.JWT_SESSION_SECRET = JWT_TEST_SECRET; // Restore the secret for other tests
  });
});
