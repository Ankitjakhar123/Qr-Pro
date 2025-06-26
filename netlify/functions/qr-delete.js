import { connectToDatabase, createResponse, handleCors } from './utils/database.js';
import { authenticateToken, extractTokenFromEvent } from './utils/auth.js';
import QRCode from './models/QRCode.js';

export const handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    const token = extractTokenFromEvent(event);
    const decoded = await authenticateToken(token);

    const qrCodeId = event.path.split('/').pop();

    const qrCode = await QRCode.findOneAndDelete({
      _id: qrCodeId,
      userId: decoded.userId
    });

    if (!qrCode) {
      return createResponse(404, { message: 'QR code not found' });
    }

    return createResponse(200, { message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Delete QR code error:', error);
    return createResponse(500, { message: 'Server error' });
  }
};
