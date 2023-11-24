import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as proxy from 'express-http-proxy';
import { authMiddleware } from './auth.middleware';
import { requestTrackerHandler } from './request-tracker.handler';

async function bootstrap() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: ['http://localhost:4200', /\.vercel\.app$/],
      credentials: true,
      methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'HEAD'],
    }),
  );

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  app.use(
    '/api/v1/ai/text',
    authMiddleware,
    proxy(process.env.TEXT_AI_URL, {
      userResDecorator: requestTrackerHandler,
    }),
  );
  // app.use('/api/v1/ai/gen', authMiddleware, proxy(process.env.GEN_AI_URL));
  app.use('/api/v1/auth', proxy(process.env.AUTH_URL));
  app.use('*', (_req, res) => {
    return res.status(404);
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log('Serving on port:', process.env.PORT || 3000);
  });
}
bootstrap();
