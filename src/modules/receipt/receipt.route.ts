import express from 'express';
import receiptUpload from '../../middleware/receipt.middleware';
import { receiptUploadHandler } from './receipt.controller';

// api/receipt
const router = express.Router();

router.post('/upload', receiptUpload, receiptUploadHandler);

export default router;
