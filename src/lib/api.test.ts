import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError, generateUI, validateLicense, verifySignature, requestDownload } from './api';

describe('API', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        delete process.env.NEXT_PUBLIC_GENUI_API_TOKEN;
        delete process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY;
    });

  describe('ApiError', () => {
    it('should create a new ApiError with the correct message and status', () => {
      const error = new ApiError('Test error', 404);
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(404);
      expect(error.name).toBe('ApiError');
    });
  });

  describe('generateUI', () => {
    it('should throw an error if the API token is not configured', async () => {
      await expect(generateUI('test')).rejects.toThrow('The API token is not configured. Please contact the administrator.');
    });

    it('should throw an ApiError if the fetch fails', async () => {
        process.env.NEXT_PUBLIC_GENUI_API_TOKEN = 'test-token';
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: () => Promise.resolve({ error: { message: 'Server error' } }),
        });
        await expect(generateUI('test')).rejects.toThrow('Server error');
    });

    it('should throw an ApiError if the response does not include a UI component', async () => {
        process.env.NEXT_PUBLIC_GENUI_API_TOKEN = 'test-token';
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ }),
        });
        await expect(generateUI('test')).rejects.toThrow('The API response did not include a UI component.');
    });

    it('should return a UI component on successful generation', async () => {
        process.env.NEXT_PUBLIC_GENUI_API_TOKEN = 'test-token';
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ ui_component: btoa('<div>hello</div>') }),
        });
        const ui = await generateUI('test');
        expect(ui).toBe('<div>hello</div>');
    });
  });

  describe('validateLicense', () => {
    it('should throw an error if the integrator API key is not configured', async () => {
      await expect(validateLicense('test-key', 'test-product', {})).rejects.toThrow('Integrator API key is not configured.');
    });

    it('should throw an ApiError if the fetch fails', async () => {
        process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY = 'test-key';
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: () => Promise.resolve({ message: 'Server error' }),
        });
        await expect(validateLicense('test-key', 'test-product', {})).rejects.toThrow('Server error');
    });

    it('should return a validation response on successful validation', async () => {
        process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY = 'test-key';
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ status: 'valid' }),
        });
        const response = await validateLicense('test-key', 'test-product', {});
        expect(response.status).toBe('valid');
    });
  });

  describe('verifySignature', () => {
    it('should return a session token on successful verification', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ session_token: 'test-token' }),
        });
      const response = await verifySignature('test-key', 'test-challenge', 'test-signature');
      expect(response.session_token).toBe('test-token');
    });

    it('should throw an ApiError if the fetch fails', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: () => Promise.resolve({ message: 'Server error' }),
        });
        await expect(verifySignature('test-key', 'test-challenge', 'test-signature')).rejects.toThrow('Server error');
    });
  });

  describe('requestDownload', () => {
    it('should throw an error if the integrator API key is not configured', async () => {
      await expect(requestDownload('test-key', 'test-product', '1.0.0', 'windows')).rejects.toThrow('Integrator API key is not configured.');
    });

    it('should throw an ApiError if the fetch fails', async () => {
        process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY = 'test-key';
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: () => Promise.resolve({ message: 'Server error' }),
        });
        await expect(requestDownload('test-key', 'test-product', '1.0.0', 'windows')).rejects.toThrow('Server error');
    });

    it('should return a download response on successful request', async () => {
        process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY = 'test-key';
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ status: 'success' }),
        });
        const response = await requestDownload('test-key', 'test-product', '1.0.0', 'windows');
        expect(response.status).toBe('success');
    });
  });
});