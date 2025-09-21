import { GET } from './route';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'a-super-secret-jwt-download-secret-that-is-long-enough';

import { readFileSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  it('should return 403 Forbidden for a token with an invalid payload', async () => {
    const tokenWithInvalidPayload = generateToken({ some_other_data: 'foo' }, '1h');
    const req = mockRequest(tokenWithInvalidPayload);
    const res = await GET(req);
    const data = await res.json();
    expect(res.status).toBe(403);
    expect(data.error.code).toBe('invalid_token');
  });

  it('should return 200 OK and the correct path for a valid token', async () => {
    const productPath = '/downloads/deepthought-pro-2.1.0-arm64.dmg';
    const validToken = generateToken({ product_path: productPath }, '1h');
    const req = mockRequest(validToken);
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/json');
    expect(data.message).toBe('Redirecting to download.');
    expect(data.path).toBe(productPath);
  });

  it('should contain PII placeholder comments', async () => {
    const routeFilePath = join(__dirname, 'route.ts');
    const routeFileContent = readFileSync(routeFilePath, 'utf8');

    expect(routeFileContent).toMatch(/- Logging: In a real environment, access logs containing IP addresses/);
  });
});
