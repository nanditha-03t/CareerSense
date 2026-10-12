import Profile, { calculateProfileCompletion } from '../models/Profile.js';
import Skill from '../models/Skill.js';
import User from '../models/User.js';

/**
 * Profile Controller for CareerSense
 * Manages student academic history, CGPA, and contact details with user-scoped MongoDB persistence.
 */

// @desc    Get student profile for authenticated user
// @route   GET /api/profile
// @access  Protected
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    let profile = await Profile.findOne({ user: userId });
    const userDoc = await User.findById(userId);

    // If no profile document exists for this user, create an initial genuine student profile
    if (!profile) {
      profile = await Profile.create({
        user: userId,
        name: userDoc?.name || '',
        college: userDoc?.college || '',
        branch: userDoc?.branch || '',
        graduationYear: userDoc?.graduationYear || '',
        cgpa: null,
        phone: userDoc?.phoneNumber || '',
        location: '',
        bio: '',
        completionPercentage: 0,
        preferredRole: '',
        preferredLocation: '',
      });
    }

    // Count student's actual saved skills in MongoDB
    const skillsCount = await Skill.countDocuments({ user: userId });

    // Recalculate genuine completion percentage and missing fields
    const completionStats = calculateProfileCompletion(profile, skillsCount);
    if (profile.completionPercentage !== completionStats.completionPercentage) {
      profile.completionPercentage = completionStats.completionPercentage;
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: {
        ...profile.toObject(),
        completionDetails: completionStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update authenticated student profile
// @route   PUT /api/profile
// @access  Protected
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Prevent client from maliciously overriding user association
    const updateData = { ...req.body };
    delete updateData.user;

    // Treat empty string CGPA as null, and validate numeric CGPA safely
    if (updateData.cgpa === '' || updateData.cgpa === undefined) {
      updateData.cgpa = null;
    } else if (updateData.cgpa !== null) {
      const parsed = Number(updateData.cgpa);
      if (isNaN(parsed) || parsed < 0 || parsed > 10) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid CGPA between 0.0 and 10.0',
        });
      }
      updateData.cgpa = parsed;
    }

    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      profile = new Profile({ user: userId });
    }

    Object.assign(profile, updateData);

    // Count skills to determine updated completion percentage
    const skillsCount = await Skill.countDocuments({ user: userId });
    const completionStats = calculateProfileCompletion(profile, skillsCount);
    profile.completionPercentage = completionStats.completionPercentage;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...profile.toObject(),
        completionDetails: completionStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
