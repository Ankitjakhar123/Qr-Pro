import { connectToDatabase, createResponse, handleCors } from './utils/database.js';

export const handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    return createResponse(200, {
      status: 'OK',
      message: 'QR Generator API is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    return createResponse(500, { 
      status: 'ERROR',
      message: 'Database connection failed' 
    });
  }
};
