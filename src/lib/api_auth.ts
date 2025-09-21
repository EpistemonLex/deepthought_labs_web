import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiHandler = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

import crypto from 'crypto';

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

export function withBearerTokenAuth(handler: ApiHandler): ApiHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: NextRequest, ...args: any[]) => {
    const authHeader = req.headers.get('Authorization');
    const expectedToken = `Bearer ${process.env.NEXT_PUBLIC_GENUI_API_TOKEN}`;

    if (!authHeader || !process.env.NEXT_PUBLIC_GENUI_API_TOKEN) {
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

    return handler(req, ...args);
  };
}

export function withApiKeyAuth(handler: ApiHandler): ApiHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: NextRequest, ...args: any[]) => {
    const apiKey = req.headers.get('X-API-Key');
    const expectedApiKey = process.env.NEXT_PUBLIC_INTEGRATOR_API_KEY;

    if (!expectedApiKey) {
      console.error('NEXT_PUBLIC_INTEGRATOR_API_KEY is not set in environment variables.');
      return NextResponse.json(
        { error: { code: 'internal_server_error', message: 'API key is not configured.' } },
        { status: 500 }
      );
    }

    if (!apiKey || apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: { code: 'unauthorized', message: 'Invalid or missing API key.' } },
        { status: 401 }
      );
    }

    return handler(req, ...args);
  };
}
