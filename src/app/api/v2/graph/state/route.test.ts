import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';
import { docs, WSSharedDoc } from '@/lib/y-websocket-utils';
import * as Y from 'yjs';
import { toUint8Array } from 'js-base64';

vi.mock('@/lib/y-websocket-utils', async () => {
  const actual = await vi.importActual('@/lib/y-websocket-utils');
  return {
    ...actual,
    docs: new Map(),
  };
});

describe('GET /api/v2/graph/state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    docs.clear();
  });

  it('should return 400 if graph_id is missing', async () => {
    const req = new NextRequest('http://localhost/api/v2/graph/state');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ error: 'graph_id is required' });
  });

  it('should return 404 if document is not found', async () => {
    const req = new NextRequest('http://localhost/api/v2/graph/state?graph_id=non-existent');
    const res = await GET(req);
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toEqual({ error: 'Document not found' });
  });

  it('should return 200 with the document state', async () => {
    const doc = new WSSharedDoc('test-doc');
    const yText = doc.getText('content');
    yText.insert(0, 'hello world');
    docs.set('test-doc', doc);

    const req = new NextRequest('http://localhost/api/v2/graph/state?graph_id=test-doc');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.state).toBeDefined();

    const update = toUint8Array(json.state);
    const newDoc = new Y.Doc();
    Y.applyUpdate(newDoc, update);

    expect(newDoc.getText('content').toString()).toBe('hello world');
  });
});
