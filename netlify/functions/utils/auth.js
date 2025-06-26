import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (token) => {
  try {
    if (!token) {
      throw new Error('Access token required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const requireRole = async (userId, roles) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!roles.includes(user.role)) {
      throw new Error('Insufficient permissions');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const extractTokenFromEvent = (event) => {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  return authHeader && authHeader.split(' ')[1];
};
