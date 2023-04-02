import express, { Request, Response } from 'express';
import helmet from 'helmet';
import receiptRoute from '../routes/receipt.route';

export const server = () => {
  const app = express();

  app.use(express.json());
  app.use(helmet());

  // routes
  app.get('/api/health', (req: Request, res: Response) => res.sendStatus(200));

  app.use('/api/receipt', receiptRoute);

  return app;
};
