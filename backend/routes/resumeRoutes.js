import express from 'express';
import {
  uploadResume,
  downloadResume,
  viewResume,
  deleteResume,
  getResumeStatus,
} from '../controllers/resumeController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All resume operations require student authentication
router.post('/upload', protect, uploadResume);
router.get('/download', protect, downloadResume);
router.get('/view', protect, viewResume);
router.delete('/', protect, deleteResume);
router.get('/status', protect, getResumeStatus);

export default router;
