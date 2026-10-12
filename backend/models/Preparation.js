import mongoose from 'mongoose';
import { calculateSyllabusProgress } from '../data/preparationSyllabus.js';

/**
 * Subtopic completion record schema
 */
const completionSchema = new mongoose.Schema(
  {
    subtopicId: {
      type: String,
      required: true,
      trim: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/**
 * Preparation Schema for CareerSense
 * Tracks per-student placement preparation across structured subjects, topics, and subtopics.
 * Progress is purely derived from verified subtopic completions (no manual arbitrary editing).
 */
const preparationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      sparse: true,
      index: true,
    },
    // Array of completed subtopics with timestamps
    completedSubtopics: {
      type: [completionSchema],
      default: [],
    },
    // Overall preparation progress derived automatically (0 - 100)
    overallProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    // Continue learning state: points to most recent active subtopic & subject
    lastActiveSubtopicId: {
      type: String,
      default: null,
      trim: true,
    },
    lastActiveSubjectId: {
      type: String,
      default: null,
      trim: true,
    },
    // Daily target for placement preparation (default: 3 subtopics/day)
    dailyTargetCount: {
      type: Number,
      default: 3,
      min: 1,
      max: 20,
    },
    // Legacy fields maintained for backward compatibility
    dsa: { type: Number, default: 0 },
    aptitude: { type: Number, default: 0 },
    coding: { type: Number, default: 0 },
    sql: { type: Number, default: 0 },
    coreCS: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    topics: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

// Automatically recalculate progress before save
preparationSchema.pre('save', function () {
  // Deduplicate completedSubtopics by subtopicId while preserving earliest completedAt
  if (Array.isArray(this.completedSubtopics)) {
    const seen = new Map();
    this.completedSubtopics.forEach((item) => {
      if (item && item.subtopicId) {
        if (!seen.has(item.subtopicId)) {
          seen.set(item.subtopicId, item);
        }
      }
    });
    this.completedSubtopics = Array.from(seen.values());
  } else {
    this.completedSubtopics = [];
  }

  // Derive progress metrics using syllabus helper
  const completedIds = this.completedSubtopics.map((c) => c.subtopicId);
  const { overallProgress, topicProgress, subjectProgress } = calculateSyllabusProgress(completedIds);

  this.overallProgress = overallProgress;

  // Sync legacy compatibility fields
  this.dsa = subjectProgress['dsa']?.progress || subjectProgress['data-structures']?.progress || 0;
  this.aptitude = Math.round(((subjectProgress['quantitative-aptitude']?.progress || 0) + (subjectProgress['logical-reasoning']?.progress || 0)) / 2);
  this.coding = subjectProgress['programming-fundamentals']?.progress || 0;
  this.sql = subjectProgress['dbms']?.progress || 0;
  this.coreCS = Math.round(((subjectProgress['operating-systems']?.progress || 0) + (subjectProgress['computer-networks']?.progress || 0) + (subjectProgress['dbms']?.progress || 0)) / 3);
  this.communication = subjectProgress['verbal-ability']?.progress || 0;

  // Sync legacy topics array
  this.topics = [
    { id: 'dsa', name: 'DSA', progress: this.dsa, focus: 'Data Structures & Algorithms' },
    { id: 'aptitude', name: 'Aptitude', progress: this.aptitude, focus: 'Quantitative & Logical' },
    { id: 'coding', name: 'Coding', progress: this.coding, focus: 'Programming Fundamentals' },
    { id: 'sql', name: 'SQL', progress: this.sql, focus: 'DBMS & Relational Queries' },
    { id: 'core-cs', name: 'Core CS', progress: this.coreCS, focus: 'OS, DBMS, Networks' },
    { id: 'communication', name: 'Communication', progress: this.communication, focus: 'Verbal Ability' },
  ];
});

const Preparation = mongoose.model('Preparation', preparationSchema);
export default Preparation;
