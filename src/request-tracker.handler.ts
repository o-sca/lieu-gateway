import { Request } from 'express';
import { IncomingMessage } from 'http';

export const requestTrackerHandler = async (
  _proxyRes: IncomingMessage,
  proxyResData: Buffer,
  userReq: Request & { user?: unknown },
): Promise<Buffer> => {
  const data = JSON.parse(proxyResData.toString('utf8'));
  const user = userReq.user;
  if (!user) {
    return proxyResData;
  }

  console.log({
    user: user['id'],
    input: userReq.body['text'],
    output: data['summary_text'],
  });

  return proxyResData;
};
