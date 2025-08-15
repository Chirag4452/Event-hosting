// Import required modules
import express from 'express';
import { 
  createPaymentOrder, 
  verifyPayment, 
  getPaymentInfo 
} from '../controllers/paymentController.js';

// Create router instance
const router = express.Router();

// Payment routes
// POST /payment/create-order - Create a Razorpay order
router.post('/create-order', createPaymentOrder);

// POST /payment/verify - Verify payment signature
router.post('/verify', verifyPayment);

// GET /payment/info - Get payment information for a category
router.get('/info', getPaymentInfo);

// Export the router
export default router;
