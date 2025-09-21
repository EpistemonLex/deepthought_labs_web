import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: { code: 'bad_request', message: 'Missing download token.' } },
      { status: 400 }
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

  try {
    // PII Compliance Placeholder:
    // - Logging: In a real environment, access logs containing IP addresses
    //   would be anonymized after 30 days.
    const payload = jwt.verify(token, secretString) as jwt.JwtPayload;

    if (!payload.product_path) {
      return NextResponse.json(
        { error: { code: 'invalid_token', message: 'Invalid token payload.' } },
        { status: 403 }
      );
    }

    // In a real-world scenario, this would trigger a download.
    // For this mock, we'll return a JSON response indicating the path.
    return NextResponse.json({
      message: 'Redirecting to download.',
      path: payload.product_path,
    });
  } catch (error: unknown) {
    let code = 'invalid_token';
    let message = 'The download token is invalid.';

    if (error instanceof jwt.TokenExpiredError) {
      code = 'expired_token';
      message = 'The download token has expired.';
    } else if (error instanceof jwt.JsonWebTokenError) {
      // This catches other JWT errors like invalid signature
      message = 'The download token is invalid.';
    }

    return NextResponse.json(
      { error: { code, message } },
      { status: 403 }
    );
  }
}
