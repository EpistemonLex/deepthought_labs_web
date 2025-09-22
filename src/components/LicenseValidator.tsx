'use client';

import { useState } from 'react';
import ErrorMessage from './ErrorMessage';
import { validateLicense, LicenseValidationResponse } from '@/lib/api/sovereign';
import { ApiError } from '@/lib/api';

export default function LicenseValidator() {
  const [licenseKey, setLicenseKey] = useState('');
  const [productId, setProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResponse, setValidationResponse] = useState<LicenseValidationResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationResponse(null);

    try {
      // TODO: Implement a proper client-side device fingerprinting mechanism.
      const fingerprint = { agent: navigator.userAgent, lang: navigator.language };
      const response = await validateLicense(licenseKey, productId, fingerprint);
      setValidationResponse(response);
    } catch (err) {
      if (err instanceof ApiError || err instanceof Error) {
        setError(`An unexpected issue occurred while processing your request. Please try again. If the problem continues, this information may be helpful for support. (Details: ${err.message})`);
      } else {
        setError('Something went wrong on our end. We\'ve been notified and are looking into it. Please try again in a few moments.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-4">License Validator</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="licenseKey" className="block text-gray-300 text-sm font-bold mb-2">
            License Key
          </label>
          <input
            type="text"
            id="licenseKey"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="productId" className="block text-gray-300 text-sm font-bold mb-2">
            Product ID
          </label>
          <input
            type="text"
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            placeholder="deepthought-pro"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? 'Validating...' : 'Validate License'}
          </button>
        </div>
      </form>
      {error && <ErrorMessage message={error} />}
      {validationResponse && (
        <div className={`mt-4 p-4 rounded ${validationResponse.status === 'valid' ? 'bg-green-900 border border-green-700' : 'bg-yellow-900 border border-yellow-700'}`}>
           <p className="font-bold">Validation Result</p>
           <p className="text-white">{validationResponse.message}</p>
           {validationResponse.tier && <p className="text-gray-300">Tier: {validationResponse.tier}</p>}
           {validationResponse.expires_at && <p className="text-gray-300">Expires: {new Date(validationResponse.expires_at).toLocaleDateString()}</p>}
        </div>
      )}
    </div>
  );
}
