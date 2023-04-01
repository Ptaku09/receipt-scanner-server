import express from 'express';
import receiptUpload from '../../middleware/receipt.middleware';
import { scanReceipt } from './receipt.controller';

// api/receipt
const router = express.Router();

router.post('/scan', receiptUpload, scanReceipt);

export default router;
