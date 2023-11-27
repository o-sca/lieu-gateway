import { NextFunction, Request, Response } from 'express';
import { IncomingMessage } from 'http';
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

export const requestTrackerCreate = async (
  proxyRes: IncomingMessage,
  proxyResData: Buffer,
  userReq: Request,
) => {
  if (userReq.path !== '/signup') {
    return proxyResData;
  }

  try {
    const data = JSON.parse(proxyResData.toString('utf8'));

    const response = await axios({
      url: `http://${process.env.REQUEST_TRACKER_URL}/create`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { id: data['id'] },
      validateStatus: () => true,
    });

    if (response.status !== 200 && response.status !== 201) {
      proxyRes.statusCode = response.status;
      proxyRes.statusMessage = response.statusText;
      proxyResData = Buffer.from(JSON.stringify(response.data));
      return proxyResData;
    }

    return JSON.stringify({ message: 'successfully created account' });
  } catch (err) {
    console.log(err);
    return proxyResData;
  }
};

export const requestTrackerCheck = async (
  req: Request & { user?: unknown },
  res: Response,
  next: NextFunction,
) => {
  const response = await axios({
    url: `http://${process.env.REQUEST_TRACKER_URL}/availableapi?user_id=${req.user['id']}`,
    method: 'GET',
    validateStatus: () => true,
  });

  if (response.status !== 200) {
    return res.status(500).send({ error: response.data['message'] });
  }

  if (!response.data['activated']) {
    return res
      .status(402)
      .send({ error: 'Max free usage exceeded. Upgrade required' });
  }

  return next();
};
