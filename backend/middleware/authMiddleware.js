import { verifyToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';

/**
 * Authentication Middleware for CareerSense Backend
 * Protects private endpoints by verifying JSON Web Tokens from the Authorization header.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for 'Bearer <token>' in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract token from header string
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required. No token provided.',
        });
      }

      // Verify token signature and expiration
      const decoded = verifyToken(token);

      // Fetch user from MongoDB to verify account still exists (exclude password)
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required. User account not found.',
        });
      }

      // Attach authenticated user information, standard userId, and server-verified role
      req.user = {
        userId: user._id.toString(),
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        graduationYear: user.graduationYear,
        role: user.role || 'student',
      };

      next();
    } catch {
      // Handles JsonWebTokenError, TokenExpiredError, etc. cleanly
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Invalid or expired token.',
      });
    }
  } else {
    // No Authorization header provided
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No authorization token supplied.',
    });
  }
};

/**
 * Reusable Admin Authorization Middleware
 * Enforces server-side administrator role verification.
 * Students or unprivileged users attempting to call protected admin APIs receive 403 Forbidden.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Administrator privileges required to access this resource.',
    });
  }
  next();
};

export default protect;
