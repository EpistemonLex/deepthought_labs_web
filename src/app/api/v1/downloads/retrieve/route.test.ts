import { GET } from './route';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'a-super-secret-jwt-download-secret-that-is-long-enough';

const generateToken = (payload: any, expiresIn: string | number): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

const mockRequest = (token: string | null): NextRequest => {
  const url = token
    ? `http://localhost/api/v1/downloads/retrieve?token=${token}`
    : 'http://localhost/api/v1/downloads/retrieve';
  return new NextRequest(url);
};

describe('API - /api/v1/downloads/retrieve', () => {
  beforeAll(() => {
    process.env.JWT_DOWNLOAD_SECRET = JWT_SECRET;
  });

  afterAll(() => {
    delete process.env.JWT_DOWNLOAD_SECRET;
  });

  it('should return 400 Bad Request if token is missing', async () => {
    const req = mockRequest(null);
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error.code).toBe('bad_request');
  });

  it('should return 403 Forbidden for an invalid token signature', async () => {
    const invalidToken = 'this.is.not.a.valid.jwt';
    const req = mockRequest(invalidToken);
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(403);
    expect(data.error.code).toBe('invalid_token');
  });

  it('should return 403 Forbidden for an expired token', async () => {
    const expiredToken = generateToken({ user: 'test' }, -1); // Expired in the past
    const req = mockRequest(expiredToken);
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(403);
    expect(data.error.code).toBe('expired_token');
  });

  it('should return 500 Internal Server Error if JWT secret is not configured', async () => {
    delete process.env.JWT_DOWNLOAD_SECRET;
    const validToken = generateToken({ user: 'test' }, '1h');
    const req = mockRequest(validToken);
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error.code).toBe('internal_server_error');
    process.env.JWT_DOWNLOAD_SECRET = JWT_SECRET; // Restore for other tests
  });

  it('should return 200 OK for a valid token', async () => {
    const validToken = generateToken({ product_id: 'test-product' }, '1h');
    const req = mockRequest(validToken);
    const res = await GET(req);
    const text = await res.text();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/plain');
    expect(text).toBe('Mock file download successful.');
  });
});
