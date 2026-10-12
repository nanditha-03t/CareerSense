import Skill from '../models/Skill.js';

/**
 * Skill Controller for CareerSense
 * Manages technical and soft skills inventory with user-scoped MongoDB persistence.
 */

// @desc    Get all skills belonging to authenticated student
// @route   GET /api/skills
// @access  Protected
export const getSkills = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Fetch ONLY actual skills saved by this specific student (never seed fake starter skills)
    const skills = await Skill.find({ user: userId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new skill for authenticated student
// @route   POST /api/skills
// @access  Protected
export const addSkill = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { name, category, level } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required',
      });
    }

    const trimmedName = name.trim();

    // Check if skill already exists for this student (case-insensitive deduplication)
    const existing = await Skill.findOne({
      user: userId,
      name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Skill "${trimmedName}" is already present in your skills inventory.`,
      });
    }

    const newSkill = await Skill.create({
      user: userId,
      name: trimmedName,
      category: category ? category.trim() : 'General Technical',
      level: level || 'Intermediate',
    });

    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      data: newSkill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill with user ownership verification
// @route   DELETE /api/skills/:id
// @access  Protected
export const deleteSkill = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: `Skill with ID ${id} not found`,
      });
    }

    // Verify ownership: User cannot delete someone else's skill
    if (skill.user && skill.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this skill',
      });
    }

    await Skill.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Skill with ID ${id} deleted successfully`,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};
