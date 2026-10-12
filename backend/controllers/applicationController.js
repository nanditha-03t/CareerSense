import Application from '../models/Application.js';

/**
 * Application Controller for CareerSense
 * Tracks campus placement applications with strict user ownership and MongoDB persistence.
 */

// @desc    Get all applications belonging to authenticated student
// @route   GET /api/applications
// @access  Protected
export const getApplications = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    let applications = await Application.find({ user: userId }).sort({ createdAt: -1 });

    // Seed default starter applications for new user if their collection is empty
    if (applications.length === 0) {
      const defaultApps = [
        {
          company: 'TCS',
          role: 'Software Developer',
          appliedDate: 'Oct 02, 2026',
          status: 'Interview',
          driveType: 'On-Campus Drive',
          notes: 'Technical Interview scheduled next Tuesday.',
        },
        {
          company: 'Infosys',
          role: 'Python Developer',
          appliedDate: 'Sep 28, 2026',
          status: 'Applied',
          driveType: 'National Qualifier Test',
          notes: 'Waiting for preliminary test results.',
        },
      ];

      await Application.insertMany(
        defaultApps.map((a) => ({ ...a, user: userId }))
      );

      applications = await Application.find({ user: userId }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a new job application for authenticated student
// @route   POST /api/applications
// @access  Protected
export const addApplication = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { company, role, appliedDate, driveType, notes, applicationUrl } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: 'Company and Role are required fields',
      });
    }

    // Default status from backend: 'Interested'
    // Students cannot self-assign verified statuses like 'Shortlisted' or 'Selected'
    const initialStatus =
      req.user.role === 'admin' && req.body.status ? req.body.status : 'Interested';

    const newApp = await Application.create({
      user: userId,
      company: company.trim(),
      role: role.trim(),
      appliedDate:
        appliedDate ||
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      status: initialStatus,
      driveType: driveType || 'Campus Hiring Drive',
      applicationUrl: applicationUrl || '',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Application added successfully',
      data: newApp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application with user ownership verification
// @route   PUT /api/applications/:id
// @access  Protected
export const updateApplication = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const existingApp = await Application.findById(id);

    if (!existingApp) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found`,
      });
    }

    // Verify ownership: User cannot update another user's application
    if (existingApp.user && existingApp.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to update this application',
      });
    }

    // ENFORCE SECURITY RESTRICTION: Students are NEVER allowed to change application statuses
    if (
      req.body.status !== undefined &&
      req.body.status !== existingApp.status &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Forbidden: Students cannot modify application status. Only administrators can update application statuses.',
      });
    }

    const updateData = { ...req.body };
    // Strip status if request originates from a student
    if (req.user.role !== 'admin') {
      delete updateData.status;
    }

    const updatedApp = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: updatedApp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application with user ownership verification
// @route   DELETE /api/applications/:id
// @access  Protected
export const deleteApplication = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const existingApp = await Application.findById(id);

    if (!existingApp) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found`,
      });
    }

    // Verify ownership: User cannot delete another user's application
    if (existingApp.user && existingApp.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this application',
      });
    }

    await Application.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Application with ID ${id} deleted successfully`,
      data: existingApp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all campus applications across all students (For Placement Officer / Admin)
// @route   GET /api/applications/all
// @access  Protected / Admin
export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('user', 'name email college branch cgpa')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// Allowed application lifecycle statuses
const ALLOWED_STATUSES = [
  'Interested',
  'Applied',
  'Shortlisted',
  'Interview',
  'Selected',
  'Rejected',
];

// @desc    Update application status as Placement Officer / Admin
// @route   PATCH /api/applications/admin/:id, PATCH /api/admin/applications/:id/status
// @access  Protected / Admin
export const updateApplicationStatusAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: "${status}". Allowed values: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const app = await Application.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true, runValidators: true }
    ).populate('user', 'name email college branch cgpa');

    if (!app) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: app,
    });
  } catch (error) {
    next(error);
  }
};

