import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { wss, upgradeHandler } from './y-websocket-server';
import { WebsocketProvider } from 'y-websocket';
import WebSocket from 'ws';
import * as Y from 'yjs';
import http from 'http';
import { Server, AddressInfo } from 'net';

describe('y-websocket-server', () => {
  let server: Server;
  let port: number;

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = http.createServer();
      server.on('upgrade', (req, socket, head) => {
        upgradeHandler(req, socket, head);
      });
      server.listen(0, () => {
        port = (server.address() as AddressInfo).port;
        resolve();
      });
    });
  });

  afterAll(() => {
    wss.clients.forEach((client) => client.close());
    wss.close();
    server.close();
  });

  it('should handle WebSocket connections', async () => {
    const doc = new Y.Doc();
    const provider = new WebsocketProvider(`ws://localhost:${port}`, 'test-doc-1', doc, { WebSocketPolyfill: WebSocket as typeof WebSocket });
    await new Promise<void>((resolve) => provider.on('status', (event: { status: string }) => {
      if (event.status === 'connected') {
        expect(provider.wsconnected).toBe(true);
        provider.disconnect();
        resolve();
      }
    }));
  });

  it('should broadcast updates to clients in the same room', async () => {
    const docName = 'test-doc-2';
    const doc1 = new Y.Doc();
    const provider1 = new WebsocketProvider(`ws://localhost:${port}`, docName, doc1, { WebSocketPolyfill: WebSocket as typeof WebSocket });

    const doc2 = new Y.Doc();
    const provider2 = new WebsocketProvider(`ws://localhost:${port}`, docName, doc2, { WebSocketPolyfill: WebSocket as typeof WebSocket });

    await new Promise<void>((resolve) => provider1.on('status', (event: { status: string }) => event.status === 'connected' && resolve()));
    await new Promise<void>((resolve) => provider2.on('status', (event: { status: string }) => event.status === 'connected' && resolve()));

    const promise = new Promise<void>((resolve) => {
        doc2.getMap('test-map').observe(() => {
            resolve();
        });
    });

    doc1.getMap('test-map').set('key', 'value');

    await promise;

    expect(doc2.getMap('test-map').get('key')).toBe('value');

    provider1.disconnect();
    provider2.disconnect();
  });

  it('should not broadcast updates to clients in different rooms', async () => {
    const docName1 = 'test-doc-3';
    const docName2 = 'test-doc-4';

    const doc1 = new Y.Doc();
    const provider1 = new WebsocketProvider(`ws://localhost:${port}`, docName1, doc1, { WebSocketPolyfill: WebSocket as typeof WebSocket });

    const doc2 = new Y.Doc();
    const provider2 = new WebsocketProvider(`ws://localhost:${port}`, docName2, doc2, { WebSocketPolyfill: WebSocket as typeof WebSocket });

    const doc3 = new Y.Doc();
    const provider3 = new WebsocketProvider(`ws://localhost:${port}`, docName1, doc3, { WebSocketPolyfill: WebSocket as typeof WebSocket });

    const spy = vi.fn();
    doc2.getMap('test-map').observe(spy);


    await new Promise<void>((resolve) => provider1.on('status', (event: { status: string }) => event.status === 'connected' && resolve()));
    await new Promise<void>((resolve) => provider2.on('status', (event: { status: string }) => event.status === 'connected' && resolve()));
    await new Promise<void>((resolve) => provider3.on('status', (event: { status: string }) => event.status === 'connected' && resolve()));

    const promise = new Promise<void>((resolve) => {
        doc3.getMap('test-map').observe(() => {
            resolve();
        });
    });

    doc1.getMap('test-map').set('key', 'value');

    await promise;

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(doc3.getMap('test-map').get('key')).toBe('value');
    expect(doc2.getMap('test-map').get('key')).toBeUndefined();
    expect(spy).not.toHaveBeenCalled();

    provider1.disconnect();
    provider2.disconnect();
    provider3.disconnect();
  });
});
