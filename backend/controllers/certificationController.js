import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import Certification from '../models/Certification.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define private upload directory for certification documents outside public assets
const CERT_DIR = path.resolve(__dirname, '..', 'uploads', 'certifications');

// Ensure directory exists
if (!fs.existsSync(CERT_DIR)) {
  fs.mkdirSync(CERT_DIR, { recursive: true });
}

// Multer storage engine with server-generated filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(CERT_DIR)) {
      fs.mkdirSync(CERT_DIR, { recursive: true });
    }
    cb(null, CERT_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ext === '.pdf' ? '.pdf' : '.pdf';
    const randomHex = crypto.randomBytes(6).toString('hex');
    const safeKey = `cert-${req.user.userId}-${Date.now()}-${randomHex}${safeExt}`;
    cb(null, safeKey);
  },
});

// File filter: Strictly PDF documents only
const fileFilter = (req, file, cb) => {
  const allowedMime = 'application/pdf';
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype === allowedMime || ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF documents (.pdf) are supported.'), false);
  }
};

// 5MB upload limit
export const certificateUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

/**
 * Validates PDF file signature (magic bytes) to prevent disguised files
 * PDF specification requires the file to start with '%PDF-' (0x25 0x50 0x44 0x46 0x2D)
 */
export const validatePdfSignature = (filePath) => {
  try {
    const buffer = Buffer.alloc(5);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 5, 0);
    fs.closeSync(fd);

    return buffer.toString('utf8') === '%PDF-';
  } catch (err) {
    console.error('Error verifying PDF magic bytes:', err);
    return false;
  }
};

/**
 * Verifies that a storage key does not escape CERT_DIR
 */
const getSecureFilePath = (storageKey) => {
  if (!storageKey || typeof storageKey !== 'string') return null;
  const basename = path.basename(storageKey);
  if (basename !== storageKey) return null; // Path traversal attempt

  const fullPath = path.resolve(CERT_DIR, storageKey);
  if (!fullPath.startsWith(CERT_DIR)) return null;

  return fullPath;
};

/**
 * Safely unlinks a file from storage if present
 */
const safeUnlink = (storageKey) => {
  if (!storageKey) return;
  const filePath = getSecureFilePath(storageKey);
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn('Could not remove certification file:', err.message);
    }
  }
};

/**
 * Validates verification web URL
 */
const validateUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) return { valid: true, sanitized: '' };
  const trimmed = url.trim();
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
  if (!urlRegex.test(trimmed)) {
    return {
      valid: false,
      message: 'Invalid verification URL. Please provide a valid web URL starting with http:// or https://',
    };
  }
  return { valid: true, sanitized: trimmed };
};

// @desc    Get all certifications for authenticated student
// @route   GET /api/certifications
// @access  Protected
export const getCertifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const certs = await Certification.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: certs.length,
      data: certs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single certification by ID
// @route   GET /api/certifications/:id
// @access  Protected
export const getCertificationById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const cert = await Certification.findById(id);

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: `Certification with ID ${id} not found.`,
      });
    }

    if (cert.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this certification.',
      });
    }

    res.status(200).json({
      success: true,
      data: cert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create certification (supports optional PDF upload in same request)
// @route   POST /api/certifications
// @access  Protected
export const createCertification = async (req, res, next) => {
  const uploadSingle = certificateUpload.single('certificate');

  uploadSingle(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Certificate PDF exceeds the 5MB size limit.',
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed.',
      });
    }

    const uploadedFile = req.file;

    // If file provided, check magic bytes
    if (uploadedFile) {
      const isValid = validatePdfSignature(uploadedFile.path);
      if (!isValid) {
        try {
          fs.unlinkSync(uploadedFile.path);
        } catch {}
        return res.status(400).json({
          success: false,
          message: 'Corrupted or invalid file format. File signature does not match PDF.',
        });
      }
    }

    try {
      const userId = req.user.userId;
      const {
        title,
        issuer,
        issueDate,
        expirationDate,
        credentialId,
        verificationUrl,
        grade,
        skills,
      } = req.body;

      if (!title || !title.trim()) {
        if (uploadedFile) safeUnlink(uploadedFile.filename);
        return res.status(400).json({
          success: false,
          message: 'Certification title is required.',
        });
      }

      if (!issuer || !issuer.trim()) {
        if (uploadedFile) safeUnlink(uploadedFile.filename);
        return res.status(400).json({
          success: false,
          message: 'Issuing organization is required.',
        });
      }

      if (!issueDate || !issueDate.trim()) {
        if (uploadedFile) safeUnlink(uploadedFile.filename);
        return res.status(400).json({
          success: false,
          message: 'Issue date is required.',
        });
      }

      const urlCheck = validateUrl(verificationUrl);
      if (!urlCheck.valid) {
        if (uploadedFile) safeUnlink(uploadedFile.filename);
        return res.status(400).json({
          success: false,
          message: urlCheck.message,
        });
      }

      // Parse skills
      let skillsArray = [];
      if (Array.isArray(skills)) {
        skillsArray = skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof skills === 'string' && skills.trim()) {
        skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }

      const certData = {
        user: userId,
        title: title.trim(),
        issuer: issuer.trim(),
        issueDate: issueDate.trim(),
        expirationDate: expirationDate ? String(expirationDate).trim() : '',
        credentialId: credentialId ? String(credentialId).trim() : '',
        verificationUrl: urlCheck.sanitized,
        grade: grade ? String(grade).trim() : 'Certified',
        skills: skillsArray,
      };

      if (uploadedFile) {
        certData.certificateFileName = uploadedFile.originalname;
        certData.certificateStorageKey = uploadedFile.filename;
        certData.certificateMimeType = uploadedFile.mimetype || 'application/pdf';
        certData.certificateFileSize = uploadedFile.size;
        certData.certificateUploadedAt = new Date();
      }

      const cert = await Certification.create(certData);

      res.status(201).json({
        success: true,
        message: 'Certification added successfully.',
        data: cert,
      });
    } catch (saveErr) {
      if (uploadedFile) {
        try {
          fs.unlinkSync(uploadedFile.path);
        } catch {}
      }
      next(saveErr);
    }
  });
};

// @desc    Update certification metadata
// @route   PUT /api/certifications/:id
// @access  Protected
export const updateCertification = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const cert = await Certification.findById(id);

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: `Certification with ID ${id} not found.`,
      });
    }

    if (cert.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to edit this certification.',
      });
    }

    const {
      title,
      issuer,
      issueDate,
      expirationDate,
      credentialId,
      verificationUrl,
      grade,
      skills,
    } = req.body;

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Certification title cannot be empty.',
        });
      }
      cert.title = title.trim();
    }

    if (issuer !== undefined) {
      if (!issuer || !issuer.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Issuing organization cannot be empty.',
        });
      }
      cert.issuer = issuer.trim();
    }

    if (issueDate !== undefined) {
      if (!issueDate || !issueDate.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Issue date cannot be empty.',
        });
      }
      cert.issueDate = issueDate.trim();
    }

    if (expirationDate !== undefined) cert.expirationDate = String(expirationDate).trim();
    if (credentialId !== undefined) cert.credentialId = String(credentialId).trim();

    if (verificationUrl !== undefined) {
      const urlCheck = validateUrl(verificationUrl);
      if (!urlCheck.valid) {
        return res.status(400).json({
          success: false,
          message: urlCheck.message,
        });
      }
      cert.verificationUrl = urlCheck.sanitized;
    }

    if (grade !== undefined) cert.grade = String(grade).trim();

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        cert.skills = skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof skills === 'string') {
        cert.skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    await cert.save();

    res.status(200).json({
      success: true,
      message: 'Certification updated successfully.',
      data: cert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload or replace PDF for an existing certification
// @route   POST /api/certifications/:id/upload
// @access  Protected
export const uploadCertificatePdf = async (req, res, next) => {
  const uploadSingle = certificateUpload.single('certificate');

  uploadSingle(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Certificate PDF exceeds the 5MB size limit.',
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file provided.',
      });
    }

    const filePath = req.file.path;

    // Verify magic bytes
    if (!validatePdfSignature(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {}
      return res.status(400).json({
        success: false,
        message: 'Corrupted or invalid file format. File signature does not match PDF.',
      });
    }

    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const cert = await Certification.findById(id);

      if (!cert) {
        try {
          fs.unlinkSync(filePath);
        } catch {}
        return res.status(404).json({
          success: false,
          message: `Certification with ID ${id} not found.`,
        });
      }

      if (cert.user.toString() !== userId) {
        try {
          fs.unlinkSync(filePath);
        } catch {}
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You do not have permission to update this certification.',
        });
      }

      // If there was an existing certificate file, clean it up
      if (cert.certificateStorageKey) {
        safeUnlink(cert.certificateStorageKey);
      }

      cert.certificateFileName = req.file.originalname;
      cert.certificateStorageKey = req.file.filename;
      cert.certificateMimeType = req.file.mimetype || 'application/pdf';
      cert.certificateFileSize = req.file.size;
      cert.certificateUploadedAt = new Date();

      await cert.save();

      res.status(200).json({
        success: true,
        message: `Certificate "${req.file.originalname}" uploaded and verified successfully.`,
        data: cert,
      });
    } catch (saveErr) {
      try {
        fs.unlinkSync(filePath);
      } catch {}
      next(saveErr);
    }
  });
};

// @desc    View certificate PDF inline (browser preview)
// @route   GET /api/certifications/:id/view
// @access  Protected
export const viewCertificatePdf = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const cert = await Certification.findById(id);

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: `Certification with ID ${id} not found.`,
      });
    }

    if (cert.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this certificate.',
      });
    }

    if (!cert.certificateStorageKey) {
      return res.status(404).json({
        success: false,
        message: 'No PDF certificate file is attached to this certification.',
      });
    }

    const filePath = getSecureFilePath(cert.certificateStorageKey);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Certificate file is missing from storage.',
      });
    }

    const safeFilename = encodeURIComponent(cert.certificateFileName || 'certificate.pdf');
    res.setHeader('Content-Type', cert.certificateMimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`);
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Download certificate PDF attachment
// @route   GET /api/certifications/:id/download
// @access  Protected
export const downloadCertificatePdf = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const cert = await Certification.findById(id);

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: `Certification with ID ${id} not found.`,
      });
    }

    if (cert.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to download this certificate.',
      });
    }

    if (!cert.certificateStorageKey) {
      return res.status(404).json({
        success: false,
        message: 'No PDF certificate file is attached to this certification.',
      });
    }

    const filePath = getSecureFilePath(cert.certificateStorageKey);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Certificate file is missing from storage.',
      });
    }

    const safeFilename = encodeURIComponent(cert.certificateFileName || 'certificate.pdf');
    res.setHeader('Content-Type', cert.certificateMimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`);
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certificate PDF attachment only (keeps certification record)
// @route   DELETE /api/certifications/:id/file
// @access  Protected
export const deleteCertificatePdf = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const cert = await Certification.findById(id);

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: `Certification with ID ${id} not found.`,
      });
    }

    if (cert.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to modify this certification.',
      });
    }

    if (cert.certificateStorageKey) {
      safeUnlink(cert.certificateStorageKey);
    }

    cert.certificateFileName = '';
    cert.certificateStorageKey = '';
    cert.certificateMimeType = '';
    cert.certificateFileSize = 0;
    cert.certificateUploadedAt = null;

    await cert.save();

    res.status(200).json({
      success: true,
      message: 'Certificate PDF file deleted successfully.',
      data: cert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certification record and its attached PDF
// @route   DELETE /api/certifications/:id
// @access  Protected
export const deleteCertification = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const cert = await Certification.findById(id);

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: `Certification with ID ${id} not found.`,
      });
    }

    if (cert.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this certification.',
      });
    }

    // Clean up attached PDF file if exists
    if (cert.certificateStorageKey) {
      safeUnlink(cert.certificateStorageKey);
    }

    await Certification.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Certification deleted successfully.',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
