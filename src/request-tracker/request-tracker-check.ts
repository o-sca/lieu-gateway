import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

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
