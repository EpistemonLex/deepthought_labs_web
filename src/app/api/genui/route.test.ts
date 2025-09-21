import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock the global fetch function
global.fetch = vi.fn();

// Mock sanitize-html
vi.mock('sanitize-html', () => {
  const sanitize = (html: string) => html;
  sanitize.defaults = {
    allowedTags: [],
    allowedAttributes: {},
  };
  return {
    default: sanitize,
    __esModule: true,
  };
});

describe('/api/genui POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_GENUI_API_TOKEN = 'wht-live-sk-7b3d9a8f-c1e0-4f6a-8d2b-5c9e1a4g0h2i';
    process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account-id';
    process.env.CLOUDFLARE_API_TOKEN = 'test-cf-token';
  });

  const createMockRequest = (body: Record<string, unknown>, headers: Record<string, string> = {}) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GENUI_API_TOKEN}`,
      ...headers,
    };
    return new NextRequest('http://localhost/api/genui', {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });
  };

  it('should return 401 if Authorization header is missing', async () => {
    const request = createMockRequest({ prompt: 'test' }, { 'Authorization': '' });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.error.code).toBe('authentication_failed');
  });

  it('should return 401 if token is invalid', async () => {
    const request = createMockRequest({ prompt: 'test' }, { 'Authorization': 'Bearer invalid-token' });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.error.code).toBe('authentication_failed');
  });

  it('should return 400 if prompt is missing', async () => {
    const request = createMockRequest({});
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error.code).toBe('invalid_request');
  });

  it('should return 400 if body is not valid JSON', async () => {
    const request = new NextRequest('http://localhost/api/genui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GENUI_API_TOKEN}`,
        },
        body: 'not a json',
      });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error.code).toBe('invalid_request');
  });

  it('should return a 200 with a UI component on success', async () => {
    const mockDeconstructionResponse = {
      result: { response: JSON.stringify({ component: 'div', children: [] }) },
      success: true,
    };
    const mockCodeGenResponse = {
      result: { response: '<div>Generated UI</div>' },
      success: true,
    };

    (fetch as vi.Mock)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDeconstructionResponse) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockCodeGenResponse) });

    const request = createMockRequest({ prompt: 'A simple div' });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.ui_component).toBe(Buffer.from('<div>Generated UI</div>').toString('base64'));
    expect(json.error).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should return 503 if the AI service is unavailable', async () => {
    (fetch as vi.Mock).mockResolvedValue({ ok: false, status: 503 });

    const request = createMockRequest({ prompt: 'A simple div' });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.error.code).toBe('service_unavailable');
  });

  it('should return 500 for other AI service errors', async () => {
    (fetch as vi.Mock).mockResolvedValue({ ok: false, status: 500, text: () => Promise.resolve('AI Error') });

    const request = createMockRequest({ prompt: 'A simple div' });
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error.code).toBe('internal_server_error');
  });

  it('should return 429 when rate limit is exceeded', async () => {
    // This is a simplified simulation. In a real-world scenario,
    // the rate limiting would be handled by a middleware or gateway.
    (fetch as vi.Mock).mockResolvedValue(new Response(
      JSON.stringify({ error: { code: 'rate_limit_exceeded', message: 'Too Many Requests' } }),
      { status: 429 }
    ));

    const request = createMockRequest({ prompt: 'A simple div' });
    const response = await POST(request);
    const json = await response.json();

    // We expect the error to be passed through from the downstream service.
    expect(response.status).toBe(429);
    expect(json.error.code).toBe('rate_limit_exceeded');
  });
});
