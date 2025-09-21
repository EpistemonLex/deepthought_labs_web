// This file will contain the logic for interacting with the GenUI API and Sovereign Utility API.

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

export * from './api/genui';
export * from './api/sovereign';
