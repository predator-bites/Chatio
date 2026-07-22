import 'dotenv';
import http from 'http';
import createServer from './createServer';
import { initIO } from './socket';
import { registerSocketHandlers } from './socket.handlers';

const port = process.env.PORT || 3333;
const app = createServer();

const httpServer = http.createServer(app);

const io = initIO(httpServer);

registerSocketHandlers(io);

httpServer.listen(port, () => {
  console.log(`Server is running on ${port} (HTTP + WebSocket)`);
});
