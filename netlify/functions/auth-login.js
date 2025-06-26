import { connectToDatabase, createResponse, handleCors } from './utils/database.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

export const handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    const { email, password } = JSON.parse(event.body);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return createResponse(400, { message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return createResponse(400, { message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    return createResponse(200, {
      message: 'Login successful',
      token,
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
    console.error('Login error:', error);
    return createResponse(500, { message: 'Server error during login' });
  }
};
