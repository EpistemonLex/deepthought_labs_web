import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { setupWSConnection } from './y-websocket-utils';

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (conn: WebSocket, req: http.IncomingMessage) => {
  setupWSConnection(conn, req);
});

export const upgradeHandler = (
  req: http.IncomingMessage,
  socket: any,
  head: Buffer
) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
};

// This is for testing purposes
export { wss };
