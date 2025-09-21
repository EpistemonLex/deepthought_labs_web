import { POST } from './route';
import { NextRequest } from 'next/server';
import { licenses } from '@/lib/database';

const VALID_API_KEY = 'test-api-key';
const VALID_LICENSE = licenses.find((l) => l.status === 'active')!;
const EXPIRED_LICENSE = licenses.find((l) => l.status === 'expired')!;
const REVOKED_LICENSE = licenses.find((l) => l.status === 'revoked')!;
const NON_EXISTENT_KEY = 'DTL-DOES-NOT-EXIST';

const mockRequest = (apiKey: string | null, body: any): NextRequest => {
  const headers = new Headers();
  if (apiKey) {
    headers.set('X-API-Key', apiKey);
  }
  return new NextRequest('http://localhost/api/v1/licenses/validate', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
};

const validBody = {
  license_key: VALID_LICENSE.key,
  product_id: 'deepthought-pro',
  fingerprint: { type: 'mac_address', value: '00:1A:2B:3C:4D:5E' },
};

describe('API - /api/v1/licenses/validate', () => {
  beforeAll(() => {
    process.env.INTEGRATOR_API_KEY = VALID_API_KEY;
  });

  afterAll(() => {
    delete process.env.INTEGRATOR_API_KEY;
  });

  it('should return 401 Unauthorized if API key is missing', async () => {
    const req = mockRequest(null, validBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error.code).toBe('unauthorized');
  });

  it('should return 401 Unauthorized if API key is invalid', async () => {
    const req = mockRequest('invalid-key', validBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error.code).toBe('unauthorized');
  });

  it('should return 400 Bad Request if request body is malformed', async () => {
    const req = mockRequest(VALID_API_KEY, { license_key: VALID_LICENSE.key }); // Missing fields
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error.code).toBe('bad_request');
  });

  it('should return 200 OK with valid status for a valid license key', async () => {
    const req = mockRequest(VALID_API_KEY, validBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe('valid');
    expect(data.license_key).toBe(VALID_LICENSE.key);
    expect(data.tier).toBe(VALID_LICENSE.tier);
    expect(data.expires_at).toBe(VALID_LICENSE.expires_at);
  });

  it('should return 404 Not Found for a non-existent license key', async () => {
    const body = { ...validBody, license_key: NON_EXISTENT_KEY };
    const req = mockRequest(VALID_API_KEY, body);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.status).toBe('invalid');
    expect(data.reason_code).toBe('not_found');
  });

  it('should return 403 Forbidden for an expired license key', async () => {
    const body = { ...validBody, license_key: EXPIRED_LICENSE.key };
    const req = mockRequest(VALID_API_KEY, body);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.status).toBe('invalid');
    expect(data.reason_code).toBe('expired');
  });

  it('should return 403 Forbidden for a revoked license key', async () => {
    const body = { ...validBody, license_key: REVOKED_LICENSE.key };
    const req = mockRequest(VALID_API_KEY, body);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.status).toBe('invalid');
    expect(data.reason_code).toBe('revoked');
  });

  it('should not accept additional PII fields', async () => {
    const bodyWithExtraPII = {
      ...validBody,
      user_email: 'test@example.com',
      user_name: 'Test User',
    };
    const req = mockRequest(VALID_API_KEY, bodyWithExtraPII);
    const res = await POST(req);
    const data = await res.json();

    // The endpoint should process successfully, ignoring the extra fields.
    expect(res.status).toBe(200);
    expect(data.status).toBe('valid');
    // Ensure no PII is reflected in the response
    expect(data.user_email).toBeUndefined();
    expect(data.user_name).toBeUndefined();
  });

  it('should contain PII placeholder comments', async () => {
    const fs = require('fs');
    const path = require('path');
    const routeFilePath = path.join(__dirname, 'route.ts');
    const routeFileContent = fs.readFileSync(routeFilePath, 'utf8');

    // Check for comments related to PII controls
    expect(routeFileContent).toMatch(/PII Compliance: Data Minimization/);
    expect(routeFileContent).toMatch(/- Encryption: In a real database, the license_key and fingerprint would be/);
    expect(routeFileContent).toMatch(/- Access Control: Access to this data would be restricted via RBAC/);
    expect(routeFileContent).toMatch(/- Retention Policy: Data would be retained only for the license/);
  });
});
