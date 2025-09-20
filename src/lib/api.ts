// This file will contain the logic for interacting with the GenUI API.
export async function generateUI(prompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.white.ai/v1/genui', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // In a real application, this token would be securely managed,
        // for example, as an environment variable on the server-side.
        // 'Authorization': 'Bearer YOUR_SECRET_TOKEN',
      },
      body: JSON.stringify({
        prompt,
        constraints: { framework: 'react', style_guide: 'tailwind_css_v3' },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Throw an error with the message from the API
      throw new Error(data.error?.message || 'An unknown error occurred.');
    }

    // Decode Base64 UI component
    const decodedUI = atob(data.ui_component);
    return decodedUI;
  } catch (err) {
    console.error('Error generating UI:', err);
    // Re-throw the error to be handled by the calling function
    throw new Error(
      'Failed to connect to the UI generation service. Please check your network or try again later.',
    );
  }
}
