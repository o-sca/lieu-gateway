import { Request } from 'express';

export const requestPathResolve = async (req: Request) => {
  if (req.url.includes('?')) {
    req.url += `&user_id=${req['user']['id']}`;
    return req.url;
  }
  return req.url + `?user_id=${req['user']['id']}`;
};
