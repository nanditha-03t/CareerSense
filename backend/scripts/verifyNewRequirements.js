import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import { generateToken } from '../utils/jwtUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const PORT = process.env.PORT || 5001;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, extraInfo = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${extraInfo}`);
    failedCount++;
  }
}

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`🧪 VERIFYING PORTALS, ACCOUNT SWITCHING & STATUS RESTRICTIONS`);
  console.log(`📡 Target API: ${BASE_URL}`);
  console.log(`======================================================\n`);

  await connectDB();

  // 1. Prepare test users with hashed passwords
  const studentPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('adminpassword123', 10);

  let student1 = await User.findOne({ email: 'portal_student1@example.com' });
  if (!student1) {
    student1 = await User.create({
      name: 'Rohan Sharma',
      email: 'portal_student1@example.com',
      password: studentPasswordHash,
      college: 'MLR Institute of Technology',
      branch: 'Computer Science',
      role: 'student',
    });
  } else {
    student1.role = 'student';
    student1.password = studentPasswordHash;
    await student1.save();
  }

  let student2 = await User.findOne({ email: 'portal_student2@example.com' });
  if (!student2) {
    student2 = await User.create({
      name: 'Priya Patel',
      email: 'portal_student2@example.com',
      password: studentPasswordHash,
      college: 'MLR Institute of Technology',
      branch: 'Information Technology',
      role: 'student',
    });
  } else {
    student2.role = 'student';
    student2.password = studentPasswordHash;
    await student2.save();
  }

  let adminUser = await User.findOne({ email: 'portal_admin@example.com' });
  if (!adminUser) {
    adminUser = await User.create({
      name: 'Dr. Placement Officer',
      email: 'portal_admin@example.com',
      password: adminPasswordHash,
      college: 'MLR Institute of Technology',
      branch: 'TPO',
      role: 'admin',
    });
  } else {
    adminUser.role = 'admin';
    adminUser.password = adminPasswordHash;
    await adminUser.save();
  }

  // -------------------------------------------------------------
  // TEST GROUP 1: SEPARATE LOGIN PORTALS & ROLE SEPARATION
  // -------------------------------------------------------------
  console.log(`--- TEST GROUP 1: Separate Student & Admin Login Portals ---`);

  // 1.1 Student logs in via Student Portal (portal: 'student') -> Should succeed
  const studentLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'portal_student1@example.com',
      password: 'password123',
      portal: 'student',
    }),
  });
  const studentLoginData = await studentLoginRes.json();
  assert(
    studentLoginRes.status === 200 && studentLoginData.data?.user?.role === 'student',
    'Student can log in through /student/login (200 OK)'
  );

  // 1.2 Admin logs in via Admin Portal (portal: 'admin') -> Should succeed
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'portal_admin@example.com',
      password: 'adminpassword123',
      portal: 'admin',
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  assert(
    adminLoginRes.status === 200 && adminLoginData.data?.user?.role === 'admin',
    'Admin can log in through /admin/login (200 OK)'
  );

  // 1.3 Admin attempts to log in via Student Portal (portal: 'student') -> Must be REJECTED (403 Forbidden)
  const adminInStudentPortalRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'portal_admin@example.com',
      password: 'adminpassword123',
      portal: 'student',
    }),
  });
  const adminInStudentPortalData = await adminInStudentPortalRes.json();
  assert(
    adminInStudentPortalRes.status === 403 &&
      adminInStudentPortalData.message?.includes('Admin Login portal'),
    'Admin login through student portal is rejected (403 Forbidden with redirect note)'
  );

  // 1.4 Student attempts to log in via Admin Portal (portal: 'admin') -> Must be REJECTED (403 Forbidden)
  const studentInAdminPortalRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'portal_student1@example.com',
      password: 'password123',
      portal: 'admin',
    }),
  });
  const studentInAdminPortalData = await studentInAdminPortalRes.json();
  assert(
    studentInAdminPortalRes.status === 403 &&
      studentInAdminPortalData.message?.includes('administrators only'),
    'Student login through admin portal is rejected (403 Forbidden with clear denial)'
  );

  // 1.5 Unauthenticated access to protected dashboard
  const unauthRes = await fetch(`${BASE_URL}/admin/dashboard`);
  assert(
    unauthRes.status === 401,
    'Unauthenticated users cannot access protected dashboards (401 Unauthorized)'
  );

  // 1.6 Student token attempting access to admin API directly
  const studentToken = studentLoginData.data?.token || generateToken(student1._id);
  const studentToAdminApiRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(
    studentToAdminApiRes.status === 403,
    'Students cannot access admin APIs by entering URLs manually (403 Forbidden)'
  );

  // -------------------------------------------------------------
  // TEST GROUP 2: APPLICATION STATUS PERMISSION & AUTHORIZATION
  // -------------------------------------------------------------
  console.log(`\n--- TEST GROUP 2: Application Status Restrictions ---`);

  // 2.1 Student creates new application -> Status MUST default to 'Interested'
  const newAppRes = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      company: 'TCS Placement Drive',
      role: 'Graduate Software Engineer',
      status: 'Selected', // Student attempts to self-assign 'Selected'
      driveType: 'On-Campus Drive',
      notes: 'Initial test note',
    }),
  });
  const newAppData = await newAppRes.json();
  assert(newAppRes.status === 201, 'Student can create application tracking record (201 Created)');
  assert(
    newAppData.data?.status === 'Interested',
    'Student application status strictly defaults to "Interested" (prevents self-assignment of "Selected")'
  );

  const testAppId = newAppData.data?._id;

  // 2.2 Student reads their application status
  const getAppRes = await fetch(`${BASE_URL}/applications`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const getAppData = await getAppRes.json();
  const foundApp = getAppData.data?.find((a) => a._id === testAppId);
  assert(
    foundApp && foundApp.status === 'Interested',
    'Student can view their application and its current status'
  );

  // 2.3 Student attempts to modify status directly via API (PUT /api/applications/:id) -> Must return 403 Forbidden
  const studentTamperStatusRes = await fetch(`${BASE_URL}/applications/${testAppId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'Shortlisted', // Unauthorized status tamper
    }),
  });
  const studentTamperStatusData = await studentTamperStatusRes.json();
  assert(
    studentTamperStatusRes.status === 403 &&
      studentTamperStatusData.message?.includes('Students cannot modify application status'),
    'Student cannot change status using direct API request (403 Forbidden)'
  );

  // Verify status in MongoDB was NOT changed
  const checkMongoApp = await Application.findById(testAppId);
  assert(
    checkMongoApp.status === 'Interested',
    'Application status remains unchanged in MongoDB after student tamper attempt'
  );

  // 2.4 Admin updates application status via PATCH /api/admin/applications/:id/status
  const adminToken = adminLoginData.data?.token || generateToken(adminUser._id);
  const adminStatusUpdateRes = await fetch(
    `${BASE_URL}/admin/applications/${testAppId}/status`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'Shortlisted',
        notes: 'Verified by Placement Cell: Cleared Coding Assessment Round 1',
      }),
    }
  );
  const adminStatusUpdateData = await adminStatusUpdateRes.json();
  assert(
    adminStatusUpdateRes.status === 200 && adminStatusUpdateData.data?.status === 'Shortlisted',
    'Admin can update application status to "Shortlisted" (200 OK)'
  );

  // 2.5 Verify persistence in MongoDB
  const verifiedMongoApp = await Application.findById(testAppId);
  assert(
    verifiedMongoApp.status === 'Shortlisted',
    'Updated status correctly persists in MongoDB database'
  );

  // 2.6 Student fetches application again and sees updated status
  const studentRefetchedRes = await fetch(`${BASE_URL}/applications`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const studentRefetchedData = await studentRefetchedRes.json();
  const updatedStudentApp = studentRefetchedData.data?.find((a) => a._id === testAppId);
  assert(
    updatedStudentApp && updatedStudentApp.status === 'Shortlisted',
    'Student sees the administrator-updated status after refreshing applications'
  );

  // 2.7 Second student cannot view or modify first student's application
  const student2Token = generateToken(student2._id);
  const student2TamperRes = await fetch(`${BASE_URL}/applications/${testAppId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${student2Token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notes: 'Hacked by student 2' }),
  });
  assert(
    student2TamperRes.status === 403,
    'One student cannot modify another student\'s applications (403 Forbidden)'
  );

  const student2GetRes = await fetch(`${BASE_URL}/applications`, {
    headers: { Authorization: `Bearer ${student2Token}` },
  });
  const student2GetData = await student2GetRes.json();
  const crossViewApp = student2GetData.data?.find((a) => a._id === testAppId);
  assert(
    !crossViewApp,
    'One student cannot view another student\'s applications'
  );

  // 2.8 Admin promotes status to Interview, Selected
  const adminSelectRes = await fetch(
    `${BASE_URL}/admin/applications/${testAppId}/status`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'Selected',
        notes: 'Final Offer Letter Issued: 8.5 LPA',
      }),
    }
  );
  const adminSelectData = await adminSelectRes.json();
  assert(
    adminSelectRes.status === 200 && adminSelectData.data?.status === 'Selected',
    'Admin can advance status to "Selected" with placement cell notes'
  );

  // Clean up test app
  await Application.findByIdAndDelete(testAppId);

  // -------------------------------------------------------------
  // TEST GROUP 3: ACCOUNT SWITCHING & SESSION RESETS
  // -------------------------------------------------------------
  console.log(`\n--- TEST GROUP 3: Account Switching & Session Resets ---`);

  // Verify getMe reflects the correct user for each token
  const meStudent1 = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const meStudent1Data = await meStudent1.json();
  assert(
    meStudent1Data.data?.user?.email === 'portal_student1@example.com' &&
      meStudent1Data.data?.user?.role === 'student',
    'Session 1 accurately identifies Student 1 (Rohan Sharma)'
  );

  const meStudent2 = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${student2Token}` },
  });
  const meStudent2Data = await meStudent2.json();
  assert(
    meStudent2Data.data?.user?.email === 'portal_student2@example.com' &&
      meStudent2Data.data?.user?.name === 'Priya Patel',
    'Session 2 accurately identifies Student 2 (Priya Patel, no state bleed)'
  );

  const meAdmin = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const meAdminData = await meAdmin.json();
  assert(
    meAdminData.data?.user?.email === 'portal_admin@example.com' &&
      meAdminData.data?.user?.role === 'admin',
    'Session 3 accurately identifies Administrator (Dr. Placement Officer)'
  );

  console.log(`\n======================================================`);
  console.log(`📊 TEST SUITE RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log(`======================================================\n`);

  process.exit(failedCount > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
