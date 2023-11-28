import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const logEndpoint = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const response = await axios({
    url: `http://${process.env.REQUEST_TRACKER_URL}/log`,
    method: 'POST',
    data: {
      path: req.path,
      method: req.method,
    },
    validateStatus: () => true,
  });

  if (response.status !== 200 && response.status !== 201) {
    return res.status(500).json({ error: response.data['message'] });
  }
  return next();
};
