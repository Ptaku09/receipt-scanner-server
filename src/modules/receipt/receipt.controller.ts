import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import * as Tesseract from 'tesseract.js';

export const scanReceipt = async (req: Request, res: Response) => {
  if (req.file) {
    const receipt: Express.Multer.File = req.file;

    logger.info(`sending: ${receipt.originalname} receipt to scanning...`);
    const rawText = await scanText(receipt);

    logger.info(`successfully scanned receipt`);

    logger.info(`formatting receipt...`);
    const formattedReceipt = formatReceipt(rawText);

    logger.info(`successfully formatted receipt`);

    res.json(formattedReceipt);
  }
};

const scanText = async (receipt: Express.Multer.File) => {
  const worker = await Tesseract.createWorker();
  await worker.loadLanguage('pol');
  await worker.initialize('pol');
  const {
    data: { text },
  } = await worker.recognize(receipt.buffer);
  await worker.terminate();

  return text;
};

const formatReceipt = (rawText: string): { name: string; price: any }[] => {
  const lines = rawText.split('\n');
  const filteredLines = lines.filter((line: string) => line.length !== 0);

  return filteredLines.map((line: string) => {
    const nameIndexEnd = line.search(/[A-G] \d/);
    const price = line.match(/\d+(,|(\.))\d{2}(?=\S$)/);

    return {
      name: nameIndexEnd !== -1 ? line.slice(0, nameIndexEnd - 1) : 'NOT FOUND',
      price: price ? parseFloat(price[0].replace(',', '.')) : 0,
    };
  });
};
