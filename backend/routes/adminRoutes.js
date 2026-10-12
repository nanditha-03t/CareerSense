import express from 'express';
import {
  getDashboardStats,
  getStudents,
  getStudentById,
  getJobsAdmin,
  createJobAdmin,
  updateJobAdmin,
  toggleJobStatusAdmin,
  deleteJobAdmin,
  syncExternalJobsAdmin,
  getApplicationsAdmin,
  updateApplicationAdmin,
  downloadStudentResumeAdmin,
} from '../controllers/adminController.js';
import protect, { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce authentication AND administrator authorization on ALL admin endpoints
router.use(protect, requireAdmin);

// Dashboard statistics
router.get('/dashboard', getDashboardStats);

// Student management
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);

// Job listing management
router.get('/jobs', getJobsAdmin);
router.post('/jobs', createJobAdmin);
router.put('/jobs/:id', updateJobAdmin);
router.patch('/jobs/:id/status', toggleJobStatusAdmin);
router.delete('/jobs/:id', deleteJobAdmin);
router.post('/jobs/sync-live', syncExternalJobsAdmin);

// Application management
router.get('/applications', getApplicationsAdmin);
router.patch('/applications/:id', updateApplicationAdmin);
router.patch('/applications/:id/status', updateApplicationAdmin);
router.put('/applications/:id/status', updateApplicationAdmin);

// Resume download by administrator (audited)
router.get('/resumes/:studentId/download', downloadStudentResumeAdmin);

export default router;
