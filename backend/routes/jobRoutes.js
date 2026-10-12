import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import protect, { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: GET /api/jobs (Public/Student browsing), POST /api/jobs (Admin only)
router.route('/')
  .get(getJobs)
  .post(protect, requireAdmin, createJob);

// Route: GET /api/jobs/:id, PUT /api/jobs/:id (Admin only), DELETE /api/jobs/:id (Admin only)
router.route('/:id')
  .get(getJobById)
  .put(protect, requireAdmin, updateJob)
  .delete(protect, requireAdmin, deleteJob);

export default router;
