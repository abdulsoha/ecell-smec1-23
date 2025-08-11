import express from 'express';
import {
  createOrder,
  recordPayment,
  verifyPayment
} from '../controllers/paymentController.js'; // ensure .js if using ESModules

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/record', recordPayment);        // ✅ THIS IS IMPORTANT
router.post('/verify', verifyPayment);

export default router;
