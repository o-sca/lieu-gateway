import * as express from 'express';
import * as cors from 'cors';
import * as proxy from 'express-http-proxy';
import helmet from 'helmet';
import { authMiddleware } from './auth.middleware';

async function bootstrap() {
  const app = express();

  app.use(
    cors({
      origin: ['http://localhost:4200', /\.vercel\.app$/],
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS'],
    }),
  );

  app.use(helmet());

  app.use('/api/v1/ai', authMiddleware, proxy(process.env.TEXT_AI_URL));
  app.use('/api/v1', proxy(process.env.AUTH_URL));

  app.listen(process.env.PORT || 3000, () => {
    console.log('Serving on port:', process.env.PORT || 3000);
  });
}
bootstrap();
