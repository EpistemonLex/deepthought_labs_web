import { POST } from './route';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import * as database from '@/lib/database';

const VALID_API_KEY = 'test-api-key';
const JWT_SECRET = 'a-super-secret-jwt-download-secret-that-is-long-enough';

// Get mock data from the database
const VALID_LICENSE_KEY = database.licenses.find((l) => l.status === 'active')!.key;
const EXPIRED_LICENSE_KEY = database.licenses.find((l) => l.status === 'expired')!.key;
const REVOKED_LICENSE_KEY = database.licenses.find((l) => l.status === 'revoked')!.key;
const VALID_PRODUCT = database.products[0];

import { readFileSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRequest = (apiKey: string | null, body: any): NextRequest => {
  const headers = new Headers();
  if (apiKey) {
    headers.set('X-API-Key', apiKey);
  }
  return new NextRequest('http://localhost/api/v1/downloads/request', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
};

const validBody = {
  license_key: VALID_LICENSE_KEY,
  product_id: VALID_PRODUCT.id,
  version: VALID_PRODUCT.version,
  platform: VALID_PRODUCT.platform,
};

describe('API - /api/v1/downloads/request', () => {
  beforeEach(() => {
    process.env.INTEGRATOR_API_KEY = VALID_API_KEY;
    process.env.JWT_DOWNLOAD_SECRET = JWT_SECRET;
  });

  afterEach(() => {
    delete process.env.INTEGRATOR_API_KEY;
    delete process.env.JWT_DOWNLOAD_SECRET;
  });

  it('should return 401 Unauthorized if API key is invalid', async () => {
    const req = mockRequest('invalid-key', validBody);
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 403 Forbidden for a non-existent license key', async () => {
    const req = mockRequest(VALID_API_KEY, { ...validBody, license_key: 'non-existent-key' });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('should return 403 Forbidden for an expired license key', async () => {
    const req = mockRequest(VALID_API_KEY, { ...validBody, license_key: EXPIRED_LICENSE_KEY });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('should return 403 Forbidden for a revoked license key', async () => {
    const req = mockRequest(VALID_API_KEY, { ...validBody, license_key: REVOKED_LICENSE_KEY });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('should return 404 Not Found for a non-existent product ID', async () => {
    const req = mockRequest(VALID_API_KEY, { ...validBody, product_id: 'non-existent-product' });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it('should return 404 Not Found for a non-existent product version', async () => {
    const req = mockRequest(VALID_API_KEY, { ...validBody, version: '0.0.0' });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it('should return 400 Bad Request for a malformed body', async () => {
    const req = mockRequest(VALID_API_KEY, { license_key: VALID_LICENSE_KEY }); // missing fields
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return 500 Internal Server Error if JWT secret is not set', async () => {
    delete process.env.JWT_DOWNLOAD_SECRET;
    const req = mockRequest(VALID_API_KEY, validBody);
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error.code).toBe('internal_server_error');
  });

  it('should return 200 OK with a valid JWT for a valid request', async () => {
    const req = mockRequest(VALID_API_KEY, validBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.download_token).toBeDefined();
    expect(data.expires_in).toBe(300);
    expect(data.file_name).toBe(VALID_PRODUCT.path.split('/').pop());

    // Verify the JWT
    const payload = jwt.verify(data.download_token, JWT_SECRET) as jwt.JwtPayload;
    expect(payload.product_path).toBe(VALID_PRODUCT.path);
    expect(payload.exp).toBeDefined();
  });

  it('should not include any PII in the JWT payload', async () => {
    const req = mockRequest(VALID_API_KEY, validBody);
    const res = await POST(req);
    const data = await res.json();
    const payload = jwt.verify(data.download_token, JWT_SECRET) as jwt.JwtPayload;

    expect(payload.license_key).toBeUndefined();
    expect(payload.email).toBeUndefined();
    expect(payload.product_id).toBeUndefined();
  });

  it('should contain PII placeholder comments', async () => {
    const routeFilePath = join(__dirname, 'route.ts');
    const routeFileContent = readFileSync(routeFilePath, 'utf8');

    expect(routeFileContent).toMatch(/- Logging: In a real environment, access logs containing IP addresses/);
  });
});
