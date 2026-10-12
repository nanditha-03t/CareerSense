import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Preparation from '../models/Preparation.js';
import { generateToken } from '../utils/jwtUtils.js';
import {
  PREPARATION_SYLLABUS,
  TOTAL_SUBTOPICS_COUNT,
  SUBTOPIC_MAP,
  calculateSyllabusProgress,
  getNextRecommendedTopic,
} from '../data/preparationSyllabus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n================================================================');
  console.log('🧪 VERIFYING PREPARATION PORTAL & AUTOMATIC PROGRESS TRACKING');
  console.log('================================================================\n');

  await connectDB();

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Syllabus Hierarchy and Metadata Completeness
    // -------------------------------------------------------------------------
    console.log('--- TEST 1: Syllabus Hierarchy & Structure ---');
    assert(Array.isArray(PREPARATION_SYLLABUS) && PREPARATION_SYLLABUS.length === 16, 'Syllabus contains all 16 core subjects');

    const expectedSubjects = [
      'programming-fundamentals',
      'object-oriented-programming',
      'data-structures',
      'dsa',
      'java-programming',
      'python-programming',
      'dbms',
      'operating-systems',
      'computer-networks',
      'design-and-analysis-of-algorithms',
      'quantitative-aptitude',
      'logical-reasoning',
      'verbal-ability',
      'software-engineering-and-testing',
      'web-development',
      'placement-and-interview-prep',
    ];
    const actualSubjectIds = PREPARATION_SYLLABUS.map((s) => s.id);
    assert(
      expectedSubjects.every((id) => actualSubjectIds.includes(id)),
      'All 16 expected core placement subjects are present'
    );

    assert(TOTAL_SUBTOPICS_COUNT > 0, `Total subtopics indexed: ${TOTAL_SUBTOPICS_COUNT}`);

    // Verify all subtopics have reputable learning resources with valid URLs
    let allResourcesValid = true;
    for (const [id, subtopic] of SUBTOPIC_MAP.entries()) {
      if (!subtopic.name || !subtopic.description || !subtopic.estimatedTime || !subtopic.difficulty) {
        allResourcesValid = false;
        console.error(`Missing metadata for ${id}`);
        break;
      }
      if (!Array.isArray(subtopic.learningResources) || subtopic.learningResources.length === 0) {
        allResourcesValid = false;
        console.error(`Missing learning resources for ${id}`);
        break;
      }
      for (const res of subtopic.learningResources) {
        if (!res.url || !res.url.startsWith('https://')) {
          allResourcesValid = false;
          console.error(`Invalid resource URL for ${id}: ${res.url}`);
          break;
        }
      }
    }
    assert(allResourcesValid, 'All 88 subtopics have complete metadata and valid https:// learning resources');

    // -------------------------------------------------------------------------
    // TEST 2: Newly registered student with zero progress
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 2: Newly Registered Student Zero Progress ---');
    const student1Email = `student_prep_test_${Date.now()}@test.com`;
    const student1 = await User.create({
      name: 'Test Student Alpha',
      email: student1Email,
      password: 'hashed_password_sample',
      role: 'student',
      college: 'MLR Institute of Technology',
      branch: 'Computer Science and Engineering',
    });

    let prep1 = await Preparation.create({
      user: student1._id,
      completedSubtopics: [],
      overallProgress: 0,
      dailyTargetCount: 3,
    });

    assert(prep1.overallProgress === 0, 'Initial overall progress is 0%');
    assert(prep1.completedSubtopics.length === 0, 'Initial completed subtopics count is 0');
    assert(prep1.dsa === 0 && prep1.sql === 0 && prep1.coreCS === 0, 'Legacy fields correctly default to 0%');

    // -------------------------------------------------------------------------
    // TEST 3: Completing Subtopics & Progress Recalculation
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 3: Completing Subtopics & Recalculation ---');
    // Student 1 completes 'pf-variables-constants'
    prep1.completedSubtopics.push({ subtopicId: 'pf-variables-constants', completedAt: new Date() });
    await prep1.save();

    const expectedProg1 = Math.round((1 / TOTAL_SUBTOPICS_COUNT) * 100);
    assert(prep1.completedSubtopics.length === 1, 'Completed subtopics count is 1');
    assert(prep1.overallProgress === expectedProg1, `Overall progress accurately recalculated: ${prep1.overallProgress}%`);
    assert(prep1.coding > 0, `Topic progress for Programming Fundamentals updated: ${prep1.coding}%`);

    // Complete another subtopic in the same topic: 'pf-data-types'
    prep1.completedSubtopics.push({ subtopicId: 'pf-data-types', completedAt: new Date() });
    await prep1.save();
    assert(prep1.completedSubtopics.length === 2, 'Completed subtopics count is 2');
    const expectedProg2 = Math.round((2 / TOTAL_SUBTOPICS_COUNT) * 100);
    assert(prep1.overallProgress === expectedProg2, `Overall progress recalculated: ${prep1.overallProgress}%`);

    // -------------------------------------------------------------------------
    // TEST 4: Idempotence & Duplicate Request Prevention
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 4: Duplicate Request Prevention ---');
    prep1.completedSubtopics.push({ subtopicId: 'pf-variables-constants', completedAt: new Date() });
    await prep1.save(); // pre-save hook deduplicates by subtopicId
    assert(prep1.completedSubtopics.length === 2, 'Duplicate completion record successfully deduplicated');
    assert(prep1.overallProgress === expectedProg2, 'Progress remains strictly accurate without inflation');

    // -------------------------------------------------------------------------
    // TEST 5: Uncompleting Subtopics
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 5: Uncompleting Subtopics ---');
    prep1.completedSubtopics = prep1.completedSubtopics.filter(
      (item) => item.subtopicId !== 'pf-data-types'
    );
    await prep1.save();
    assert(prep1.completedSubtopics.length === 1, 'Completed count correctly decreased to 1');
    assert(prep1.overallProgress === expectedProg1, `Overall progress recalculated to: ${prep1.overallProgress}%`);

    // -------------------------------------------------------------------------
    // TEST 6: Student Isolation (Account A vs Account B)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 6: Multi-Student Account Isolation ---');
    const student2Email = `student_prep_test2_${Date.now()}@test.com`;
    const student2 = await User.create({
      name: 'Test Student Beta',
      email: student2Email,
      password: 'hashed_password_sample',
      role: 'student',
      college: 'MLR Institute of Technology',
      branch: 'Information Technology',
    });

    const prep2 = await Preparation.create({
      user: student2._id,
      completedSubtopics: [],
      overallProgress: 0,
    });

    // Verify Student 2 has 0% while Student 1 has progress
    assert(prep2.overallProgress === 0, 'Student 2 initial progress is 0%');
    assert(prep2.completedSubtopics.length === 0, 'Student 2 has 0 completed subtopics');

    // Student 2 completes a completely different subtopic: 'dbms-er-diagrams'
    prep2.completedSubtopics.push({ subtopicId: 'dbms-er-diagrams', completedAt: new Date() });
    await prep2.save();

    // Reload Student 1 from MongoDB
    const reloadedPrep1 = await Preparation.findById(prep1._id);
    assert(reloadedPrep1.completedSubtopics.length === 1, 'Student 1 completions unchanged');
    assert(
      !reloadedPrep1.completedSubtopics.some((item) => item.subtopicId === 'dbms-er-diagrams'),
      'Student 1 does NOT contain Student 2 subtopics'
    );
    assert(reloadedPrep1.overallProgress === expectedProg1, 'Student 1 overall percentage unaffected by Student 2');

    // -------------------------------------------------------------------------
    // TEST 7: Prerequisite-Aware Next Recommended Topic
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 7: Prerequisite-Aware Next Recommendation ---');
    // If Student has completed 'pf-variables-constants', next recommended should be 'pf-data-types'
    const nextRec = getNextRecommendedTopic(['pf-variables-constants']);
    assert(nextRec !== null, 'Next recommended topic identified');
    assert(
      nextRec.subtopicId === 'pf-data-types',
      `Next recommended is ${nextRec.subtopicName} (requires variables & constants)`
    );

    // -------------------------------------------------------------------------
    // TEST 8: Invalid Subtopic Handling & Safe Division
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 8: Invalid ID Validation & Safe Division ---');
    assert(!SUBTOPIC_MAP.has('non-existent-subtopic-id'), 'Invalid subtopic ID rejected by validation map');

    const zeroDivisionCalc = calculateSyllabusProgress([]);
    assert(zeroDivisionCalc.overallProgress === 0, 'Safe zero division returns 0%');
    assert(zeroDivisionCalc.completedCount === 0, 'Zero completed subtopics');
    assert(zeroDivisionCalc.remainingCount === TOTAL_SUBTOPICS_COUNT, 'All subtopics remaining');

    // Clean up test documents
    await User.deleteMany({ _id: { $in: [student1._id, student2._id] } });
    await Preparation.deleteMany({ _id: { $in: [prep1._id, prep2._id] } });
    console.log('🧹 Test fixtures cleaned up.');
  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    await mongoose.connection.close();
    console.log('\n================================================================');
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
