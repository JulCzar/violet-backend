import { Request } from 'express';
import type { RouteParameters } from 'express-serve-static-core';

type Id = ':id';
export type RequestWithId = Request<RouteParameters<Id>>;
