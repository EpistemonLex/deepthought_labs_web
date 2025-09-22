'use client';

import { useState } from 'react';
import ErrorMessage from './ErrorMessage';
import { requestDownload, DownloadRequestResponse } from '@/lib/api/sovereign';
import { ApiError } from '@/lib/api';

// Re-using the same base URL from api.ts for constructing the download link
const SOVEREIGN_API_BASE_URL = process.env.NEXT_PUBLIC_SOVEREIGN_API_URL || 'http://localhost:8000/api/v1';

export default function DownloadRequestForm() {
  const [licenseKey, setLicenseKey] = useState('');
  const [productId, setProductId] = useState('');
  const [version, setVersion] = useState('');
  const [platform, setPlatform] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadResponse, setDownloadResponse] = useState<DownloadRequestResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setDownloadResponse(null);

    try {
      const response = await requestDownload(licenseKey, productId, version, platform);
      setDownloadResponse(response);
    } catch (err) {
      if (err instanceof ApiError || err instanceof Error) {
        setError(`There seems to be an issue with the information you provided. Please review your input and try again. (Details: ${err.message})`);
      } else {
        setError('Something went wrong on our end. We\'ve been notified and are looking into it. Please try again in a few moments.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (downloadResponse?.download_token) {
      const downloadUrl = `${SOVEREIGN_API_BASE_URL}/downloads/retrieve/${downloadResponse.download_token}`;
      window.open(downloadUrl, '_blank');
    }
  };

  // Helper to format bytes into a readable string
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Software Download</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="dl-licenseKey" className="block text-gray-300 text-sm font-bold mb-2">
            License Key
          </label>
          <input
            type="text"
            id="dl-licenseKey"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dl-productId" className="block text-gray-300 text-sm font-bold mb-2">
            Product ID
          </label>
          <input
            type="text"
            id="dl-productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            placeholder="deepthought-pro"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dl-version" className="block text-gray-300 text-sm font-bold mb-2">
            Version
          </label>
          <input
            type="text"
            id="dl-version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            placeholder="1.0.0"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="dl-platform" className="block text-gray-300 text-sm font-bold mb-2">
            Platform
          </label>
          <select
            id="dl-platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>Select a platform</option>
            <option value="windows">Windows</option>
            <option value="macos">macOS</option>
            <option value="linux">Linux</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? 'Requesting...' : 'Request Download'}
          </button>
        </div>
      </form>
      {error && <ErrorMessage message={error} />}
      {downloadResponse && downloadResponse.status === 'success' && (
        <div className="mt-4 p-4 bg-green-900 border border-green-700 rounded">
           <p className="font-bold">Download Ready</p>
           <p className="text-white">File: {downloadResponse.file_name}</p>
           {downloadResponse.file_size && <p className="text-gray-300">Size: {formatBytes(downloadResponse.file_size)}</p>}
           <button
            onClick={handleDownload}
            className="mt-4 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
           >
             Download Now
           </button>
        </div>
      )}
       {downloadResponse && downloadResponse.status !== 'success' && (
        <div className="mt-4 p-4 bg-yellow-900 border border-yellow-700 rounded">
           <p className="font-bold">Info</p>
           <p className="text-white">{downloadResponse.message}</p>
        </div>
      )}
    </div>
  );
}
