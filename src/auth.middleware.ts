import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const authMiddleware = async (
  req: Request & { user?: unknown },
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies['lieu.sid'];
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const response = await axios.get(`http://${process.env.AUTH_URL}/me`, {
      headers: { cookie: req.headers.cookie },
      validateStatus: () => true,
    });

    if (response.status === 403) {
      return res.status(403).send({ error: response.data['message'] });
    }

    const user = response.data;
    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    if (err) return res.status(500).send({ error: 'Internal Server Error' });
  }
};
