import { NextRequest, NextResponse } from 'next/server';
import { docs } from '@/lib/y-websocket-utils';
import { getUpdate } from '@/lib/crdt';
import { fromUint8Array } from 'js-base64';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const graph_id = searchParams.get('graph_id');

  if (!graph_id) {
    return NextResponse.json({ error: 'graph_id is required' }, { status: 400 });
  }

  const doc = docs.get(graph_id);

  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  const update = getUpdate(doc);
  const base64Update = fromUint8Array(update);

  return NextResponse.json({ state: base64Update }, { status: 200 });
}
