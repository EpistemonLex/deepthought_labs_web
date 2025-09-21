import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError, generateUI, validateLicense, requestDownload } from './api';

// Mock the global fetch function
global.fetch = vi.fn();

describe('api.ts', () => {
  beforeEach(() => {
    // Reset the fetch mock before each test
    vi.clearAllMocks();
    // Reset the environment variables
    delete process.env.NEXT_PUBLIC_GENUI_API_TOKEN;
    delete process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY;
  });

  describe('ApiError', () => {
    it('should create an error with a message and status', () => {
      const error = new ApiError('Test error', 404);
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(404);
      expect(error.name).toBe('ApiError');
    });
  });

  describe('generateUI', () => {
    it('should throw an ApiError if the API token is not configured', async () => {
      await expect(generateUI('test prompt')).rejects.toThrow(
        new ApiError('The API token is not configured. Please contact the administrator.', 500)
      );
    });

    it('should return a decoded UI component on success', async () => {
      process.env.NEXT_PUBLIC_GENUI_API_TOKEN = 'test-token';
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ ui_component: btoa('<div>Hello</div>') }),
      };
      (fetch as vi.Mock).mockResolvedValue(mockResponse);

      const ui = await generateUI('test prompt');
      expect(ui).toBe('<div>Hello</div>');
      expect(fetch).toHaveBeenCalledWith('https://api.white.ai/v1/genui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: JSON.stringify({
          prompt: 'test prompt',
          constraints: { framework: 'react', style_guide: 'tailwind_css_v3' },
        }),
      });
    });

    it('should throw an ApiError on API failure', async () => {
      process.env.NEXT_PUBLIC_GENUI_API_TOKEN = 'test-token';
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ error: { message: 'Internal Server Error' } }),
      };
      (fetch as vi.Mock).mockResolvedValue(mockResponse);

      await expect(generateUI('test prompt')).rejects.toThrow(
        new ApiError('Internal Server Error', 500)
      );
    });

    it('should throw an ApiError if the response does not contain a UI component', async () => {
      process.env.NEXT_PUBLIC_GENUI_API_TOKEN = 'test-token';
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({}),
      };
      (fetch as vi.Mock).mockResolvedValue(mockResponse);

      await expect(generateUI('test prompt')).rejects.toThrow(
        new ApiError('The API response did not include a UI component.', 500)
      );
    });
  });

  describe('validateLicense', () => {
    const licenseKey = 'test-license';
    const productId = 'test-product';
    const fingerprint = { ua: 'test-agent' };

    it('should throw an ApiError if the integrator API key is not configured', async () => {
      await expect(validateLicense(licenseKey, productId, fingerprint)).rejects.toThrow(
        new ApiError('Integrator API key is not configured.', 500)
      );
    });

    it('should return a validation response on success', async () => {
      process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY = 'test-api-key';
      const mockApiResponse = { status: 'valid', message: 'License is valid.' };
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      };
      (fetch as vi.Mock).mockResolvedValue(mockResponse);

      const response = await validateLicense(licenseKey, productId, fingerprint);
      expect(response).toEqual(mockApiResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/v1/licenses/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        body: JSON.stringify({
          license_key: licenseKey,
          product_id: productId,
          fingerprint: fingerprint,
        }),
      });
    });

    it('should throw an ApiError on API failure', async () => {
      process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY = 'test-api-key';
      const mockErrorResponse = { message: 'Invalid license key' };
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve(mockErrorResponse),
      };
      (fetch as vi.Mock).mockResolvedValue(mockResponse);

      await expect(validateLicense(licenseKey, productId, fingerprint)).rejects.toThrow(
        new ApiError('Invalid license key', 404)
      );
    });
  });

  describe('requestDownload', () => {
    const licenseKey = 'test-license';
    const productId = 'test-product';
    const version = '1.0.0';
    const platform = 'linux';

    it('should throw an ApiError if the integrator API key is not configured', async () => {
      await expect(requestDownload(licenseKey, productId, version, platform)).rejects.toThrow(
        new ApiError('Integrator API key is not configured.', 500)
      );
    });

    it('should return a download response on success', async () => {
      process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY = 'test-api-key';
      const mockApiResponse = { status: 'success', download_token: 'test-token' };
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      };
      (fetch as vi.Mock).mockResolvedValue(mockResponse);

      const response = await requestDownload(licenseKey, productId, version, platform);
      expect(response).toEqual(mockApiResponse);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/v1/downloads/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        body: JSON.stringify({
          license_key: licenseKey,
          product_id: productId,
          version: version,
          platform: platform,
        }),
      });
    });

    it('should throw an ApiError on API failure', async () => {
      process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY = 'test-api-key';
      const mockErrorResponse = { message: 'Download not available' };
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve(mockErrorResponse),
      };
      (fetch as vi.Mock).mockResolvedValue(mockResponse);

      await expect(requestDownload(licenseKey, productId, version, platform)).rejects.toThrow(
        new ApiError('Download not available', 400)
      );
    });
  });
});
