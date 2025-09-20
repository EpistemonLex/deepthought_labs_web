import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  // Mock response for now
  const mockGeneratedUI = `
    <div style="padding: 20px; border: 1px solid #4CAF50; border-radius: 8px; background-color: #222; color: #eee; text-align: left;">
      <h3 style="color: #4CAF50; margin-bottom: 10px;">Generated UI for: "${prompt}"</h3>
      <p>This is a mock UI. In a real scenario, an AI would generate a complex UI based on your prompt.</p>
      <div style="margin-top: 15px; padding: 10px; background-color: #333; border-radius: 4px;">
        <p><strong>Example Element:</strong></p>
        <button style="background-color: #007bff; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">Click Me</button>
        <input type="text" placeholder="Type something..." style="margin-left: 10px; padding: 8px; border-radius: 5px; border: 1px solid #555; background-color: #444; color: white;" />
      </div>
    </div>
  `;

  return NextResponse.json({ ui: mockGeneratedUI });
}
