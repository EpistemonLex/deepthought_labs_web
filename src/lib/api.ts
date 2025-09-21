// This file will contain the logic for interacting with the GenUI API and Sovereign Utility API.

// Base URL for the Sovereign Utility API
const SOVEREIGN_API_BASE_URL = process.env.NEXT_PUBLIC_SOVEREIGN_API_URL || 'http://localhost:8000/api/v1';

export interface LicenseValidationResponse {
  status: string;
  message: string;
  tier?: string;
  expires_at?: string;
  // any other fields from the validation response
}

export interface DownloadRequestResponse {
  status: string;
  message: string;
  download_token?: string;
  file_name?: string;
  file_size?: number; // in bytes
  // any other fields from the download request response
}

/**
 * A custom error class to handle API errors, including the HTTP status.
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function generateUI(prompt: string): Promise<string> {
  const token = process.env.NEXT_PUBLIC_GENUI_API_TOKEN;

  if (!token) {
    throw new ApiError(
      'The API token is not configured. Please contact the administrator.',
      500,
    );
  }

  const response = await fetch('https://api.white.ai/v1/genui', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt,
      constraints: { framework: 'react', style_guide: 'tailwind_css_v3' },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw a custom error with the message and status from the API
    throw new ApiError(
      data.error?.message || `API Error: ${response.statusText}`,
      response.status,
    );
  }

  if (!data.ui_component) {
    throw new ApiError('The API response did not include a UI component.', 500);
  }

  // Decode Base64 UI component
  const decodedUI = atob(data.ui_component);
  return decodedUI;
}

/**
 * Validates a license key against the Sovereign Utility API.
 * @param licenseKey The license key to validate.
 * @param productId The ID of the product.
 * @param fingerprint A client-side generated device fingerprint.
 * @returns A promise that resolves to the license validation response.
 */
export async function validateLicense(
  licenseKey: string,
  productId: string,
  fingerprint: object,
): Promise<LicenseValidationResponse> {
  const apiKey = process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY;
  if (!apiKey) {
    throw new ApiError('Integrator API key is not configured.', 500);
  }

  const response = await fetch(`${SOVEREIGN_API_BASE_URL}/licenses/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({
      license_key: licenseKey,
      product_id: productId,
      fingerprint: fingerprint,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || `API Error: ${response.statusText}`, response.status);
  }

  return data;
}

/**
 * Requests a software download from the Sovereign Utility API.
 * @param licenseKey The license key for authorization.
 * @param productId The ID of the product to download.
 * @param version The specific version of the product.
 * @param platform The target platform (e.g., 'windows', 'macos', 'linux').
 * @returns A promise that resolves to the download request response.
 */
export async function requestDownload(
  licenseKey: string,
  productId: string,
  version: string,
  platform: string,
): Promise<DownloadRequestResponse> {
  const apiKey = process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY;
  if (!apiKey) {
    throw new ApiError('Integrator API key is not configured.', 500);
  }

  const response = await fetch(`${SOVEREIGN_API_BASE_URL}/downloads/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({
      license_key: licenseKey,
      product_id: productId,
      version: version,
      platform: platform,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || `API Error: ${response.statusText}`, response.status);
  }

  return data;
}
