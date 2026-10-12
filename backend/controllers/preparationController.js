import Preparation from '../models/Preparation.js';
import {
  PREPARATION_SYLLABUS,
  SUBTOPIC_MAP,
  TOPIC_MAP,
  SUBJECT_MAP,
  TOTAL_SUBTOPICS_COUNT,
  calculateSyllabusProgress,
  getNextRecommendedTopic,
} from '../data/preparationSyllabus.js';

/**
 * Preparation Controller for CareerSense
 * Provides structured placement syllabus and tracks automatic progress based on subtopic completions.
 * Guaranteed user-scoped isolation with single-source-of-truth MongoDB persistence.
 */

/**
 * Helper to build comprehensive preparation response object
 */
const buildPreparationResponse = (prepDoc) => {
  const completedList = Array.isArray(prepDoc.completedSubtopics)
    ? prepDoc.completedSubtopics
    : [];

  const completedSubtopicIds = completedList.map((item) => item.subtopicId);
  const completedSet = new Set(completedSubtopicIds);

  const {
    overallProgress,
    totalSubtopics,
    completedCount,
    remainingCount,
    topicProgress,
    subjectProgress,
  } = calculateSyllabusProgress(completedSubtopicIds);

  // Calculate subtopics completed today for the daily study target
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const completedTodayCount = completedList.filter(
    (item) => item.completedAt && new Date(item.completedAt) >= startOfToday
  ).length;

  // Retrieve recently completed subtopics (most recent first, up to 6)
  const recentCompleted = [...completedList]
    .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0))
    .slice(0, 6)
    .map((item) => {
      const meta = SUBTOPIC_MAP.get(item.subtopicId);
      return {
        subtopicId: item.subtopicId,
        completedAt: item.completedAt,
        name: meta ? meta.name : item.subtopicId,
        topicName: meta ? meta.topicName : '',
        subjectName: meta ? meta.subjectName : '',
        difficulty: meta ? meta.difficulty : 'Beginner',
      };
    });

  // Determine "Continue Learning" target
  let continueLearning = null;
  if (prepDoc.lastActiveSubtopicId && SUBTOPIC_MAP.has(prepDoc.lastActiveSubtopicId)) {
    const meta = SUBTOPIC_MAP.get(prepDoc.lastActiveSubtopicId);
    continueLearning = {
      subtopicId: meta.id,
      subtopicName: meta.name,
      topicId: meta.topicId,
      topicName: meta.topicName,
      subjectId: meta.subjectId,
      subjectName: meta.subjectName,
      difficulty: meta.difficulty,
      estimatedTime: meta.estimatedTime,
      isCompleted: completedSet.has(meta.id),
      reason: 'Last viewed topic',
    };
  }

  // Next recommended topic based on prerequisites
  const nextRecommended = getNextRecommendedTopic(completedSubtopicIds);

  // Fallback continueLearning to next recommended if no last active is set
  if (!continueLearning && nextRecommended) {
    continueLearning = {
      ...nextRecommended,
      isCompleted: false,
      reason: 'Recommended starting point',
    };
  }

  return {
    _id: prepDoc._id,
    user: prepDoc.user,
    overallProgress,
    totalSubtopics,
    completedCount,
    remainingCount,
    completedSubtopicIds,
    completedSubtopics: completedList,
    topicProgress,
    subjectProgress,
    syllabus: PREPARATION_SYLLABUS,
    continueLearning,
    nextRecommended,
    recentCompleted,
    dailyTarget: {
      target: prepDoc.dailyTargetCount || 3,
      completedToday: completedTodayCount,
      targetReached: completedTodayCount >= (prepDoc.dailyTargetCount || 3),
    },
    // Backward compatibility fields for legacy clients
    topics: prepDoc.topics || [],
    dsa: prepDoc.dsa || 0,
    aptitude: prepDoc.aptitude || 0,
    coding: prepDoc.coding || 0,
    sql: prepDoc.sql || 0,
    coreCS: prepDoc.coreCS || 0,
    communication: prepDoc.communication || 0,
  };
};

// @desc    Get full placement preparation syllabus & authenticated student progress
// @route   GET /api/preparation
// @access  Protected
export const getPreparation = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    let prep = await Preparation.findOne({ user: userId });

    // If no document exists for this user, create clean initial document with 0% progress
    if (!prep) {
      prep = await Preparation.create({
        user: userId,
        completedSubtopics: [],
        overallProgress: 0,
        dailyTargetCount: 3,
      });
    }

    const responseData = buildPreparationResponse(prep);

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a specific subtopic as complete
// @route   POST /api/preparation/complete
// @access  Protected
export const markSubtopicComplete = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { subtopicId } = req.body;

    if (!subtopicId || typeof subtopicId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'A valid subtopicId string is required',
      });
    }

    const cleanId = subtopicId.trim();
    if (!SUBTOPIC_MAP.has(cleanId)) {
      return res.status(400).json({
        success: false,
        message: `Subtopic ID "${cleanId}" does not exist in the placement syllabus`,
      });
    }

    let prep = await Preparation.findOne({ user: userId });
    if (!prep) {
      prep = new Preparation({ user: userId, completedSubtopics: [] });
    }

    // Check if already completed (prevent duplicate entries)
    const exists = prep.completedSubtopics.some((item) => item.subtopicId === cleanId);
    if (!exists) {
      prep.completedSubtopics.push({
        subtopicId: cleanId,
        completedAt: new Date(),
      });
    }

    const meta = SUBTOPIC_MAP.get(cleanId);
    prep.lastActiveSubtopicId = cleanId;
    if (meta) {
      prep.lastActiveSubjectId = meta.subjectId;
    }

    await prep.save();

    const responseData = buildPreparationResponse(prep);

    res.status(200).json({
      success: true,
      message: `Subtopic "${meta ? meta.name : cleanId}" marked as completed`,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a specific subtopic as incomplete (uncomplete)
// @route   POST /api/preparation/uncomplete
// @access  Protected
export const markSubtopicIncomplete = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { subtopicId } = req.body;

    if (!subtopicId || typeof subtopicId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'A valid subtopicId string is required',
      });
    }

    const cleanId = subtopicId.trim();
    if (!SUBTOPIC_MAP.has(cleanId)) {
      return res.status(400).json({
        success: false,
        message: `Subtopic ID "${cleanId}" does not exist in the placement syllabus`,
      });
    }

    let prep = await Preparation.findOne({ user: userId });
    if (!prep) {
      prep = new Preparation({ user: userId, completedSubtopics: [] });
    }

    // Remove subtopic from completed list
    prep.completedSubtopics = prep.completedSubtopics.filter(
      (item) => item.subtopicId !== cleanId
    );

    const meta = SUBTOPIC_MAP.get(cleanId);
    prep.lastActiveSubtopicId = cleanId;
    if (meta) {
      prep.lastActiveSubjectId = meta.subjectId;
    }

    await prep.save();

    const responseData = buildPreparationResponse(prep);

    res.status(200).json({
      success: true,
      message: `Subtopic "${meta ? meta.name : cleanId}" marked as incomplete`,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or set completion status for a subtopic
// @route   PUT /api/preparation/subtopic
// @access  Protected
export const updateSubtopicStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { subtopicId, completed } = req.body;

    if (!subtopicId || typeof subtopicId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'A valid subtopicId string is required',
      });
    }

    const cleanId = subtopicId.trim();
    if (!SUBTOPIC_MAP.has(cleanId)) {
      return res.status(400).json({
        success: false,
        message: `Subtopic ID "${cleanId}" does not exist in the placement syllabus`,
      });
    }

    let prep = await Preparation.findOne({ user: userId });
    if (!prep) {
      prep = new Preparation({ user: userId, completedSubtopics: [] });
    }

    const isCurrentlyCompleted = prep.completedSubtopics.some(
      (item) => item.subtopicId === cleanId
    );

    const shouldComplete = completed !== undefined ? Boolean(completed) : !isCurrentlyCompleted;

    if (shouldComplete && !isCurrentlyCompleted) {
      prep.completedSubtopics.push({
        subtopicId: cleanId,
        completedAt: new Date(),
      });
    } else if (!shouldComplete && isCurrentlyCompleted) {
      prep.completedSubtopics = prep.completedSubtopics.filter(
        (item) => item.subtopicId !== cleanId
      );
    }

    const meta = SUBTOPIC_MAP.get(cleanId);
    prep.lastActiveSubtopicId = cleanId;
    if (meta) {
      prep.lastActiveSubjectId = meta.subjectId;
    }

    await prep.save();

    const responseData = buildPreparationResponse(prep);

    res.status(200).json({
      success: true,
      message: `Subtopic updated successfully`,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record active / currently studied subtopic for Continue Learning
// @route   POST /api/preparation/active
// @access  Protected
export const setActiveSubtopic = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { subtopicId } = req.body;

    if (!subtopicId || !SUBTOPIC_MAP.has(subtopicId.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Valid subtopicId is required',
      });
    }

    const cleanId = subtopicId.trim();
    const meta = SUBTOPIC_MAP.get(cleanId);

    let prep = await Preparation.findOne({ user: userId });
    if (!prep) {
      prep = new Preparation({ user: userId });
    }

    prep.lastActiveSubtopicId = cleanId;
    if (meta) {
      prep.lastActiveSubjectId = meta.subjectId;
    }

    await prep.save();

    res.status(200).json({
      success: true,
      data: {
        lastActiveSubtopicId: cleanId,
        lastActiveSubjectId: prep.lastActiveSubjectId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get concise placement preparation summary (used by dashboard and headers)
// @route   GET /api/preparation/summary
// @access  Protected
export const getPreparationSummary = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const prep = await Preparation.findOne({ user: userId });
    const completedList = prep && Array.isArray(prep.completedSubtopics)
      ? prep.completedSubtopics
      : [];
    const completedIds = completedList.map((item) => item.subtopicId);

    const progress = calculateSyllabusProgress(completedIds);
    const nextRec = getNextRecommendedTopic(completedIds);

    // Calculate today's completion
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const completedToday = completedList.filter(
      (item) => item.completedAt && new Date(item.completedAt) >= startOfToday
    ).length;

    res.status(200).json({
      success: true,
      data: {
        overallProgress: progress.overallProgress,
        completedCount: progress.completedCount,
        remainingCount: progress.remainingCount,
        totalSubtopics: progress.totalSubtopics,
        subjectProgress: progress.subjectProgress,
        nextRecommended: nextRec,
        dailyTarget: {
          target: (prep && prep.dailyTargetCount) || 3,
          completedToday,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Legacy updatePreparation fallback for backward compatibility
export const updatePreparation = async (req, res, next) => {
  try {
    // If client sends subtopics or complete/uncomplete intent
    if (req.body.subtopicId) {
      return updateSubtopicStatus(req, res, next);
    }
    // If legacy client calls with topics array or progress values, redirect to standard getPreparation
    return getPreparation(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default {
  getPreparation,
  markSubtopicComplete,
  markSubtopicIncomplete,
  updateSubtopicStatus,
  setActiveSubtopic,
  getPreparationSummary,
  updatePreparation,
};
