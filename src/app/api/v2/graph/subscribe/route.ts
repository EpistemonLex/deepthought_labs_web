import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/v2/graph/subscribe:
 *   get:
 *     summary: Placeholder for WebSocket-based graph subscription
 *     description: This endpoint is a placeholder for a future WebSocket connection that will handle real-time graph updates using Yjs.
 *     responses:
 *       200:
 *         description: A confirmation message indicating the endpoint is a placeholder.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: This is a placeholder for the WebSocket-based graph subscription endpoint.
 */
export async function GET() {
  // This will eventually be a WebSocket endpoint.
  // For now, it just returns a placeholder response.
  return NextResponse.json({
    message:
      'This is a placeholder for the WebSocket-based graph subscription endpoint.',
  });
}
