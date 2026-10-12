import Project from '../models/Project.js';

/**
 * Validates a GitHub repository URL:
 * - Must use HTTPS
 * - Must belong to github.com
 * - Must contain owner and repository name
 */
export const validateGithubUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { valid: true, sanitized: '' };
  }

  const trimmed = url.trim();

  // HTTPS GitHub repository URL pattern:
  // e.g., https://github.com/username/repository or https://www.github.com/username/repository
  const githubRegex = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\/)?$/;

  if (!githubRegex.test(trimmed)) {
    return {
      valid: false,
      message:
        'Invalid GitHub repository URL. Must be a valid HTTPS URL such as https://github.com/username/repository',
    };
  }

  return { valid: true, sanitized: trimmed };
};

/**
 * Validates generic HTTP/HTTPS live demo URLs
 */
export const validateDemoUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { valid: true, sanitized: '' };
  }

  const trimmed = url.trim();
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

  if (!urlRegex.test(trimmed)) {
    return {
      valid: false,
      message: 'Invalid Live Demo URL. Please enter a valid web URL starting with http:// or https://',
    };
  }

  return { valid: true, sanitized: trimmed };
};

// @desc    Get all projects for the authenticated student
// @route   GET /api/projects
// @access  Protected
export const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID (scoped to owner)
// @route   GET /api/projects/:id
// @access  Protected
export const getProjectById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${id} not found.`,
      });
    }

    if (project.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this project.',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new project for the authenticated student
// @route   POST /api/projects
// @access  Protected
export const createProject = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      title,
      description,
      technologies,
      githubUrl,
      liveDemoUrl,
      startDate,
      endDate,
      status,
      domain,
      thumbnailUrl,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Project title is required.',
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Project description is required.',
      });
    }

    // Process technologies
    let techArray = [];
    if (Array.isArray(technologies)) {
      techArray = technologies.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof technologies === 'string' && technologies.trim()) {
      techArray = technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }

    // Validate GitHub URL
    const githubCheck = validateGithubUrl(githubUrl);
    if (!githubCheck.valid) {
      return res.status(400).json({
        success: false,
        message: githubCheck.message,
      });
    }

    // Validate Live Demo URL
    const demoCheck = validateDemoUrl(liveDemoUrl);
    if (!demoCheck.valid) {
      return res.status(400).json({
        success: false,
        message: demoCheck.message,
      });
    }

    const project = await Project.create({
      user: userId,
      title: title.trim(),
      description: description.trim(),
      technologies: techArray,
      githubUrl: githubCheck.sanitized,
      liveDemoUrl: demoCheck.sanitized,
      startDate: startDate ? String(startDate).trim() : '',
      endDate: endDate ? String(endDate).trim() : '',
      status: ['In Progress', 'Completed', 'Planning', 'Archived'].includes(status)
        ? status
        : 'Completed',
      domain: domain ? String(domain).trim() : 'Full Stack Web Development',
      thumbnailUrl: thumbnailUrl ? String(thumbnailUrl).trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project (scoped to owner)
// @route   PUT /api/projects/:id
// @access  Protected
export const updateProject = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${id} not found.`,
      });
    }

    if (project.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to edit this project.',
      });
    }

    const {
      title,
      description,
      technologies,
      githubUrl,
      liveDemoUrl,
      startDate,
      endDate,
      status,
      domain,
      thumbnailUrl,
    } = req.body;

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Project title cannot be empty.',
        });
      }
      project.title = title.trim();
    }

    if (description !== undefined) {
      if (!description || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Project description cannot be empty.',
        });
      }
      project.description = description.trim();
    }

    if (technologies !== undefined) {
      if (Array.isArray(technologies)) {
        project.technologies = technologies.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof technologies === 'string') {
        project.technologies = technologies.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    if (githubUrl !== undefined) {
      const githubCheck = validateGithubUrl(githubUrl);
      if (!githubCheck.valid) {
        return res.status(400).json({
          success: false,
          message: githubCheck.message,
        });
      }
      project.githubUrl = githubCheck.sanitized;
    }

    if (liveDemoUrl !== undefined) {
      const demoCheck = validateDemoUrl(liveDemoUrl);
      if (!demoCheck.valid) {
        return res.status(400).json({
          success: false,
          message: demoCheck.message,
        });
      }
      project.liveDemoUrl = demoCheck.sanitized;
    }

    if (startDate !== undefined) project.startDate = String(startDate).trim();
    if (endDate !== undefined) project.endDate = String(endDate).trim();
    if (status !== undefined && ['In Progress', 'Completed', 'Planning', 'Archived'].includes(status)) {
      project.status = status;
    }
    if (domain !== undefined) project.domain = String(domain).trim();
    if (thumbnailUrl !== undefined) project.thumbnailUrl = String(thumbnailUrl).trim();

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project (scoped to owner)
// @route   DELETE /api/projects/:id
// @access  Protected
export const deleteProject = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${id} not found.`,
      });
    }

    if (project.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this project.',
      });
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
