import { connectToDatabase, createResponse, handleCors } from './utils/database.js';
import { authenticateToken, extractTokenFromEvent } from './utils/auth.js';
import QRCode from './models/QRCode.js';
import User from './models/User.js';

export const handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    const token = extractTokenFromEvent(event);
    const decoded = await authenticateToken(token);

    const { type, data, title, description, customization } = JSON.parse(event.body);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return createResponse(404, { message: 'User not found' });
    }

    // Check if user has reached their QR code limit
    if (user.role === 'trial' && user.qrCodesGenerated >= user.maxQrCodes) {
      return createResponse(403, { 
        message: 'QR code limit reached. Upgrade to Pro for unlimited codes.' 
      });
    }

    // Check if trial expired
    if (user.isTrialExpired() && user.role === 'trial') {
      return createResponse(403, { 
        message: 'Trial expired. Please upgrade to continue.' 
      });
    }

    const qrCode = new QRCode({
      userId: decoded.userId,
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

    return createResponse(201, {
      message: 'QR code created successfully',
      qrCode
    });
  } catch (error) {
    console.error('QR code creation error:', error);
    return createResponse(500, { message: 'Server error' });
  }
};
