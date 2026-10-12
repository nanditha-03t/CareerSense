import Job from '../models/Job.js';

/**
 * Validates if a string is a valid HTTP or HTTPS URL
 */
const isValidHttpUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    const parsed = new URL(urlStr.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Job Controller for CareerSense
 * Manages verified campus hiring drives and placement opportunities with MongoDB persistence.
 */

// @desc    Get all campus jobs with optional filtering and search
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      employmentType,
      experienceLevel,
      workplaceType,
      isVerified,
      active,
    } = req.query;

    const filter = {};

    // By default, public student listing only returns active jobs
    if (active !== undefined) {
      filter.active = active === 'true';
    } else {
      filter.active = { $ne: false };
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { role: regex },
        { title: regex },
        { company: regex },
        { requiredSkills: { $in: [regex] } },
        { location: regex },
      ];
    }

    if (location && location.trim() && location.toLowerCase() !== 'all') {
      filter.location = new RegExp(location.trim(), 'i');
    }

    if (employmentType && employmentType.toLowerCase() !== 'all') {
      filter.employmentType = employmentType;
    }

    if (experienceLevel && experienceLevel.toLowerCase() !== 'all') {
      filter.experienceLevel = experienceLevel;
    }

    if (workplaceType && workplaceType.toLowerCase() !== 'all') {
      filter.workplaceType = workplaceType;
    }

    if (isVerified !== undefined) {
      filter.isVerified = isVerified === 'true';
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job drive with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new campus job drive
// @route   POST /api/jobs
// @access  Protected / Admin
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      role,
      company,
      location,
      employmentType,
      experienceLevel,
      workplaceType,
      type,
      minCgpa,
      ctc,
      package: pkg,
      driveDate,
      deadline,
      description,
      requiredSkills,
      eligibility,
      applicationUrl,
      source,
      isVerified,
      active,
    } = req.body;

    const jobTitle = (title || role || '').trim();
    const jobCompany = (company || '').trim();

    if (!jobTitle || !jobCompany) {
      return res.status(400).json({
        success: false,
        message: 'Job Title / Role and Company name are required.',
      });
    }

    // Validate application URL if supplied
    if (applicationUrl && !isValidHttpUrl(applicationUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application URL. Must start with http:// or https://',
      });
    }

    // Format skills array
    let skillsArray = [];
    if (Array.isArray(requiredSkills)) {
      skillsArray = requiredSkills.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof requiredSkills === 'string') {
      skillsArray = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (skillsArray.length === 0) {
      skillsArray = ['Problem Solving'];
    }

    const newJob = await Job.create({
      title: jobTitle,
      role: jobTitle,
      company: jobCompany,
      location: location || 'Hyderabad / Pan India',
      employmentType: employmentType || 'Full-Time',
      experienceLevel: experienceLevel || 'Fresher',
      workplaceType: workplaceType || 'Onsite',
      package: pkg || ctc || '3.5 – 6.5 LPA',
      salary: pkg || ctc || '3.5 – 6.5 LPA',
      driveDate: driveDate || 'Upcoming Campus Drive',
      deadline: deadline || 'Open / Rolling',
      description:
        description ||
        'Campus placement recruitment opportunity for B.Tech engineering graduates.',
      requiredSkills: skillsArray,
      eligibility: eligibility || 'B.Tech with 60% aggregate throughout academics',
      applicationUrl: applicationUrl ? applicationUrl.trim() : '',
      source: source || 'Campus Placement Cell',
      isVerified: Boolean(isVerified),
      active: active !== undefined ? Boolean(active) : true,
      lastVerifiedDate: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Job drive created successfully',
      data: newJob,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing campus job drive
// @route   PUT /api/jobs/:id
// @access  Protected / Admin
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.title && !updateData.role) updateData.role = updateData.title;
    if (updateData.role && !updateData.title) updateData.title = updateData.role;
    if (updateData.ctc && !updateData.package) updateData.package = updateData.ctc;

    if (updateData.applicationUrl && !isValidHttpUrl(updateData.applicationUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application URL. Must start with http:// or https://',
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
        message: `Job drive with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job drive updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete campus job drive
// @route   DELETE /api/jobs/:id
// @access  Protected / Admin
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job drive with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job drive deleted successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};
