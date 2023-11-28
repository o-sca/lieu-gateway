import axios from 'axios';
import { Request } from 'express';
import { IncomingMessage } from 'http';

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
    if (!data['id']) {
      return proxyResData;
    }

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

    return JSON.stringify({
      message: 'successfully created account',
      user_type: data['user_type'],
    });
  } catch (err) {
    console.log(err);
    return proxyResData;
  }
};
