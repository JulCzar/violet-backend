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

app.use(json());
app.use(cors());

app.use(routes);

export { server as default } from '../config';
