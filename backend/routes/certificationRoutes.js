import express from 'express';
import {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
  uploadCertificatePdf,
  deleteCertificatePdf,
  viewCertificatePdf,
  downloadCertificatePdf,
} from '../controllers/certificationController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All certification operations require student authentication
router.route('/')
  .get(protect, getCertifications)
  .post(protect, createCertification);

router.route('/:id')
  .get(protect, getCertificationById)
  .put(protect, updateCertification)
  .delete(protect, deleteCertification);

router.post('/:id/upload', protect, uploadCertificatePdf);
router.delete('/:id/file', protect, deleteCertificatePdf);
router.get('/:id/view', protect, viewCertificatePdf);
router.get('/:id/download', protect, downloadCertificatePdf);

export default router;
