import { NextRequest, NextResponse } from 'next/server';
import { withApiKeyAuth } from '@/lib/api_auth';
import jwt from 'jsonwebtoken';
import { findLicense, findProduct } from '@/lib/database';

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

    const license = findLicense(license_key);
    if (!license || license.status !== 'active') {
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

    const product = findProduct(product_id, version, platform);
    if (!product) {
      return NextResponse.json(
        {
          error: {
            code: 'not_found',
            message: 'The requested product could not be found.',
          },
        },
        { status: 404 }
      );
    }

    // PII Compliance Placeholder:
    // - Logging: In a real environment, access logs containing IP addresses
    //   would be anonymized after 30 days.
    const secretString = process.env.JWT_DOWNLOAD_SECRET;
    if (!secretString) {
      console.error('JWT_DOWNLOAD_SECRET is not set.');
      return NextResponse.json(
        { error: { code: 'internal_server_error', message: 'JWT secret is not configured.' } },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { product_path: product.path },
      secretString,
      { expiresIn: '5m' }
    );

    const response = {
      download_token: token,
      expires_in: 300,
      file_name: product.path.split('/').pop(),
      file_size: 123456789, // This can remain mocked for now
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
