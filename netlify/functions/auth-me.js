import { connectToDatabase, createResponse, handleCors } from './utils/database.js';
import { authenticateToken, extractTokenFromEvent } from './utils/auth.js';
import User from './models/User.js';

export const handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    const token = extractTokenFromEvent(event);
    const decoded = await authenticateToken(token);

    // Get user details
    const user = await User.findById(decoded.userId);
    if (!user) {
      return createResponse(404, { message: 'User not found' });
    }

    return createResponse(200, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        trialStartDate: user.trialStartDate,
        trialDaysLeft: user.getTrialDaysLeft(),
        isTrialExpired: user.isTrialExpired()
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return createResponse(401, { message: error.message });
  }
};
