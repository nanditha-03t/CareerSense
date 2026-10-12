import express from 'express';
import {
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  getAllApplications,
  updateApplicationStatusAdmin,
} from '../controllers/applicationController.js';
import protect, { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: GET all applications across all students (Admin / TPO view - Protected & Admin required)
router.get('/all', protect, requireAdmin, getAllApplications);

// Route: PATCH update application status as Placement Officer / Admin (Protected & Admin required)
router.patch('/admin/:id', protect, requireAdmin, updateApplicationStatusAdmin);
router.patch('/admin/:id/status', protect, requireAdmin, updateApplicationStatusAdmin);

// Route: GET & POST /api/applications (Protected student access)
router.route('/')
  .get(protect, getApplications)
  .post(protect, addApplication);

// Route: PUT & DELETE /api/applications/:id (Protected student access with ownership check)
router.route('/:id')
  .put(protect, updateApplication)
  .delete(protect, deleteApplication);

export default router;
