'use client';
// This file will contain the interactive GenUI demo for The Atelier.
import { useState } from 'react';
import { generateUI, ApiError } from '../../lib/api';
import Header from '../../components/Header';
import ErrorMessage from '@/components/ErrorMessage';

export default function Atelier() {
  const [prompt, setPrompt] = useState('');
  const [generatedUI, setGeneratedUI] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateUI = async () => {
    if (!prompt.trim()) {
      setError("To get started, please describe the UI you'd like to create in the text box above.");
      return;
    }
    setIsLoading(true);
    setGeneratedUI(''); // Clear previous UI
    setError(null); // Clear previous error

    try {
      const decodedUI = await generateUI(prompt);
      setGeneratedUI(decodedUI);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        // Use a switch to handle specific API error statuses
        // The messages are taken directly from the 'Transparent.md' blueprint
        switch (err.status) {
          case 400:
            setError(
              `There seems to be an issue with the information you provided. Please review your input and try again. (Details: ${err.message})`,
            );
            break;
          case 401:
            setError(
              `We couldn't verify your session. Please try logging in again. If the problem continues, our support team is here to help. (Details: ${err.message})`,
            );
            break;
          case 429:
            setError(
              `You've made a few too many requests in a short time. To protect the service, we need to ask you to please wait a moment before trying again.`,
            );
            break;
          case 503:
            setError(
              `It looks like the AI service is currently unavailable or very busy. We're working on it, and it should be back online shortly. Please try again in a few minutes.`,
            );
            break;
          default:
            setError(`An unexpected issue occurred while processing your request. Please try again. If the problem continues, this information may be helpful for support. (Details: ${err.message})`);
            break;
        }
      } else if (err instanceof Error) {
        setError(`An unexpected issue occurred while processing your request. Please try again. If the problem continues, this information may be helpful for support. (Details: ${err.message})`);
      } else {
        setError('Something went wrong on our end. We\'ve been notified and are looking into it. Please try again in a few moments.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-6xl font-extrabold">
          The Atelier: The Workbench for Agentic AI
        </h2>
        <p className="mt-4 text-xl text-gray-400">
          Experience the Architecture of Synthesis firsthand. Describe a UI
          element, and watch it emerge.
        </p>

        <div className="mt-10 flex flex-col items-center">
          <textarea
            className={`w-full max-w-3xl p-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'ring-2 ring-offset-2 ring-[#007AFF] animate-pulse' : ''
            }`}
            rows={12}
            placeholder="Describe the UI you want to generate, e.g., 'A user profile card with an avatar, name, and a follow button.'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          ></textarea>
          <button
            className="mt-6 bg-[#007AFF] hover:bg-[#0056b3] text-white font-bold py-3 px-8 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerateUI}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? 'Generating...' : 'Generate UI'}
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="mt-16 p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Generated UI Mock-up</h3>
          {generatedUI ? (
            <iframe
              title="Generated UI"
              className="w-full h-96 border-none rounded-md bg-white"
              sandbox="allow-scripts allow-same-origin"
              srcDoc={generatedUI}
            ></iframe>
          ) : (
            <div className="bg-gray-700 h-96 flex items-center justify-center text-gray-400 text-xl rounded-md">
              {isLoading
                ? 'Generating UI...'
                : 'Your generated UI will appear here.'}
            </div>
          )}
        </div>
      </main>
      <footer className="bg-gray-900 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} DeepThought Labs. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
