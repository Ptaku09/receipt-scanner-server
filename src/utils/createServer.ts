import express, { Request, Response } from 'express';
import helmet from 'helmet';

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(helmet());

  // routes
  app.get('/api/health', (req: Request, res: Response) => res.sendStatus(200));

  return app;
};
