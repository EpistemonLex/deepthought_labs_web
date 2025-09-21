import { ApiError } from '../api';

export async function generateUI(prompt: string): Promise<string> {
  const token = process.env.NEXT_PUBLIC_GENUI_API_TOKEN;

  if (!token) {
    throw new ApiError(
      'The API token is not configured. Please contact the administrator.',
      500,
    );
  }

  const response = await fetch('/api/genui', {
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
