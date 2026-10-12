import express from 'express';
import { getSkills, addSkill, deleteSkill } from '../controllers/skillController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Route: GET & POST /api/skills (Protected)
router.route('/')
  .get(protect, getSkills)
  .post(protect, addSkill);

// Route: DELETE /api/skills/:id (Protected)
router.route('/:id')
  .delete(protect, deleteSkill);

export default router;
