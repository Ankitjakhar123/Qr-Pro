import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['url', 'text', 'email', 'phone', 'sms', 'wifi', 'vcard', 'location', 'event'],
    required: true
  },
  data: {
    type: String,
    required: true
  },
  customization: {
    colors: {
      foreground: { type: String, default: '#000000' },
      background: { type: String, default: '#ffffff' }
    },
    size: { type: Number, default: 300 },
    errorCorrectionLevel: { type: String, enum: ['L', 'M', 'Q', 'H'], default: 'M' },
    dotType: { type: String, default: 'square' },
    logoUrl: { type: String },
    template: { type: String }
  },
  scanCount: {
    type: Number,
    default: 0
  },
  scanAnalytics: [{
    timestamp: { type: Date, default: Date.now },
    location: {
      country: String,
      city: String,
      ip: String
    },
    device: {
      type: String,
      browser: String,
      os: String
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  shortUrl: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Index for faster queries
qrCodeSchema.index({ userId: 1, createdAt: -1 });
qrCodeSchema.index({ shortUrl: 1 });

export default mongoose.model('QRCode', qrCodeSchema);