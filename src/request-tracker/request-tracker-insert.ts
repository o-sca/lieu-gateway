import { IncomingMessage } from 'http';
import { Request } from 'express';
import axios from 'axios';

export const requestTrackerInsert = async (
  proxyRes: IncomingMessage,
  proxyResData: Buffer,
  userReq: Request & { user?: unknown },
): Promise<Buffer> => {
  if (userReq.path !== '/summarise') {
    return proxyResData;
  }

  const data = JSON.parse(proxyResData.toString('utf8'));
  const user = userReq.user;
  if (!user) {
    return proxyResData;
  }

  const response = await axios({
    url: `http://${process.env.REQUEST_TRACKER_URL}/insert`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: {
      user_id: user['id'],
      input: userReq.body['text'],
      output: data['summary_text'],
    },
    validateStatus: () => true,
  });

  if (response.status !== 200 && response.status !== 201) {
    proxyRes.statusCode = response.status;
    proxyRes.statusMessage = response.statusText;
    proxyResData = Buffer.from(JSON.stringify(response.data));
    return proxyResData;
  }

  return proxyResData;
};
