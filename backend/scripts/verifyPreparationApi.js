import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Preparation from '../models/Preparation.js';
import { generateToken } from '../utils/jwtUtils.js';

import preparationRoutes from '../routes/preparationRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import { notFound, errorHandler } from '../middleware/errorMiddleware.js';
import { TOTAL_SUBTOPICS_COUNT } from '../data/preparationSyllabus.js';

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

async function runApiTests() {
  console.log('\n================================================================');
  console.log('🌐 RUNNING HTTP API INTEGRATION TESTS FOR PREPARATION ENDPOINTS');
  console.log('================================================================\n');

  await connectDB();

  // Create isolated express app for testing
  const testApp = express();
  testApp.use(cors());
  testApp.use(express.json());
  testApp.use('/api/auth', authRoutes);
  testApp.use('/api/preparation', preparationRoutes);
  testApp.use(notFound);
  testApp.use(errorHandler);

  // Start on ephemeral port
  const server = await new Promise((resolve) => {
    const s = testApp.listen(0, '127.0.0.1', () => resolve(s));
  });

  const { port } = server.address();
  const BASE_URL = `http://127.0.0.1:${port}/api`;
  console.log(`📡 Ephemeral Test Server running at: ${BASE_URL}\n`);

  let student1, student2;

  try {
    // 1. Create Test Students and JWT Tokens
    const student1Email = `api_student1_${Date.now()}@test.com`;
    student1 = await User.create({
      name: 'API Student Alpha',
      email: student1Email,
      password: 'hashed_password_123',
      role: 'student',
      college: 'MLR Institute of Technology',
      branch: 'Computer Science and Engineering',
    });
    const token1 = generateToken(student1._id);

    const student2Email = `api_student2_${Date.now()}@test.com`;
    student2 = await User.create({
      name: 'API Student Beta',
      email: student2Email,
      password: 'hashed_password_456',
      role: 'student',
      college: 'MLR Institute of Technology',
      branch: 'Information Technology',
    });
    const token2 = generateToken(student2._id);

    // -------------------------------------------------------------------------
    // TEST 1: Unauthenticated request rejection
    // -------------------------------------------------------------------------
    console.log('--- TEST 1: Authentication Requirement ---');
    const unauthRes = await fetch(`${BASE_URL}/preparation`);
    assert(unauthRes.status === 401, 'Unauthenticated request correctly rejected with 401 Unauthorized');

    // -------------------------------------------------------------------------
    // TEST 2: GET /api/preparation for newly registered student
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 2: Initial Preparation State ---');
    const getRes1 = await fetch(`${BASE_URL}/preparation`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    assert(getRes1.status === 200, 'GET /api/preparation returns 200 OK');
    const getData1 = await getRes1.json();
    assert(getData1.success === true, 'Response reports success: true');
    assert(getData1.data.overallProgress === 0, 'New student overall progress is 0%');
    assert(getData1.data.completedCount === 0, 'Completed count is 0');
    assert(getData1.data.totalSubtopics === TOTAL_SUBTOPICS_COUNT, `Total subtopics in syllabus is ${TOTAL_SUBTOPICS_COUNT}`);
    assert(Array.isArray(getData1.data.syllabus) && getData1.data.syllabus.length === 16, 'Returns full 16 core subjects');

    // -------------------------------------------------------------------------
    // TEST 3: POST /api/preparation/complete (Mark subtopic complete)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 3: Mark Subtopic Complete ---');
    const completeRes = await fetch(`${BASE_URL}/preparation/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({ subtopicId: 'pf-variables-constants' }),
    });
    assert(completeRes.status === 200, 'POST /api/preparation/complete returns 200 OK');
    const completeData = await completeRes.json();
    assert(completeData.success === true, 'Success flag is true');
    assert(completeData.data.completedCount === 1, 'Completed count incremented to 1');
    assert(typeof completeData.data.overallProgress === 'number', 'Overall progress is a valid number');
    assert(completeData.data.completedSubtopicIds.includes('pf-variables-constants'), 'Completed list includes pf-variables-constants');

    // -------------------------------------------------------------------------
    // TEST 4: Duplicate Completion Prevention (Idempotence)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 4: Idempotent Completion Handling ---');
    const dupRes = await fetch(`${BASE_URL}/preparation/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({ subtopicId: 'pf-variables-constants' }),
    });
    assert(dupRes.status === 200, 'Duplicate request returns 200 OK');
    const dupData = await dupRes.json();
    assert(dupData.data.completedCount === 1, 'Completed count NOT inflated on duplicate request (remains 1)');

    // -------------------------------------------------------------------------
    // TEST 5: Invalid Subtopic ID Validation
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 5: Invalid Subtopic Validation ---');
    const invalidRes = await fetch(`${BASE_URL}/preparation/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({ subtopicId: 'fake-nonexistent-subtopic' }),
    });
    assert(invalidRes.status === 400, 'Invalid subtopic ID rejected with 400 Bad Request');
    const invalidData = await invalidRes.json();
    assert(invalidData.success === false, 'Returns success: false on invalid ID');

    // -------------------------------------------------------------------------
    // TEST 6: Student Isolation (Student 2 vs Student 1)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 6: Multi-Student Isolation via HTTP ---');
    const student2Res = await fetch(`${BASE_URL}/preparation`, {
      headers: { Authorization: `Bearer ${token2}` },
    });
    const student2Data = await student2Res.json();
    assert(student2Data.data.completedCount === 0, 'Student 2 has 0 completed subtopics');
    assert(student2Data.data.overallProgress === 0, 'Student 2 overall progress is 0%');

    // Student 2 completes DBMS subtopic
    await fetch(`${BASE_URL}/preparation/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token2}`,
      },
      body: JSON.stringify({ subtopicId: 'dbms-er-diagrams' }),
    });

    // Recheck Student 1
    const student1Recheck = await fetch(`${BASE_URL}/preparation`, {
      headers: { Authorization: `Bearer ${token1}` },
    });
    const s1Data = await student1Recheck.json();
    assert(s1Data.data.completedCount === 1, 'Student 1 completed count unchanged (1)');
    assert(!s1Data.data.completedSubtopicIds.includes('dbms-er-diagrams'), 'Student 1 does not contain Student 2 subtopics');

    // -------------------------------------------------------------------------
    // TEST 7: POST /api/preparation/uncomplete
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 7: Mark Subtopic Incomplete ---');
    const uncompleteRes = await fetch(`${BASE_URL}/preparation/uncomplete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({ subtopicId: 'pf-variables-constants' }),
    });
    assert(uncompleteRes.status === 200, 'POST /api/preparation/uncomplete returns 200 OK');
    const uncompleteData = await uncompleteRes.json();
    assert(uncompleteData.data.completedCount === 0, 'Completed count correctly returned to 0');
    assert(uncompleteData.data.overallProgress === 0, 'Overall progress recalculated to 0%');

    // -------------------------------------------------------------------------
    // TEST 8: GET /api/preparation/summary (Dashboard summary endpoint)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 8: Preparation Summary Endpoint ---');
    const summaryRes = await fetch(`${BASE_URL}/preparation/summary`, {
      headers: { Authorization: `Bearer ${token2}` },
    });
    assert(summaryRes.status === 200, 'GET /api/preparation/summary returns 200 OK');
    const summaryData = await summaryRes.json();
    assert(summaryData.success === true, 'Summary success: true');
    assert(typeof summaryData.data.overallProgress === 'number', 'Summary contains overallProgress number');
    assert(typeof summaryData.data.completedCount === 'number', 'Summary contains completedCount number');
    assert(typeof summaryData.data.remainingCount === 'number', 'Summary contains remainingCount number');
    assert(summaryData.data.totalSubtopics === TOTAL_SUBTOPICS_COUNT, `Summary total subtopics count is ${TOTAL_SUBTOPICS_COUNT}`);

  } catch (err) {
    console.error('API test error:', err);
    failed++;
  } finally {
    // Cleanup
    if (student1) {
      await User.deleteOne({ _id: student1._id });
      await Preparation.deleteOne({ user: student1._id });
    }
    if (student2) {
      await User.deleteOne({ _id: student2._id });
      await Preparation.deleteOne({ user: student2._id });
    }

    server.close();
    await mongoose.connection.close();

    console.log('\n================================================================');
    console.log(`📊 API TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  }
}

runApiTests();
