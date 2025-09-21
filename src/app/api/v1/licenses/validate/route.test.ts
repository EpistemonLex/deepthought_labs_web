import { NextRequest } from 'next/server';
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest';

// Mock the global fetch function
global.fetch = vi.fn();

const VALID_API_KEY = 'test-api-key';
const VALID_LICENSE_KEY = 'valid-license-key';

const mockRequest = (apiKey: string | null, body: Record<string, unknown>): NextRequest => {
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

describe('API - /api/v1/licenses/validate (Proxy)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY = VALID_API_KEY;
    process.env.INTEGRATOR_API_KEY = 'server-side-secret-key';
    process.env.SOVEREIGN_API_URL = 'https://sovereign.test.api';
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY;
    delete process.env.INTEGRATOR_API_KEY;
    delete process.env.SOVEREIGN_API_URL;
  });

  it('should return 401 Unauthorized if client API key is missing', async () => {
    const { POST } = await import('./route');
    const req = mockRequest(null, validBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error.code).toBe('unauthorized');
  });

  it('should return 400 Bad Request if request body is malformed', async () => {
    const { POST } = await import('./route');
    const req = mockRequest(VALID_API_KEY, { license_key: VALID_LICENSE_KEY }); // Missing fields
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error.code).toBe('bad_request');
  });

  it('should proxy the request to the Sovereign API and return the response', async () => {
    const { POST } = await import('./route');
    const mockApiResponse = { status: 'valid', tier: 'pro' };
    (fetch as vi.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockApiResponse),
    });

    const req = mockRequest(VALID_API_KEY, validBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(mockApiResponse);

    expect(fetch).toHaveBeenCalledWith('https://sovereign.test.api/licenses/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'server-side-secret-key',
      },
      body: JSON.stringify(validBody),
    });
  });

  it('should forward non-200 responses from the Sovereign API', async () => {
    const { POST } = await import('./route');
    const mockApiResponse = { error: 'not_found' };
    (fetch as vi.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(mockApiResponse),
    });

    const req = mockRequest(VALID_API_KEY, validBody);
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data).toEqual(mockApiResponse);
  });
});
