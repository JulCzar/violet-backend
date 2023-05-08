import { Request, Response } from 'express';
import { z } from 'zod';
import { user } from '../schema';
import { prisma } from '../../config';
import { RequestWithId } from './types';

export class UserController {
  async create(req: Request, res: Response) {
    const userData = user.parse(req.body);

    try {
      const userCreated = await prisma.user.create({ data: userData });

      res.json({
        message: `User ${userCreated.name} created with id ${userCreated.id}`,
        user: userCreated,
      });
    } catch (e) {
      if (!(e instanceof Error))
        return res.status(400).json({ error: 'Unknown error' });

      if (e instanceof z.ZodError) {
        return res.status(417).json({ error: e.issues });
      }

      if ('code' in e) {
        switch (e.code) {
          case 'P2002':
            return res.status(400).json({ error: 'User already exists' });
          default:
            return res.status(400).json({ error: 'Unknown error' });
        }
      }

      return res.status(400).json({ error: e.message });
    }
  }
  async index(_: unknown, res: Response) {
    const users = await prisma.user.findMany();

    res.json(users);
  }
  async find(req: RequestWithId, res: Response) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: +id } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json(user);
  }
  async update(req: RequestWithId, res: Response) {
    const { id } = req.params;
    try {
      const userData = user.parse(req.body);

      const userUpdated = await prisma.user.update({
        where: { id: +id },
        data: userData,
      });

      return res.json({
        message: `User ${userUpdated.name} updated with success`,
      });
    } catch (e) {
      if (!(e instanceof Error))
        return res.status(400).json({ error: 'Unknown error' });

      if (e instanceof z.ZodError)
        return res.status(417).json({ error: e.issues });

      if ('code' in e) {
        switch (e.code) {
          case 'P2002':
            return res.status(400).json({ error: 'User already exists' });
          default:
            return res.status(400).json({ error: 'Unknown error' });
        }
      }

      return res.status(400).json({ error: e.message });
    }
  }
  async destroy(req: RequestWithId, res: Response) {
    const { id } = req.params;

    try {
      await prisma.user.delete({ where: { id: +id } });

      return res.json({ message: 'User deleted with success' });
    } catch (e) {
      if (!(e instanceof Error))
        return res.status(400).json({ error: 'Unknown error' });

      if ('code' in e) {
        switch (e.code) {
          default:
            return res.status(400).json({ error: 'Unknown error' });
        }
      }

      return res.status(400).json({ error: e.message });
    }
  }
  async findOrCreate(req: Request, res: Response) {
    try {
      const { name } = user.parse(req.body);

      const _user = await prisma.user.upsert({
        where: { name },
        create: { name },
        update: { name },
      });

      return res.json(_user);
    } catch (e) {
      if (!(e instanceof Error))
        return res.status(400).json({ error: 'Unknown error' });

      if (e instanceof z.ZodError) {
        return res
          .status(417)
          .json({ error: 'é necessário informar o nome do usuário' });
      }
    }
  }
}
