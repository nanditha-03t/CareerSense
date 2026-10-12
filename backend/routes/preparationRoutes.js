import express from 'express';
import {
  getPreparation,
  markSubtopicComplete,
  markSubtopicIncomplete,
  updateSubtopicStatus,
  setActiveSubtopic,
  getPreparationSummary,
  updatePreparation,
} from '../controllers/preparationController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Base preparation routes
router.route('/')
  .get(protect, getPreparation)
  .put(protect, updatePreparation);

// Concise preparation summary for dashboard & navigation
router.get('/summary', protect, getPreparationSummary);

// Mark subtopic complete
router.post('/complete', protect, markSubtopicComplete);

// Mark subtopic incomplete
router.post('/uncomplete', protect, markSubtopicIncomplete);

// Toggle or update subtopic status
router.put('/subtopic', protect, updateSubtopicStatus);

// Set currently viewed / active subtopic for Continue Learning
router.post('/active', protect, setActiveSubtopic);

export default router;
