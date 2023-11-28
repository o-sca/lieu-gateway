import { Request } from 'express';

export const filterRequestPath = (req: Request) => {
  if (req.path === '/') {
    return true;
  }

  if (req.path === '/create' || req.path === '/insert') {
    return false;
  }

  if (req['user']['user_type'] !== 'ADMIN') {
    return false;
  }

  return true;
};
