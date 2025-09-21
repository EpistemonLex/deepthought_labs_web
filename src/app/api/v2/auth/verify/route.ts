import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { public_key, challenge, signature } = body;

    // Input validation
    if (!public_key || typeof public_key !== 'string' ||
        !challenge || typeof challenge !== 'string' ||
        !signature || typeof signature !== 'string') {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Missing or invalid required fields: public_key, challenge, and signature must be strings.' } },
        { status: 400 }
      );
    }

    // Mock verification logic as per the task requirements
    const isVerified = public_key.includes('MOCK_VALID_KEY') && signature.includes('MOCK_VALID_SIGNATURE');

    if (isVerified) {
      const jwtSecret = process.env.JWT_SESSION_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SESSION_SECRET is not set in environment variables.');
        return NextResponse.json(
          { error: { code: 'internal_server_error', message: 'Authentication secret is not configured.' } },
          { status: 500 }
        );
      }

      // Generate the JWT
      const sessionToken = jwt.sign({ sub: 'mock_user_id' }, jwtSecret, { expiresIn: '15m' });

      // Return the success response
      return NextResponse.json(
        {
          status: 'verified',
          session_token: sessionToken,
        },
        { status: 200 }
      );
    } else {
      // Return the failure response
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
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: { code: 'bad_request', message: 'Invalid JSON body.' } },
        { status: 400 }
      );
    }
    // Handle other unexpected errors
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: { code: 'internal_server_error', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}
