import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: POST /api/auth/register (Public)
router.post('/register', registerUser);

// Route: POST /api/auth/login (Public - supports portal parameter)
router.post('/login', loginUser);

// Route: POST /api/auth/student-login (Strict Student Portal)
router.post('/student-login', (req, res, next) => {
  req.body.portal = 'student';
  return loginUser(req, res, next);
});

// Route: POST /api/auth/admin-login (Strict Admin Portal)
router.post('/admin-login', (req, res, next) => {
  req.body.portal = 'admin';
  return loginUser(req, res, next);
});

// Route: GET /api/auth/me (Protected)
router.get('/me', protect, getMe);

export default router;
