import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import * as Tesseract from 'tesseract.js';
import { ProductCategory, ProductInfo, ProductName, ProductPrice } from '../../models/receipt.model';
import { StatusCodes } from 'http-status-codes';

export const scanReceipt = async (req: Request, res: Response) => {
  if (req.file) {
    const receipt: Express.Multer.File = req.file;

    logger.info(`sending: ${receipt.originalname} receipt to scanning...`);
    const rawText = await scanText(receipt);

    logger.info(`successfully scanned receipt`);

    logger.info(`formatting receipt...`);
    const formattedReceipt: ProductInfo[] = formatReceipt(rawText);

    logger.info(`successfully formatted receipt`);

    res.status(StatusCodes.OK).json(formattedReceipt);
  }
};

const scanText = async (receipt: Express.Multer.File): Promise<string> => {
  const worker = await Tesseract.createWorker();
  await worker.loadLanguage('pol');
  await worker.initialize('pol');
  const {
    data: { text },
  } = await worker.recognize(receipt.buffer);
  await worker.terminate();

  return text;
};

const formatReceipt = (rawText: string): ProductInfo[] => {
  const lines = rawText.split('\n');
  const filteredLines = filterLines(lines);
  const result = createNamePricePairs(filteredLines);

  mergeDiscountedProducts(result);

  return result;
};

const filterLines = (lines: string[]): string[] => {
  // remove empty lines and lines which means that previous product was discounted
  return lines.filter((line: string) => line.length !== 0 && line.indexOf(ProductCategory.DISCOUNT) === -1);
};

const createNamePricePairs = (lines: string[]): ProductInfo[] => {
  return lines.map((line: string) => {
    const name = extractName(line);
    const price = extractPrice(line);

    // if line contains only price, then it means that previous product was discounted
    if (!price && isOnlyPrice(line)) {
      return {
        name: ProductName.DISCOUNT,
        price: parseFloat(line.replace(',', '.')),
      };
    }

    return {
      name,
      price,
    };
  });
};

const extractName = (line: string): string => {
  const nameIndexEnd = line.search(/[A-G] \d/);
  return nameIndexEnd !== -1 ? line.slice(0, nameIndexEnd - 1) : ProductName.ERROR;
};

const extractPrice = (line: string): number => {
  const price = line.match(/\d+(,|(\.))\d{2}(?=\S$)/);
  return price ? parseFloat(price[0].replace(',', '.')) : ProductPrice.ERROR;
};

const isOnlyPrice = (line: string): boolean => {
  return !!line.match(/^(\d+(,|(\.))\d{2})$/);
};

const mergeDiscountedProducts = (products: ProductInfo[]): void => {
  for (let i = 1; i < products.length; i++) {
    // if product is discounted, then update previous product price and remove discounted product
    if (products[i].name === ProductName.DISCOUNT) {
      products[i - 1].price = products[i].price;
      products.splice(i, 1);
    }
  }
};
