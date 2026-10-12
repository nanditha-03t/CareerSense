import Job from '../models/Job.js';
import Skill from '../models/Skill.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import { calculateSkillMatch } from '../utils/skillMatcher.js';
import { getSkillRecommendation } from '../utils/recommendationEngine.js';

/**
 * Matching & Skill Gap Controller for CareerSense
 * Compares authenticated student's skills and academic credentials against job drive requirements.
 */

// Helper: Safely retrieve authenticated student's real skills from MongoDB (never fabricate or seed fake skills)
export const getStudentSkills = async (userId) => {
  if (!userId) return [];
  const skills = await Skill.find({ user: userId }).sort({ createdAt: 1 });
  return skills;
};

// Helper: Determine CGPA & academic eligibility
// Status values: 'eligible', 'not_eligible', 'unknown'
export const determineEligibility = (studentCgpa, jobMinCgpa, eligibilityText = '') => {
  // If job doesn't define minCgpa, try parsing from eligibility text (e.g. "6.5 CGPA" or "7.0+ CGPA")
  let effectiveMinCgpa = jobMinCgpa;
  if ((effectiveMinCgpa === undefined || effectiveMinCgpa === null) && eligibilityText) {
    const cgpaMatch = eligibilityText.match(/([0-9]\.[0-9]+)\s*(\+|plus)?\s*cgpa/i) ||
                      eligibilityText.match(/cgpa\s*[:=]?\s*([0-9]\.[0-9]+)/i);
    if (cgpaMatch) {
      effectiveMinCgpa = parseFloat(cgpaMatch[1]);
    }
  }

  // 1. If job has NO CGPA requirement, student is eligible (not blocked by missing CGPA)
  if (effectiveMinCgpa === undefined || effectiveMinCgpa === null || isNaN(effectiveMinCgpa) || effectiveMinCgpa <= 0) {
    return {
      status: 'eligible',
      badgeText: 'Eligible',
      message: 'No minimum CGPA requirement specified for this position.',
      minCgpaRequired: null,
      studentCgpa: studentCgpa !== undefined && studentCgpa !== null ? Number(studentCgpa) : null,
    };
  }

  // 2. Job requires a minimum CGPA, but student has NOT provided their CGPA yet
  if (studentCgpa === undefined || studentCgpa === null || isNaN(Number(studentCgpa)) || Number(studentCgpa) <= 0) {
    return {
      status: 'unknown',
      badgeText: 'Eligibility Unknown',
      message: `Minimum ${effectiveMinCgpa} CGPA required. CGPA not provided — eligibility cannot be determined.`,
      minCgpaRequired: effectiveMinCgpa,
      studentCgpa: null,
    };
  }

  // 3. Student has provided CGPA: compare accurately
  const numCgpa = Number(studentCgpa);
  if (numCgpa >= effectiveMinCgpa) {
    return {
      status: 'eligible',
      badgeText: 'Eligible',
      message: `Meets academic criterion (${numCgpa} ≥ ${effectiveMinCgpa} CGPA required).`,
      minCgpaRequired: effectiveMinCgpa,
      studentCgpa: numCgpa,
    };
  } else {
    return {
      status: 'not_eligible',
      badgeText: 'Not Eligible',
      message: `Current CGPA (${numCgpa}) does not meet the minimum requirement of ${effectiveMinCgpa} CGPA.`,
      minCgpaRequired: effectiveMinCgpa,
      studentCgpa: numCgpa,
    };
  }
};

// @desc    Analyze skill match for a specific job against authenticated student
// @route   GET /api/skill-gap/job/:jobId (or /api/skill-gap/:jobId)
// @access  Protected
export const getJobSkillMatch = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { jobId } = req.params;

    // 1. Fetch job drive from MongoDB
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job drive with ID ${jobId} not found`,
      });
    }

    // 2. Fetch authenticated student's skills and profile from MongoDB
    const [studentSkills, profileDoc] = await Promise.all([
      getStudentSkills(userId),
      Profile.findOne({ user: userId }),
    ]);

    // 3. Run core matching algorithm
    const matchResult = calculateSkillMatch(studentSkills, job.requiredSkills);

    // 4. Determine academic eligibility
    const eligibilityResult = determineEligibility(profileDoc?.cgpa, job.minCgpa, job.eligibility);

    // 5. Return structured response
    res.status(200).json({
      success: true,
      message: 'Skill match calculated successfully',
      data: {
        job: {
          id: job._id,
          company: job.company,
          role: job.role,
          location: job.location,
          package: job.package,
          eligibility: job.eligibility,
          minCgpa: job.minCgpa,
          driveDate: job.driveDate,
          requiredSkills: job.requiredSkills,
        },
        eligibility: eligibilityResult,
        ...matchResult,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs with dynamic personalized match scores for authenticated student
// @route   GET /api/skill-gap/jobs
// @access  Protected
export const getJobsWithStudentMatch = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const [jobs, studentSkills, profileDoc] = await Promise.all([
      Job.find({ active: { $ne: false } }).sort({ createdAt: -1 }),
      getStudentSkills(userId),
      Profile.findOne({ user: userId }),
    ]);

    const jobsWithMatch = jobs.map((job) => {
      const matchResult = calculateSkillMatch(studentSkills, job.requiredSkills);
      const eligibilityResult = determineEligibility(profileDoc?.cgpa, job.minCgpa, job.eligibility);

      return {
        ...job.toObject(),
        id: job._id.toString(),
        match: matchResult.matchPercentage,
        matchDetails: matchResult,
        eligibilityDetails: eligibilityResult,
      };
    });

    res.status(200).json({
      success: true,
      count: jobsWithMatch.length,
      hasStudentSkills: studentSkills.length > 0,
      data: jobsWithMatch,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregated placement skill gap analysis across all campus opportunities
// @route   GET /api/skill-gap
// @access  Protected
export const getAggregatedSkillGaps = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const [jobs, studentSkills] = await Promise.all([
      Job.find({ active: { $ne: false } }),
      getStudentSkills(userId),
    ]);

    const hasStudentSkills = studentSkills.length > 0;

    // If student has NOT added any skills, return explicit empty state
    if (!hasStudentSkills) {
      return res.status(200).json({
        success: true,
        data: {
          status: 'profile_incomplete',
          message: 'Add your skills to generate your personalized skill gap analysis.',
          overallAverageMatch: null, // Not 0%, but undefined/null
          totalGapsCount: 0,
          highPriorityCount: 0,
          mediumPriorityCount: 0,
          lowPriorityCount: 0,
          prioritizedGaps: [],
          jobsAnalysis: jobs.map((job) => ({
            jobId: job._id,
            company: job.company,
            role: job.role,
            matchPercentage: null,
            matchedSkills: [],
            missingSkills: [],
            status: 'profile_incomplete',
          })),
        },
      });
    }

    // Track frequency of missing skills across all campus drives
    const missingFrequencyMap = new Map(); // skill -> count
    const matchedFrequencyMap = new Map();

    const jobsAnalysis = jobs.map((job) => {
      const match = calculateSkillMatch(studentSkills, job.requiredSkills);

      match.missingSkills.forEach((skill) => {
        missingFrequencyMap.set(skill, (missingFrequencyMap.get(skill) || 0) + 1);
      });

      match.matchedSkills.forEach((skill) => {
        matchedFrequencyMap.set(skill, (matchedFrequencyMap.get(skill) || 0) + 1);
      });

      return {
        jobId: job._id,
        company: job.company,
        role: job.role,
        matchPercentage: match.matchPercentage,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        status: match.status,
      };
    });

    // Categorize missing skills by priority based on market frequency
    const totalJobs = jobs.length || 1;
    const prioritizedGaps = Array.from(missingFrequencyMap.entries())
      .map(([skill, count]) => {
        const demandRatio = count / totalJobs;
        let priority = 'Low Priority';
        let priorityVariant = 'low';

        if (demandRatio >= 0.5) {
          priority = 'High Priority';
          priorityVariant = 'high';
        } else if (demandRatio >= 0.25) {
          priority = 'Medium Priority';
          priorityVariant = 'medium';
        }

        const rec = getSkillRecommendation(skill, priority);

        return {
          id: skill.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          skill,
          requiredByCount: count,
          demandPercentage: Math.round(demandRatio * 100),
          priority,
          priorityVariant,
          recommendation: rec.recommendation,
          preparationCategory: rec.preparationCategory,
          action: rec.action,
          explanation: `Required by ${count} of ${totalJobs} campus placement drives. Bridging this skill increases your hiring eligibility.`,
          suggestedAction: rec.action,
        };
      })
      .sort((a, b) => b.requiredByCount - a.requiredByCount);

    const overallAverageMatch =
      jobsAnalysis.length > 0
        ? Number(
            (
              jobsAnalysis.reduce((acc, curr) => acc + (curr.matchPercentage || 0), 0) /
              jobsAnalysis.length
            ).toFixed(2)
          )
        : 0;

    res.status(200).json({
      success: true,
      data: {
        status: prioritizedGaps.length === 0 ? 'no_missing_skills' : 'analysis_available',
        message:
          prioritizedGaps.length === 0
            ? 'Great work! You meet all required skills for active campus placement drives.'
            : 'Personalized skill gap analysis computed from your saved skills.',
        overallAverageMatch,
        totalGapsCount: prioritizedGaps.length,
        highPriorityCount: prioritizedGaps.filter((g) => g.priority === 'High Priority').length,
        mediumPriorityCount: prioritizedGaps.filter((g) => g.priority === 'Medium Priority').length,
        lowPriorityCount: prioritizedGaps.filter((g) => g.priority === 'Low Priority').length,
        prioritizedGaps,
        jobsAnalysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get structured placement preparation recommendations for missing skills
// @route   GET /api/skill-gap/recommendations
// @access  Protected
export const getSkillRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const [jobs, studentSkills] = await Promise.all([
      Job.find(),
      getStudentSkills(userId),
    ]);

    // If student has no skills saved, return helpful empty guidance
    if (studentSkills.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        status: 'profile_incomplete',
        recommendations: [],
        message: 'Add your skills to generate your personalized skill gap analysis.',
      });
    }

    const missingFrequencyMap = new Map();
    const totalJobs = jobs.length || 1;

    jobs.forEach((job) => {
      const match = calculateSkillMatch(studentSkills, job.requiredSkills);
      match.missingSkills.forEach((skill) => {
        missingFrequencyMap.set(skill, (missingFrequencyMap.get(skill) || 0) + 1);
      });
    });

    if (missingFrequencyMap.size === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        status: 'no_missing_skills',
        recommendations: [],
        message: 'Great! You currently meet the required skills for the available campus drives.',
      });
    }

    const recommendations = Array.from(missingFrequencyMap.entries())
      .map(([skill, count]) => {
        const demandRatio = count / totalJobs;
        let priority = 'Medium';
        if (demandRatio >= 0.5) priority = 'High';
        else if (demandRatio < 0.25) priority = 'Low';

        return getSkillRecommendation(skill, priority);
      })
      .sort((a, b) => {
        const order = { High: 3, Medium: 2, Low: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      });

    res.status(200).json({
      success: true,
      count: recommendations.length,
      status: 'analysis_available',
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getStudentSkills,
  getJobSkillMatch,
  getJobsWithStudentMatch,
  getAggregatedSkillGaps,
  getSkillRecommendations,
  determineEligibility,
};
