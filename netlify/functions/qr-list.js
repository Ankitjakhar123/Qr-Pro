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

    const page = parseInt(event.queryStringParameters?.page) || 1;
    const limit = parseInt(event.queryStringParameters?.limit) || 10;
    const search = event.queryStringParameters?.search || '';

    const query = { userId: decoded.userId };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { data: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const qrCodes = await QRCode.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await QRCode.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return createResponse(200, {
      qrCodes,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get QR codes error:', error);
    return createResponse(500, { message: 'Server error' });
  }
};
