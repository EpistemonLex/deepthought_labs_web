import { ApiError } from '../api';

/**
 * Defines the shape of the response from the license validation endpoint.
 */
export interface LicenseValidationResponse {
  /** The status of the validation request (e.g., 'valid', 'invalid'). */
  status: string;
  /** A human-readable message describing the result. */
  message: string;
  /** The license tier, if applicable. */
  tier?: string;
  /** The expiration date of the license, if applicable. */
  expires_at?: string;
}

/**
 * Defines the shape of the response from the download request endpoint.
 */
export interface DownloadRequestResponse {
  /** The status of the download request. */
  status: string;
  /** A message describing the outcome of the request. */
  message:string;
  /** The token to use for downloading the file, if the request is successful. */
  download_token?: string;
  /** The name of the file to be downloaded. */
  file_name?: string;
  /** The size of the file in bytes. */
  file_size?: number;
}

/**
 * Defines the shape of the response from the signature verification endpoint.
 */
export interface VerifySignatureResponse {
  /** A session token that can be used for subsequent authenticated requests. */
  session_token: string;
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

  const response = await fetch('/api/v1/licenses/validate', {
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
 * Verifies a signature against the Sovereign Utility API.
 * @param publicKey The public key of the user.
 * @param challenge The challenge that was signed.
 * @param signature The signature of the challenge.
 * @returns A promise that resolves to the verify signature response.
 */
export async function verifySignature(
  publicKey: string,
  challenge: string,
  signature: string,
): Promise<VerifySignatureResponse> {
  const response = await fetch(`/api/v2/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      public_key: publicKey,
      challenge: challenge,
      signature: signature,
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

  const response = await fetch('/api/v1/downloads/request', {
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
