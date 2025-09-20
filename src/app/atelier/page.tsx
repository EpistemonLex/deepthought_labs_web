// This file will contain the interactive GenUI demo for The Atelier.
import { useState } from 'react';

export default function Atelier() {
  const [prompt, setPrompt] = useState('');
  const [generatedUI, setGeneratedUI] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateUI = async () => {
    setIsLoading(true);
    setGeneratedUI(''); // Clear previous UI
    setError(null); // Clear previous error

    try {
      const response = await fetch('https://api.white.ai/v1/genui', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Placeholder for authentication. Token needs to be securely provided.
          // 'Authorization': 'Bearer YOUR_SECRET_TOKEN',
        },
        body: JSON.stringify({ prompt, constraints: { framework: 'react', style_guide: 'tailwind_css_v3' } }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors based on the specified error schema
        setError(data.error?.message || 'An unknown error occurred.');
        return;
      }

      // Decode Base64 UI component
      const decodedUI = atob(data.ui_component);
      setGeneratedUI(decodedUI);

    } catch (err) {
      console.error('Error generating UI:', err);
      setError('Failed to connect to the UI generation service. Please check your network or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center border-b border-gray-700 pb-4">
        <a href="/" className="text-2xl font-bold">DeepThought Labs</a>
        <nav>
          <a href="/whitepaper" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Whitepaper</a>
          <a href="/ukw-framework" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">UKW Framework</a>
          <a href="/roadmap" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Roadmap</a>
          <a href="/atelier" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">The Atelier</a>
          <a href="/#contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</a>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-extrabold">The Atelier: The Workbench for Agentic AI</h2>
        <p className="mt-4 text-xl text-gray-400">Experience the Architecture of Synthesis firsthand. Describe a UI element, and watch it emerge.</p>
        
        <div className="mt-10 flex flex-col items-center">
          <textarea
            className="w-full max-w-2xl p-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
            placeholder="Describe the UI you want to generate, e.g., 'A user profile card with an avatar, name, and a follow button.'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          ></textarea>
          <button 
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerateUI}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate UI'}
          </button>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-900 text-red-200 rounded-lg max-w-2xl mx-auto">
            <p>{error}</p>
          </div>
        )}

        <div className="mt-16 p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Generated UI Mock-up</h3>
          {generatedUI ? (
            <iframe
              className="w-full h-96 border-none rounded-md bg-white"
              sandbox="allow-scripts allow-same-origin"
              srcDoc={generatedUI}
            ></iframe>
          ) : (
            <div className="bg-gray-700 h-96 flex items-center justify-center text-gray-400 text-xl rounded-md">
              {isLoading ? 'Generating UI...' : 'Your generated UI will appear here.'}
            </div>
          )}
        </div>
      </main>
      <footer className="bg-gray-900 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} DeepThought Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
