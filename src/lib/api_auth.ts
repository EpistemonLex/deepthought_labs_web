import { NextRequest, NextResponse } from 'next/server';

type ApiHandler = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

export function withApiKeyAuth(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, ...args: any[]) => {
    const apiKey = req.headers.get('X-API-Key');
    const expectedApiKey = process.env.INTEGRATOR_API_KEY;

    if (!expectedApiKey) {
      console.error('INTEGRATOR_API_KEY is not set in environment variables.');
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
