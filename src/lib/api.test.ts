import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError, generateUI } from './api';

// Mock the global fetch function
global.fetch = vi.fn();

describe('api.ts', () => {
  beforeEach(() => {
    // Reset the fetch mock before each test
    vi.clearAllMocks();
    // Reset the environment variables
    delete process.env.NEXT_PUBLIC_GENUI_API_TOKEN;
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
});
