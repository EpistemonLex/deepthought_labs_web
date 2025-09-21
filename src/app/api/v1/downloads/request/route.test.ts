import { POST } from './route';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const VALID_API_KEY = 'test-api-key';
const JWT_SECRET = 'a-super-secret-jwt-download-secret-that-is-long-enough';
const VALID_LICENSE_KEY = 'DTL-VALID-12345';
const INVALID_LICENSE_KEY = 'DTL-INVALID-12345';

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
  product_id: 'deepthought-pro',
  version: '2.1.0',
  platform: 'arm64',
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

  it('should return 403 Forbidden for an invalid license key', async () => {
    const req = mockRequest(VALID_API_KEY, { ...validBody, license_key: INVALID_LICENSE_KEY });
    const res = await POST(req);
    expect(res.status).toBe(403);
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

    // Verify the JWT
    const payload = jwt.verify(data.download_token, JWT_SECRET) as jwt.JwtPayload;
    expect(payload.product_id).toBe(validBody.product_id);
    expect(payload.version).toBe(validBody.version);
    expect(payload.platform).toBe(validBody.platform);
    expect(payload.exp).toBeDefined();
  });

  it('should not include any PII in the JWT payload', async () => {
    const req = mockRequest(VALID_API_KEY, validBody);
    const res = await POST(req);
    const data = await res.json();
    const payload = jwt.verify(data.download_token, JWT_SECRET) as jwt.JwtPayload;

    expect(payload.license_key).toBeUndefined();
    expect(payload.email).toBeUndefined();
  });

  it('should contain PII placeholder comments', async () => {
    const fs = require('fs');
    const path = require('path');
    const routeFilePath = path.join(__dirname, 'route.ts');
    const routeFileContent = fs.readFileSync(routeFilePath, 'utf8');

    expect(routeFileContent).toMatch(/- Logging: In a real environment, access logs containing IP addresses/);
  });
});
