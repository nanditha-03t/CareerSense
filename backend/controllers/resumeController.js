import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import Profile from '../models/Profile.js';

// Define private upload directory outside public assets
const RESUME_DIR = path.join(process.cwd(), 'uploads', 'resumes');

// Ensure directory exists
if (!fs.existsSync(RESUME_DIR)) {
  fs.mkdirSync(RESUME_DIR, { recursive: true });
}

// Multer storage engine with server-generated filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(RESUME_DIR)) {
      fs.mkdirSync(RESUME_DIR, { recursive: true });
    }
    cb(null, RESUME_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const randomHex = crypto.randomBytes(6).toString('hex');
    const safeKey = `resume-${req.user.userId}-${Date.now()}-${randomHex}${ext}`;
    cb(null, safeKey);
  },
});

// File filter: Only PDF, DOCX, DOC
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];
  const allowedExts = ['.pdf', '.docx', '.doc'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and Word documents (.pdf, .docx, .doc) are supported.'), false);
  }
};

// Max size 5MB
export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).single('resume');

/**
 * Validates file signature (magic bytes) to prevent disguised files
 */
const validateMagicBytes = (filePath) => {
  try {
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);

    // PDF magic bytes: '%PDF-' (0x25 0x50 0x44 0x46 0x2D)
    const isPdf = buffer.toString('utf8', 0, 5) === '%PDF-';

    // DOCX / ZIP magic bytes: 'PK\x03\x04'
    const isZipDocx =
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
      (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08);

    // DOC legacy magic bytes: 0xD0 0xCF 0x11 0xE0
    const isDoc =
      buffer[0] === 0xd0 &&
      buffer[1] === 0xcf &&
      buffer[2] === 0x11 &&
      buffer[3] === 0xe0;

    return isPdf || isZipDocx || isDoc;
  } catch (err) {
    console.error('Error verifying magic bytes:', err);
    return false;
  }
};

// @desc    Upload or replace student resume
// @route   POST /api/resume/upload
// @access  Protected
export const uploadResume = async (req, res, next) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Resume file size exceeds the 5MB limit.',
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
        message: 'No resume file provided.',
      });
    }

    const filePath = req.file.path;

    // Verify magic bytes
    if (!validateMagicBytes(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {}
      return res.status(400).json({
        success: false,
        message: 'Corrupted or invalid file format. File signature does not match PDF or DOCX.',
      });
    }

    try {
      const userId = req.user.userId;
      let profile = await Profile.findOne({ user: userId });

      // Clean up previous resume file if replacing
      if (profile && profile.resumeStorageKey) {
        const oldPath = path.join(RESUME_DIR, profile.resumeStorageKey);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (unlinkErr) {
            console.warn('Could not remove previous resume file:', unlinkErr.message);
          }
        }
      }

      const updateData = {
        resumeFileName: req.file.originalname,
        resumeStorageKey: req.file.filename,
        resumeMimeType: req.file.mimetype || 'application/pdf',
        resumeFileSize: req.file.size,
        resumeUploadedAt: new Date(),
      };

      if (!profile) {
        profile = await Profile.create({
          user: userId,
          name: req.user.name,
          ...updateData,
        });
      } else {
        profile = await Profile.findOneAndUpdate({ user: userId }, updateData, { new: true });
      }

      res.status(200).json({
        success: true,
        message: `Resume "${req.file.originalname}" uploaded and verified successfully.`,
        data: {
          fileName: profile.resumeFileName,
          fileSize: profile.resumeFileSize,
          uploadedAt: profile.resumeUploadedAt,
          mimeType: profile.resumeMimeType,
        },
      });
    } catch (saveErr) {
      // Remove uploaded file on DB error
      try {
        fs.unlinkSync(filePath);
      } catch {}
      next(saveErr);
    }
  });
};

// @desc    Download authenticated student's resume
// @route   GET /api/resume/download
// @access  Protected
export const downloadResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await Profile.findOne({ user: userId });

    if (!profile || !profile.resumeStorageKey) {
      return res.status(404).json({
        success: false,
        message: 'No resume found for your account. Please upload a resume first.',
      });
    }

    const filePath = path.join(RESUME_DIR, profile.resumeStorageKey);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file is missing from storage.',
      });
    }

    const safeFilename = encodeURIComponent(profile.resumeFileName || 'resume.pdf');
    res.setHeader('Content-Type', profile.resumeMimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    View authenticated student's resume inline
// @route   GET /api/resume/view
// @access  Protected
export const viewResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await Profile.findOne({ user: userId });

    if (!profile || !profile.resumeStorageKey) {
      return res.status(404).json({
        success: false,
        message: 'No resume found for your account.',
      });
    }

    const filePath = path.join(RESUME_DIR, profile.resumeStorageKey);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found in storage.',
      });
    }

    const safeFilename = encodeURIComponent(profile.resumeFileName || 'resume.pdf');
    res.setHeader('Content-Type', profile.resumeMimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete authenticated student's resume
// @route   DELETE /api/resume
// @access  Protected
export const deleteResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await Profile.findOne({ user: userId });

    if (!profile || !profile.resumeStorageKey) {
      return res.status(404).json({
        success: false,
        message: 'No resume exists to delete.',
      });
    }

    const filePath = path.join(RESUME_DIR, profile.resumeStorageKey);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Could not remove file from disk:', err.message);
      }
    }

    await Profile.findOneAndUpdate(
      { user: userId },
      {
        resumeFileName: '',
        resumeStorageKey: '',
        resumeMimeType: '',
        resumeFileSize: 0,
        resumeUploadedAt: null,
        resumeDataUrl: '',
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student resume status
// @route   GET /api/resume/status
// @access  Protected
export const getResumeStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await Profile.findOne({ user: userId });

    const hasResume = Boolean(profile && profile.resumeStorageKey);

    res.status(200).json({
      success: true,
      data: {
        hasResume,
        fileName: profile?.resumeFileName || '',
        fileSize: profile?.resumeFileSize || 0,
        uploadedAt: profile?.resumeUploadedAt || null,
        mimeType: profile?.resumeMimeType || '',
      },
    });
  } catch (error) {
    next(error);
  }
};
