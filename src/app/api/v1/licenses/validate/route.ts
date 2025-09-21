import { NextRequest, NextResponse } from 'next/server';
import { withApiKeyAuth } from '@/lib/api_auth';
import { findLicense } from '@/lib/database';

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    // PII Compliance: Data Minimization
    // Only process the necessary fields for license validation.
    // Do not log or store any other PII from the request.
    const { license_key, product_id, fingerprint } = body;

    // Basic input validation
    if (!license_key || !product_id || !fingerprint) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Missing required fields.' } },
        { status: 400 }
      );
    }

    // PII Compliance Placeholders:
    // - Encryption: In a real database, the license_key and fingerprint would be
    //   encrypted at rest (e.g., AES-256).
    // - Access Control: Access to this data would be restricted via RBAC to
    //   authorized personnel only.
    // - Retention Policy: Data would be retained only for the license
    //   duration + 180 days for recovery purposes.

    const license = findLicense(license_key);

    if (!license) {
      return NextResponse.json(
        {
          status: 'invalid',
          reason_code: 'not_found',
          message: 'The provided license key does not exist.',
        },
        { status: 404 }
      );
    }

    if (license.status !== 'active') {
      return NextResponse.json(
        {
          status: 'invalid',
          reason_code: license.status,
          message: `The provided license key is ${license.status}.`,
        },
        { status: 403 }
      );
    }

    const response = {
      status: 'valid',
      license_key: license.key,
      tier: license.tier,
      expires_at: license.expires_at,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Invalid JSON body.' } },
        { status: 400 }
      );
    }
    console.error('License validation error:', error);
    return NextResponse.json(
      { error: { code: 'internal_server_error', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}

export const POST = withApiKeyAuth(handler);
