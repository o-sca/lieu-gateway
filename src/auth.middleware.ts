import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers.cookie || !req.headers.cookie.includes('connect.sid')) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    const response = await axios.get(
      `${process.env.AUTH_URL}/api/v1/auth/checklogin`,
      {
        headers: { cookie: req.headers.cookie },
      },
    );

    if (response.data.authenticated !== true) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};
