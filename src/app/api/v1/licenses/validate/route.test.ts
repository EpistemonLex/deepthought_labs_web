import { POST } from './route';
import { NextRequest } from 'next/server';

const VALID_API_KEY = 'test-api-key';
const VALID_LICENSE_KEY = 'DTL-VALID-12345';
const INVALID_LICENSE_KEY = 'DTL-INVALID-12345';

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
  license_key: VALID_LICENSE_KEY,
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
    const req = mockRequest(VALID_API_KEY, { license_key: VALID_LICENSE_KEY }); // Missing fields
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
    expect(data.license_key).toBe(VALID_LICENSE_KEY);
  });

  it('should return 403 Forbidden with invalid status for an invalid license key', async () => {
    const invalidBody = { ...validBody, license_key: INVALID_LICENSE_KEY };
    const req = mockRequest(VALID_API_KEY, invalidBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.status).toBe('invalid');
    expect(data.reason_code).toBe('not_found');
  });
});
