import { Request, Response } from 'express';
import { RequestWithId } from './types';
import { health, healthUpdate } from '../schema';
import { z } from 'zod';
import { prisma } from '../../config';

export class HealthController {
  async create(req: Request, res: Response) {
    try {
      const healthDto = health.parse(req.body);

      await prisma.health.create({ data: healthDto });

      return res.status(201).json({ message: 'Created' });
    } catch (e) {
      if (!(e instanceof Error))
        return res.status(400).json({ message: 'Unknown error' });

      if (e instanceof z.ZodError)
        return res.status(400).json({ message: e.issues });

      if ('code' in e) {
        switch (e.code) {
          case 'P2002':
            return res.status(400).json({ message: 'Duplicate entry' });
          default:
            return res.status(400).json({ message: 'Unknown error' });
        }
      }

      console.log(e);
      return res.status(400).json({ message: 'Unknown error' });
    }
  }
  async index(req: Request, res: Response) {
    const healths = await prisma.health.findMany();

    return res.status(200).json(healths);
  }
  async find(req: RequestWithId, res: Response) {
    const { id } = req.params;

    try {
      const health = await prisma.health.findUniqueOrThrow({
        where: { id: +id },
      });

      return res.status(200).json(health);
    } catch (e) {
      if (!(e instanceof Error))
        return res.status(400).json({ message: 'Unknown error' });

      if ('code' in e) {
        switch (e.code) {
          case 'P2002':
            return res.status(400).json({ message: 'Duplicate entry' });
          default:
            console.log(e.code);
            return res.status(400).json({ message: 'Unknown error' });
        }
      }

      console.log(e);
      return res.status(400).json({ message: 'Unknown error' });
    }
  }
  async update(req: RequestWithId, res: Response) {
    const { id } = req.params;

    try {
      const healthDto = healthUpdate.parse(req.body);

      await prisma.health.update({ where: { id: +id }, data: healthDto });

      return res.status(200).json({ message: 'Updated successfully' });
    } catch (e) {
      if (!(e instanceof Error))
        return res.status(400).json({ message: 'Unknown error' });

      if (e instanceof z.ZodError)
        return res.status(400).json({ message: e.issues });

      if ('code' in e) {
        switch (e.code) {
          case 'P2002':
            return res.status(400).json({ message: 'Duplicate entry' });
          default:
            return res.status(400).json({ message: 'Unknown error' });
        }
      }

      console.log(e);
      return res.status(400).json({ message: 'Unknown error' });
    }
  }
  async destroy(req: RequestWithId, res: Response) {
    const { id } = req.params;

    try {
      prisma.health.delete({ where: { id: +id } });

      return res.status(200).json({ message: 'Deleted successfully' });
    } catch (e) {
      if (!(e instanceof Error))
        return res.status(400).json({ message: 'Unknown error' });

      if ('code' in e) {
        switch (e.code) {
          case 'P2002':
            return res.status(400).json({ message: 'Duplicate entry' });
          default:
            return res.status(400).json({ message: 'Unknown error' });
        }
      }

      console.log(e);
      return res.status(400).json({ message: 'Unknown error' });
    }
  }
}
