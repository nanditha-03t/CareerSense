import jwt from 'jsonwebtoken';

/**
 * JWT Utility Functions for CareerSense
 * Provides secure token signing and verification using environment secret.
 */

// Generate a signed JSON Web Token containing only the user's MongoDB ObjectId
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  return jwt.sign({ userId }, secret, {
    expiresIn,
  });
};

// Verify and decode a JSON Web Token
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  return jwt.verify(token, secret);
};

export default {
  generateToken,
  verifyToken,
};
