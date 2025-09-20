import { NextRequest, NextResponse } from 'next/server';
import { withApiKeyAuth } from '@/lib/api_auth';
import jwt from 'jsonwebtoken';

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { license_key, product_id, version, platform } = body;

    if (!license_key || !product_id || !version || !platform) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Missing required fields.' } },
        { status: 400 }
      );
    }

    // Mock license validation
    if (!license_key.startsWith('DTL-VALID-')) {
      return NextResponse.json(
        {
          error: {
            code: 'forbidden',
            message: 'The provided license key is not valid or does not grant download access.',
          },
        },
        { status: 403 }
      );
    }

    const secretString = process.env.JWT_DOWNLOAD_SECRET;
    if (!secretString) {
      console.error('JWT_DOWNLOAD_SECRET is not set.');
      return NextResponse.json(
        { error: { code: 'internal_server_error', message: 'JWT secret is not configured.' } },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { product_id, version, platform },
      secretString,
      { expiresIn: '5m' }
    );

    const response = {
      download_token: token,
      expires_in: 300,
      // Mocked file details
      file_name: `DeepThought-${version}-${platform}.dmg`,
      file_size: 123456789,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Invalid JSON body.' } },
        { status: 400 }
      );
    }
    console.error('Download request error:', error);
    return NextResponse.json(
      { error: { code: 'internal_server_error', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}

export const POST = withApiKeyAuth(handler);
