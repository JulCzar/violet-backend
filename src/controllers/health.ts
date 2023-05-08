import { Request, Response } from 'express';
import { RequestWithId } from './types';
import { health, healthUpdate } from '../schema';
import { z } from 'zod';
import { prisma, socket } from '../../config';
import { socketKeys } from '../../config/socket_keys';
import { errorResponse, successResponse, unknownError } from './messages';

export class HealthController {
  async create(req: Request, res: Response) {
    try {
      const healthDto = health.parse(req.body);

      await prisma.health.create({ data: healthDto });

      socket.emit(socketKeys.HEALTH_ACTION);

      return res.status(201).json(successResponse('Created'));
    } catch (e) {
      if (!(e instanceof Error)) return res.status(400).json(unknownError);

      if (e instanceof z.ZodError)
        return res
          .status(400)
          .json(
            errorResponse('Validation error', 'E0001', { issues: e.issues })
          );

      if ('code' in e) {
        switch (e.code) {
          case 'P2002':
            return res
              .status(400)
              .json(errorResponse('Duplicate entry', 'P2002'));
          default:
            return res
              .status(400)
              .json(errorResponse('Unknown error', e.code + ''));
        }
      }

      console.log(e);
      return res.status(400).json(unknownError);
    }
  }
  async index(req: Request, res: Response) {
    const healths = await prisma.health.findMany();

    return res.status(200).json(successResponse('', { healths }));
  }
  async find(req: RequestWithId, res: Response) {
    const { id } = req.params;

    try {
      const health = await prisma.health.findUniqueOrThrow({
        where: { id: +id },
      });

      return res.status(200).json(successResponse('', health));
    } catch (e) {
      if (!(e instanceof Error)) return res.status(400).json(unknownError);

      if ('code' in e) {
        switch (e.code) {
          case 'P2002':
            return res
              .status(400)
              .json(errorResponse('Duplicate entry', 'P2002'));
          default:
            console.log(e.code);
            return res
              .status(400)
              .json(errorResponse('Unknown error', e.code + ''));
        }
      }

      console.log(e);
      return res.status(400).json(unknownError);
    }
  }
  async update(req: RequestWithId, res: Response) {
    const { id } = req.params;

    try {
      const healthDto = healthUpdate.parse(req.body);

      await prisma.health.update({ where: { id: +id }, data: healthDto });

      socket.emit(socketKeys.HEALTH_ACTION);
      return res.status(200).json(successResponse('Updated successfully'));
    } catch (e) {
      if (!(e instanceof Error)) return res.status(400).json(unknownError);

      if (e instanceof z.ZodError)
        return res.status(400).json(
          errorResponse('Validation error', 'Z0001', {
            issues: e.issues,
          })
        );

      if ('code' in e) {
        switch (e.code) {
          case 'P2002':
            return res
              .status(400)
              .json(errorResponse('Duplicate entry', e.code));
          default:
            return res
              .status(400)
              .json(errorResponse('Unknown error', e.code + ''));
        }
      }

      console.log(e);
      return res.status(400).json(unknownError);
    }
  }
  async destroy(req: RequestWithId, res: Response) {
    const { id } = req.params;

    try {
      prisma.health.delete({ where: { id: +id } });

      socket.emit(socketKeys.HEALTH_ACTION);
      return res.status(200).json(successResponse('Deleted successfully'));
    } catch (e) {
      if (!(e instanceof Error)) return res.status(400).json(unknownError);

      if ('code' in e) {
        switch (e.code) {
          case 'P2002':
            return res
              .status(400)
              .json(errorResponse('Duplicate entry', e.code));
          default:
            return res
              .status(400)
              .json(errorResponse('Unknown error', e.code + ''));
        }
      }

      console.log(e);
      return res.status(400).json(unknownError);
    }
  }
}
