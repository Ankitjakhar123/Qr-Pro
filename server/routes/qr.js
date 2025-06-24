import express from 'express';
import QRCode from '../models/QRCode.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create QR Code
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { type, data, title, description, customization } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has reached their QR code limit
    if (user.role === 'trial' && user.qrCodesGenerated >= user.maxQrCodes) {
      return res.status(403).json({ 
        message: 'QR code limit reached. Upgrade to Pro for unlimited codes.' 
      });
    }

    // Check if trial expired
    if (user.isTrialExpired() && user.role === 'trial') {
      return res.status(403).json({ 
        message: 'Trial expired. Please upgrade to continue.' 
      });
    }

    const qrCode = new QRCode({
      userId: req.user.userId,
      type,
      data,
      title,
      description,
      customization
    });

    await qrCode.save();

    // Update user's QR code count
    user.qrCodesGenerated += 1;
    await user.save();

    res.status(201).json({
      message: 'QR code created successfully',
      qrCode
    });
  } catch (error) {
    console.error('QR code creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's QR codes
router.get('/my-codes', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const qrCodes = await QRCode.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await QRCode.countDocuments({ userId: req.user.userId });

    res.json({
      qrCodes,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get QR codes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get QR code by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const qrCode = await QRCode.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    res.json(qrCode);
  } catch (error) {
    console.error('Get QR code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update QR code
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, customization } = req.body;

    const qrCode = await QRCode.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, description, customization },
      { new: true }
    );

    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    res.json({
      message: 'QR code updated successfully',
      qrCode
    });
  } catch (error) {
    console.error('Update QR code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete QR code
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const qrCode = await QRCode.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    res.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Delete QR code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;