import express from 'express';
// import Razorpay from 'razorpay';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// Create payment order
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    // Razorpay integration temporarily disabled
    // const options = {
    //   amount: amount * 100, // Razorpay expects amount in paise
    //   currency,
    //   receipt: `receipt_${Date.now()}`,
    //   payment_capture: 1
    // };

    // const order = await razorpay.orders.create(options);

    // res.json({
    //   orderId: order.id,
    //   amount: order.amount,
    //   currency: order.currency,
    //   key: process.env.RAZORPAY_KEY_ID
    // });

    res.status(503).json({ 
      message: 'Razorpay integration temporarily disabled. Please use UPI payment option.',
      status: 'disabled'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
});

// Verify payment and upgrade user
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      upi_transaction_id // For manual UPI verification
    } = req.body;

    // For Razorpay verification - temporarily disabled
    // if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
    //   // Verify signature (implement signature verification)
    //   // This is a simplified version - implement proper signature verification
      
    //   const user = await User.findById(req.user.userId);
    //   if (!user) {
    //     return res.status(404).json({ message: 'User not found' });
    //   }

    //   // Upgrade user to pro
    //   user.role = 'pro';
    //   user.subscriptionEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    //   user.maxQrCodes = -1; // Unlimited
    //   await user.save();

    //   res.json({
    //     message: 'Payment verified and account upgraded successfully',
    //     user: {
    //       id: user._id,
    //       role: user.role,
    //       subscriptionEndDate: user.subscriptionEndDate
    //     }
    //   });
    // }
    // For manual UPI verification
    if (upi_transaction_id) {
      // In a real implementation, you would verify the UPI transaction
      // For now, we'll mark it as pending verification
      
      res.json({
        message: 'UPI transaction submitted for verification',
        status: 'pending',
        transactionId: upi_transaction_id
      });
    }
    else {
      res.status(400).json({ message: 'Invalid payment verification data' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

// Manual UPI payment submission
router.post('/upi-payment', authenticateToken, async (req, res) => {
  try {
    const { upiId, transactionId, amount } = req.body;

    // In a real implementation, you would:
    // 1. Store the payment request in database
    // 2. Send notification to admin for verification
    // 3. Provide payment instructions to user

    res.json({
      message: 'UPI payment request submitted',
      instructions: [
        `Send ₹${amount} to UPI ID: ${process.env.BUSINESS_UPI_ID || 'business@upi'}`,
        `Use transaction reference: ${transactionId}`,
        'Your account will be upgraded within 24 hours after verification'
      ],
      status: 'pending'
    });
  } catch (error) {
    console.error('UPI payment error:', error);
    res.status(500).json({ message: 'Error processing UPI payment' });
  }
});

// Get payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    // In a real implementation, you would fetch payment history from database
    res.json({
      payments: [],
      message: 'No payment history found'
    });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
});

export default router;