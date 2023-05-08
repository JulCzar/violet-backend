import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

export const PORT = process.env.PORT || '8000';
export const prisma = new PrismaClient();
export const app = express();
export const server = http.createServer(app);
export const socket = new Server(server);
