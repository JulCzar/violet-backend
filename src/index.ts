import { json } from 'express';
import cors from 'cors';
import routes from './routes';
import { app, socket } from '../config';

socket.on('connection', socket => {
  console.log(`user ${socket.id} connected`);

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

// middleware to log requests and method to console
app.use((req, _, next) => {
  console.log(
    new Date().toISOString(),
    req.method,
    req.url,
    req.ip,
    req.headers?.['user-agent']
  );
  next();
});

app.use(json());
app.use(cors());

app.use(routes);

export { server as default } from '../config';
