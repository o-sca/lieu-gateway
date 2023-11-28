import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import proxy from 'express-http-proxy';
import swagger from 'swagger-ui-express';
import { authMiddleware } from './auth.middleware';
import {
  filterRequestPath,
  logEndpoint,
  requestPathResolve,
  requestTrackerCheck,
  requestTrackerCreate,
  requestTrackerInsert,
} from './request-tracker';
import swaggerDoc from './api-docs.json';

async function bootstrap() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: [
        'http://localhost:4200',
        'http://localhost:8000',
        /\.vercel\.app$/,
      ],
      credentials: true,
      methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'HEAD'],
    }),
  );

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  app.use('/docs', swagger.serve, swagger.setup(swaggerDoc));

  app.use(logEndpoint);

  app.use(
    '/api/v1/auth',
    proxy(process.env.AUTH_URL, {
      userResDecorator: requestTrackerCreate,
    }),
  );

  app.use(
    '/api/v1/ai/text',
    authMiddleware,
    requestTrackerCheck,
    proxy(process.env.TEXT_AI_URL, {
      userResDecorator: requestTrackerInsert,
    }),
  );

  // app.use('/api/v1/ai/gen', authMiddleware, proxy(process.env.GEN_AI_URL));

  app.use(
    '/api/v1/requests',
    authMiddleware,
    proxy(process.env.REQUEST_TRACKER_URL, {
      filter: filterRequestPath,
      proxyReqPathResolver: requestPathResolve,
    }),
  );

  app.use('*', (_req, res) => {
    return res.status(404).send();
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log('Serving on port:', process.env.PORT || 3000);
  });
}
bootstrap();
