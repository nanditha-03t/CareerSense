import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Skill from '../models/Skill.js';
import { syncAllJobs } from '../services/jobFeedService.js';

const RESUME_DIR = path.join(process.cwd(), 'uploads', 'resumes');

// Validates URL
const isValidHttpUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    const parsed = new URL(urlStr.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// @desc    Get real-time admin dashboard metrics from MongoDB
// @route   GET /api/admin/dashboard
// @access  Protected / Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalAdmins,
      activeJobs,
      totalJobs,
      totalApplications,
      statusAggregation,
      studentsWithResumes,
      recentStudents,
      recentApplications,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: 'admin' }),
      Job.countDocuments({ active: { $ne: false } }),
      Job.countDocuments(),
      Application.countDocuments(),
      Application.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      Profile.countDocuments({
        $or: [
          { resumeStorageKey: { $exists: true, $ne: '' } },
          { resumeFileName: { $exists: true, $ne: '' } },
        ],
      }),
      User.find({ role: { $ne: 'admin' } })
        .sort({ createdAt: -1 })
        .limit(6)
        .select('-password'),
      Application.find()
        .sort({ updatedAt: -1 })
        .limit(8)
        .populate('user', 'name email branch cgpa college')
        .populate('job', 'title role company'),
    ]);

    // Format applications by status map
    const applicationsByStatus = {
      Interested: 0,
      Applied: 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0,
    };
    statusAggregation.forEach((item) => {
      if (item._id && applicationsByStatus[item._id] !== undefined) {
        applicationsByStatus[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalAdmins,
        activeJobs,
        totalJobs,
        totalApplications,
        studentsWithResumes,
        resumePercentage:
          totalStudents > 0
            ? Math.round((studentsWithResumes / totalStudents) * 100)
            : 0,
        applicationsByStatus,
        recentStudents,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get paginated student list with profile, skills, and resume metadata
// @route   GET /api/admin/students
// @access  Protected / Admin
export const getStudents = async (req, res, next) => {
  try {
    const { search, branch, hasResume, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query = { role: { $ne: 'admin' } };

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { branch: regex },
        { college: regex },
      ];
    }

    if (branch && branch.trim() && branch.toLowerCase() !== 'all') {
      query.branch = new RegExp(branch.trim(), 'i');
    }

    const totalStudents = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-password');

    // Enrich each student with profile details, skills count, and application count
    const studentIds = users.map((u) => u._id);

    const [profiles, skills, applications] = await Promise.all([
      Profile.find({ user: { $in: studentIds } }),
      Skill.find({ user: { $in: studentIds } }),
      Application.find({ user: { $in: studentIds } }),
    ]);

    const profileMap = new Map();
    profiles.forEach((p) => {
      if (p.user) profileMap.set(p.user.toString(), p);
    });

    const skillCounts = new Map();
    skills.forEach((s) => {
      if (s.user) {
        const id = s.user.toString();
        skillCounts.set(id, (skillCounts.get(id) || 0) + 1);
      }
    });

    const appCounts = new Map();
    applications.forEach((a) => {
      if (a.user) {
        const id = a.user.toString();
        appCounts.set(id, (appCounts.get(id) || 0) + 1);
      }
    });

    let enrichedStudents = users.map((u) => {
      const p = profileMap.get(u._id.toString());
      const hasRes = Boolean(p && (p.resumeStorageKey || p.resumeFileName));
      return {
        _id: u._id,
        id: u._id,
        name: u.name,
        email: u.email,
        college: p?.college || u.college,
        branch: p?.branch || u.branch,
        graduationYear: p?.graduationYear || u.graduationYear,
        phone: p?.phone || u.phoneNumber,
        cgpa: p?.cgpa || 8.0,
        skillsCount: skillCounts.get(u._id.toString()) || (u.skills ? u.skills.length : 0),
        applicationsCount: appCounts.get(u._id.toString()) || 0,
        hasResume: hasRes,
        resumeFileName: p?.resumeFileName || '',
        resumeUploadedAt: p?.resumeUploadedAt || null,
        resumeFileSize: p?.resumeFileSize || 0,
        createdAt: u.createdAt,
      };
    });

    // Apply hasResume filter if provided
    if (hasResume === 'true') {
      enrichedStudents = enrichedStudents.filter((s) => s.hasResume);
    } else if (hasResume === 'false') {
      enrichedStudents = enrichedStudents.filter((s) => !s.hasResume);
    }

    res.status(200).json({
      success: true,
      data: enrichedStudents,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalStudents,
        totalPages: Math.ceil(totalStudents / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed student information
// @route   GET /api/admin/students/:id
// @access  Protected / Admin
export const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
    }

    const [profile, skills, applications] = await Promise.all([
      Profile.findOne({ user: id }),
      Skill.find({ user: id }),
      Application.find({ user: id }).sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        user,
        profile,
        skills,
        applications,
        hasResume: Boolean(profile && (profile.resumeStorageKey || profile.resumeFileName)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for Admin management
// @route   GET /api/admin/jobs
// @access  Protected / Admin
export const getJobsAdmin = async (req, res, next) => {
  try {
    const { search, active, source, page = 1, limit = 15 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { role: regex },
        { company: regex },
        { location: regex },
        { requiredSkills: { $in: [regex] } },
      ];
    }

    if (active === 'true') filter.active = true;
    if (active === 'false') filter.active = false;

    if (source && source.trim() && source.toLowerCase() !== 'all') {
      filter.source = new RegExp(source.trim(), 'i');
    }

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job from admin panel
// @route   POST /api/admin/jobs
// @access  Protected / Admin
export const createJobAdmin = async (req, res, next) => {
  try {
    const {
      title,
      company,
      description,
      location,
      employmentType,
      experienceLevel,
      workplaceType,
      package: pkg,
      ctc,
      requiredSkills,
      eligibility,
      applicationUrl,
      source,
      isVerified,
      active,
      driveDate,
      deadline,
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({
        success: false,
        message: 'Job Title and Company are required fields.',
      });
    }

    if (applicationUrl && !isValidHttpUrl(applicationUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Application URL must be a valid HTTP or HTTPS address.',
      });
    }

    let skills = [];
    if (Array.isArray(requiredSkills)) {
      skills = requiredSkills.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof requiredSkills === 'string') {
      skills = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (skills.length === 0) {
      skills = ['Problem Solving'];
    }

    const job = await Job.create({
      title: title.trim(),
      role: title.trim(),
      company: company.trim(),
      description: description || 'Campus placement recruitment drive.',
      location: location || 'Hyderabad / Pan India',
      employmentType: employmentType || 'Full-Time',
      experienceLevel: experienceLevel || 'Fresher',
      workplaceType: workplaceType || 'Onsite',
      package: pkg || ctc || '3.5 – 6.5 LPA',
      salary: pkg || ctc || '3.5 – 6.5 LPA',
      requiredSkills: skills,
      eligibility: eligibility || 'B.Tech with 60% aggregate throughout academics',
      applicationUrl: applicationUrl ? applicationUrl.trim() : '',
      source: source || 'Placement Cell Manual Entry',
      isVerified: Boolean(isVerified),
      active: active !== undefined ? Boolean(active) : true,
      driveDate: driveDate || 'Upcoming Campus Drive',
      deadline: deadline || 'Open / Rolling',
      lastVerifiedDate: isVerified ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: 'Job listing created successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job from admin panel
// @route   PUT /api/admin/jobs/:id
// @access  Protected / Admin
export const updateJobAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.title) updateData.role = updateData.title;
    if (updateData.role && !updateData.title) updateData.title = updateData.role;

    if (updateData.applicationUrl && !isValidHttpUrl(updateData.applicationUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Application URL must be a valid HTTP or HTTPS address.',
      });
    }

    if (updateData.requiredSkills && typeof updateData.requiredSkills === 'string') {
      updateData.requiredSkills = updateData.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const job = await Job.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job listing updated successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle job active status
// @route   PATCH /api/admin/jobs/:id/status
// @access  Protected / Admin
export const toggleJobStatusAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found.',
      });
    }

    job.active = active !== undefined ? Boolean(active) : !job.active;
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job listing ${job.active ? 'activated' : 'deactivated'} successfully.`,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job listing
// @route   DELETE /api/admin/jobs/:id
// @access  Protected / Admin
export const deleteJobAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job listing not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job listing removed successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger sync of external jobs and verified campus drives
// @route   POST /api/admin/jobs/sync-live
// @access  Protected / Admin
export const syncExternalJobsAdmin = async (req, res, next) => {
  try {
    const result = await syncAllJobs();

    res.status(200).json({
      success: true,
      message: `Sync completed: ${result.campusCount} verified campus drives and ${result.liveExternalCount} external live jobs updated.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications across platform for Admin
// @route   GET /api/admin/applications
// @access  Protected / Admin
export const getApplicationsAdmin = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 15 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (status && status !== 'All' && status !== 'ALL') {
      filter.status = status;
    }

    let query = Application.find(filter)
      .populate('user', 'name email branch cgpa college')
      .populate('job', 'title role company location applicationUrl')
      .sort({ updatedAt: -1 });

    const allApps = await query;

    // Filter in-memory if search query matches student name/email, company, or role
    let filtered = allApps;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = allApps.filter((app) => {
        const studentName = app.user?.name?.toLowerCase() || '';
        const studentEmail = app.user?.email?.toLowerCase() || '';
        const company = app.company?.toLowerCase() || '';
        const role = app.role?.toLowerCase() || '';
        return (
          studentName.includes(q) ||
          studentEmail.includes(q) ||
          company.includes(q) ||
          role.includes(q)
        );
      });
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status or notes from Admin panel
// @route   PATCH /api/admin/applications/:id, PATCH /api/admin/applications/:id/status
// @access  Protected / Admin
export const updateApplicationAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const ALLOWED_STATUSES = [
      'Interested',
      'Applied',
      'Shortlisted',
      'Interview',
      'Selected',
      'Rejected',
    ];

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: "${status}". Allowed values: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const app = await Application.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email branch cgpa college');

    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'Application record not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application updated successfully.',
      data: app,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authorized Admin download of student resume with audit log
// @route   GET /api/admin/resumes/:studentId/download
// @access  Protected / Admin
export const downloadStudentResumeAdmin = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const profile = await Profile.findOne({ user: studentId });
    if (!profile || !profile.resumeStorageKey) {
      return res.status(404).json({
        success: false,
        message: 'No resume found for this student.',
      });
    }

    const filePath = path.join(RESUME_DIR, profile.resumeStorageKey);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file is missing from storage.',
      });
    }

    // Audit logging
    console.log(
      `[AUDIT] Admin ${req.user.email} (${req.user.userId}) downloaded student resume: ${studentId} at ${new Date().toISOString()}`
    );

    const safeFilename = encodeURIComponent(
      profile.resumeFileName || `student_${studentId}_resume.pdf`
    );

    res.setHeader('Content-Type', profile.resumeMimeType || 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

export default {
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
};
