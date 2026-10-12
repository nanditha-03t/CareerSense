import express from 'express';
import {
  getJobSkillMatch,
  getJobsWithStudentMatch,
  getAggregatedSkillGaps,
  getSkillRecommendations,
} from '../controllers/matchingController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: GET /api/skill-gap (Aggregated gap benchmark analysis for authenticated student)
router.get('/', protect, getAggregatedSkillGaps);

// Route: GET /api/skill-gap/recommendations (Structured preparation guidance for missing skills)
router.get('/recommendations', protect, getSkillRecommendations);

// Route: GET /api/skill-gap/jobs (All jobs with student-specific match scores & gap breakdowns)
router.get('/jobs', protect, getJobsWithStudentMatch);

// Route: GET /api/skill-gap/:jobId (Single job match analysis)
router.get('/:jobId', protect, getJobSkillMatch);
router.get('/job/:jobId', protect, getJobSkillMatch);

export default router;
