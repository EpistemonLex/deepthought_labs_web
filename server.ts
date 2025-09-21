import { createServer, IncomingMessage } from 'http';
import { parse } from 'url';
import next from 'next';
import { upgradeHandler } from './src/lib/y-websocket-server';
import { Socket } from 'net';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  server.on('upgrade', (req: IncomingMessage, socket: Socket, head: Buffer) => {
    const parsedUrl = parse(req.url!, true);
    if (parsedUrl.pathname?.startsWith('/api/v2/graph/subscribe')) {
      upgradeHandler(req, socket, head);
    } else {
      socket.destroy();
    }
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
