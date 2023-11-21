import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies['lieu.sid'];
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const response = await axios.get(
      `http://${process.env.AUTH_URL}/checklogin`,
      {
        headers: { cookie: req.headers.cookie },
      },
    );

    if (response.data.authenticated !== true) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};
