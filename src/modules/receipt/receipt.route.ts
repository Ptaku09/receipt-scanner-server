import express, { Request, Response } from 'express';

// api/receipt
const router = express.Router();

router.post('/upload', (req: Request, res: Response) => {
  res.json(200);
});

export default router;
