import express, { Request, Response } from 'express';
import helmet from 'helmet';
import receiptRoute from '../routes/receipt.route';
import cors from 'cors';

export const server = () => {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );

  // routes
  app.get('/api/health', (req: Request, res: Response) => res.sendStatus(200));

  app.use('/api/receipt', receiptRoute);

  return app;
};
