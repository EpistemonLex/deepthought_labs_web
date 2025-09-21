import { NextRequest, NextResponse } from 'next/server';
import { withApiKeyAuth } from '@/lib/api_auth';

const SOVEREIGN_API_BASE_URL = process.env.SOVEREIGN_API_URL || 'http://localhost:8000/api/v1';

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { license_key, product_id, fingerprint } = body;

    // Basic input validation
    if (!license_key || !product_id || !fingerprint) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Missing required fields.' } },
        { status: 400 }
      );
    }

    const response = await fetch(`${SOVEREIGN_API_BASE_URL}/licenses/validate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.INTEGRATOR_API_KEY || '',
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    return new NextResponse(JSON.stringify(data), {
        status: response.status,
        headers: {
            'Content-Type': 'application/json',
        },
    });

  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Invalid JSON body.' } },
        { status: 400 }
      );
    }
    console.error('License validation proxy error:', error);
    return NextResponse.json(
      { error: { code: 'internal_server_error', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}

export const POST = withApiKeyAuth(handler);
