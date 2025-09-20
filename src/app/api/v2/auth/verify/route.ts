import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { public_key, challenge, signature } = body;

    if (!public_key || !challenge || !signature) {
      return NextResponse.json(
        {
          error: {
            code: 'invalid_request',
            message: 'Missing required fields: public_key, challenge, or signature.',
          },
        },
        { status: 400 }
      );
    }

    // Mock verification logic
    const isVerified =
      public_key.includes('MOCK_VALID_KEY') && signature.includes('MOCK_VALID_SIGNATURE');

    if (isVerified) {
      const sessionToken = jwt.sign(
        { sub: 'mock_user_id' },
        process.env.JWT_SESSION_SECRET || 'default-secret',
        { expiresIn: '15m' }
      );

      return NextResponse.json({
        status: 'verified',
        session_token: sessionToken,
      });
    } else {
      return NextResponse.json(
        {
          status: 'failed',
          reason_code: 'invalid_signature',
          message: 'The provided signature could not be verified with the given public key.',
        },
        { status: 401 }
      );
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: {
            code: 'invalid_json',
            message: 'The request body is not valid JSON.',
          },
        },
        { status: 400 }
      );
    }

    console.error('Internal server error:', error);
    return NextResponse.json(
        {
            error: {
                code: 'internal_server_error',
                message: 'An unexpected error occurred.',
            },
        },
        { status: 500 }
    );
  }
}
