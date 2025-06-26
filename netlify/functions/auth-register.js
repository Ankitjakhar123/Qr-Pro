import { connectToDatabase, createResponse, handleCors } from './utils/database.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

export const handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    await connectToDatabase();

    if (!event.body) {
      return createResponse(400, { message: 'Request body is required' });
    }

    const { name, email, password } = JSON.parse(event.body);

    if (!name || !email || !password) {
      return createResponse(400, { message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return createResponse(400, { message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: 'trial',
      trialStartDate: new Date()
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    return createResponse(201, {
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        trialStartDate: user.trialStartDate
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return createResponse(500, { 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};
