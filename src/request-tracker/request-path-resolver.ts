import { Request } from 'express';

export const requestPathResolve = async (req: Request) => {
  const updatedPath = req.path + '?user_id=' + req['user']['id'];
  return updatedPath;
};
