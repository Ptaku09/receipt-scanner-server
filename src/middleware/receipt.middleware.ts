import multer, { FileFilterCallback } from 'multer';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (!MIME_TYPES.includes(file.mimetype)) {
      callback(new Error('LIMIT_UNEXPECTED_FILE'));
    } else {
      callback(null, true);
    }
  },
});

const receiptUpload = (req: Request, res: Response, next: NextFunction) => {
  upload.single('uploaded_receipt')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(StatusCodes.BAD_REQUEST).send('Plik jest za duży');
      }

      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(StatusCodes.BAD_REQUEST).send('Plik posiada nieporawne rozszerzenia, dozwolone: .png, .jpg, .jpeg');
      }

      return res.status(StatusCodes.BAD_REQUEST).send('Wystąpił nieznany błąd podczas przesyłania plików.');
    }

    return next();
  });
};

export default receiptUpload;
