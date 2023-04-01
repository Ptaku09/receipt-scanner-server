import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import * as Tesseract from 'tesseract.js';

export const receiptUploadHandler = async (req: Request, res: Response) => {
  if (req.file) {
    const receipt: Express.Multer.File = req.file;

    logger.info(`sending: ${receipt.originalname} receipt to scanning...`);
    const rawText = await scanReceipt(receipt);

    res.json(200);
  }
};

const scanReceipt = async (receipt: Express.Multer.File) => {
  const worker = await Tesseract.createWorker();
  await worker.loadLanguage('pol');
  await worker.initialize('pol');
  const {
    data: { text },
  } = await worker.recognize(receipt.buffer);
  await worker.terminate();

  return text;
};
