import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Preparation from '../models/Preparation.js';
import Skill from '../models/Skill.js';
import { generateToken } from '../utils/jwtUtils.js';

/**
 * Auth Controller for CareerSense
 * Handles student registration, login, JWT issuance, and authentication checks.
 */

// @desc    Register a new student account
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      fullName,
      email,
      password,
      college,
      collegeName,
      branch,
      graduationYear,
      phoneNumber,
    } = req.body;

    const studentName = (name || fullName || '').trim();
    const studentEmail = (email || '').toLowerCase().trim();
    const studentCollege = (college || collegeName || '').trim();
    const studentBranch = (branch || '').trim();
    const studentGradYear = graduationYear ? String(graduationYear).trim() : '';
    const studentPhone = (phoneNumber || '').trim();

    // 1. Validate required fields
    if (!studentName) {
      return res.status(400).json({
        success: false,
        message: 'Student name is required',
      });
    }

    if (!studentEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: studentEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // 3. Hash password using bcryptjs with 10 salt rounds
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user in MongoDB with student role (cannot self-promote to admin)
    const newUser = await User.create({
      name: studentName,
      email: studentEmail,
      password: hashedPassword,
      college: studentCollege,
      branch: studentBranch,
      graduationYear: studentGradYear,
      phoneNumber: studentPhone,
      role: 'student',
    });

    // 5. Initialize user's profile with genuine values (no fake CGPA or fabricated skills)
    const initialProfile = {
      user: newUser._id,
      name: newUser.name,
      college: newUser.college,
      branch: newUser.branch,
      graduationYear: newUser.graduationYear,
      phone: newUser.phoneNumber,
      cgpa: null,
      location: '',
      bio: '',
      preferredRole: '',
      preferredLocation: '',
      completionPercentage: 0,
    };

    // Calculate genuine completion from what was actually provided at registration
    let initialScore = 0;
    if (initialProfile.name) initialScore += 10;
    if (initialProfile.college) initialScore += 15;
    if (initialProfile.branch) initialScore += 15;
    if (initialProfile.graduationYear) initialScore += 10;
    initialProfile.completionPercentage = initialScore;

    await Profile.create(initialProfile);

    await Preparation.create({
      user: newUser._id,
      completedSubtopics: [],
      overallProgress: 0,
      dailyTargetCount: 3,
      dsa: 0,
      aptitude: 0,
      coding: 0,
      sql: 0,
      coreCS: 0,
      communication: 0,
      topics: [],
    });

    // Do NOT insert default or fabricated skills. The student starts with genuinely 0 skills.

    // 6. Generate signed JWT token
    const token = generateToken(newUser._id);

    // 7. Return clean success response without exposing password or hash
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          college: newUser.college,
          branch: newUser.branch,
          graduationYear: newUser.graduationYear,
          role: newUser.role || 'student',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate student/admin login & issue JWT token
// @route   POST /api/auth/login, POST /api/auth/student-login, POST /api/auth/admin-login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password, portal } = req.body;

    // 1. Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Find user by email
    const user = await User.findOne({ email: normalizedEmail });

    // Generic error message for security (prevents user enumeration)
    const invalidAuthResponse = () =>
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });

    if (!user) {
      return invalidAuthResponse();
    }

    // 3. Compare entered password with stored bcrypt hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return invalidAuthResponse();
    }

    const userRole = user.role || 'student';

    // 4. Enforce strict portal and role boundary
    if (portal === 'student' && userRole !== 'student') {
      return res.status(403).json({
        success: false,
        message:
          'This portal is for students only. Please use the Admin Login portal at /admin/login.',
      });
    }

    if (portal === 'admin' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message:
          'Access denied: This portal is for administrators only. Please use the Student Login portal at /student/login.',
      });
    }

    // 5. Issue signed JWT token
    const token = generateToken(user._id);

    // 6. Return success response with safe user info
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          college: user.college,
          branch: user.branch,
          graduationYear: user.graduationYear,
          role: userRole,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently authenticated user details
// @route   GET /api/auth/me
// @access  Protected
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
};
