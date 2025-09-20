import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sanitizeHtml from 'sanitize-html';

class ServiceUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceUnavailableError';
  }
}

// Helper function for timing-safe buffer comparison
function timingSafeEqual(a: string, b: string): boolean {
  try {
    const aBuffer = Buffer.from(a, 'utf8');
    const bBuffer = Buffer.from(b, 'utf8');

    if (aBuffer.length !== bBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(aBuffer, bBuffer);
  } catch (error) {
    console.error('Error in timingSafeEqual:', error);
    return false;
  }
}

async function runAIPrompt(prompt: string) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const model = '@cf/meta/llama-3.1-8b-instruct';

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    if (response.status === 503) {
      throw new ServiceUnavailableError('The AI service is temporarily unavailable.');
    }
    const errorText = await response.text();
    console.error("Cloudflare AI Error:", errorText);
    throw new Error(`Cloudflare AI API request failed with status ${response.status}`);
  }

  const json: any = await response.json();
  if (!json.success) {
    console.error("Cloudflare AI Error:", json.errors);
    throw new Error("Cloudflare AI request was not successful.");
  }
  return json.result.response;
}

export async function POST(request: Request) {
  const startTime = Date.now();

  // 1. Authentication
  const authHeader = request.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.GENUI_API_TOKEN}`;

  if (!authHeader || !process.env.GENUI_API_TOKEN) {
    return NextResponse.json({
      ui_component: null,
      metadata: null,
      error: {
        code: 'authentication_failed',
        message: 'A valid API token is required.',
      },
    }, { status: 401 });
  }

  if (!timingSafeEqual(authHeader, expectedToken)) {
    return NextResponse.json({
      ui_component: null,
      metadata: null,
      error: {
        code: 'authentication_failed',
        message: 'A valid API token is required.',
      },
    }, { status: 401 });
  }

  // 2. Input Validation
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({
      ui_component: null,
      metadata: null,
      error: {
        code: 'invalid_request',
        message: 'The request body is malformed or missing.',
      },
    }, { status: 400 });
  }

  const { prompt } = body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return NextResponse.json({
      ui_component: null,
      metadata: null,
      error: {
        code: 'invalid_request',
        message: "The 'prompt' field is required and must be a non-empty string.",
      },
    }, { status: 400 });
  }

  try {
    // 3. Multi-Step Prompting
    // Step 1: Deconstruction
    const deconstructionPrompt = `
      Persona: "You are an expert UI/UX architect and senior frontend developer."
      Task: "Analyze the following user request. Deconstruct it into a hierarchical component structure. Describe this structure as a JSON object. Identify the primary container, all child elements, their semantic HTML tags, necessary attributes, and any placeholder text content. Do not write any code. Your output must be a valid JSON object."
      User Input: "${prompt}"
    `;
    const deconstructionResult = await runAIPrompt(deconstructionPrompt);
    const uiStructure = JSON.parse(deconstructionResult);

    // Step 2: Code Generation
    const codeGenPrompt = `
      Persona: "You are an expert React developer specializing in writing clean, secure, and accessible JSX code using Tailwind CSS."
      Task: "Based only on the following JSON structure, generate a single, self-contained React functional component. Adhere strictly to the component hierarchy and attributes provided. Do not include any event handlers (like onClick), state management, or external dependencies. Wrap the entire output in a single <div>."
      Negative Constraints: "DO NOT include <script> tags. DO NOT include inline event handlers such as onclick, onmouseover, etc. DO NOT include inline style attributes."
      Input Data: ${JSON.stringify(uiStructure)}
    `;
    const generatedCode = await runAIPrompt(codeGenPrompt);

    // 4. Sanitization
    const sanitizedCode = sanitizeHtml(generatedCode, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'button', 'input', 'label', 'div', 'h3', 'p']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['class', 'style', 'type', 'placeholder', 'for', 'id', 'name']
      },
      disallowedTagsMode: 'discard',
      selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
      // Disallow all on* event handlers
      exclusiveFilter: function(frame) {
        return Object.keys(frame.attribs).some(attr => attr.startsWith('on'));
      }
    });

    const endTime = Date.now();
    const generationTimeMs = endTime - startTime;

    return NextResponse.json({
      ui_component: Buffer.from(sanitizedCode).toString('base64'),
      metadata: {
        model_used: '@cf/meta/llama-3.1-8b-instruct',
        generation_time_ms: generationTimeMs,
      },
      error: null,
    });

  } catch (error: any) {
    console.error(error);
    if (error instanceof ServiceUnavailableError) {
      return NextResponse.json({
        ui_component: null,
        metadata: null,
        error: {
          code: 'service_unavailable',
          message: 'The UI generation service is temporarily unavailable. Please try again in a few minutes.',
        },
      }, { status: 503 });
    }

    return NextResponse.json({
      ui_component: null,
      metadata: null,
      error: {
        code: 'internal_server_error',
        message: 'An unexpected error occurred during AI model execution.',
      },
    }, { status: 500 });
  }
}
