import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['trial', 'pro', 'admin', 'expired'],
    default: 'trial'
  },
  trialStartDate: {
    type: Date,
    default: Date.now
  },
  subscriptionEndDate: {
    type: Date
  },
  qrCodesGenerated: {
    type: Number,
    default: 0
  },
  maxQrCodes: {
    type: Number,
    default: 50 // Trial limit
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Check if trial is expired
userSchema.methods.isTrialExpired = function() {
  if (this.role !== 'trial') return false;
  
  const trialEndDate = new Date(this.trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + 10); // 10-day trial
  
  return new Date() > trialEndDate;
};

// Get remaining trial days
userSchema.methods.getTrialDaysLeft = function() {
  if (this.role !== 'trial') return 0;
  
  const trialEndDate = new Date(this.trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + 10);
  
  const diffTime = trialEndDate.getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

export default mongoose.model('User', userSchema);