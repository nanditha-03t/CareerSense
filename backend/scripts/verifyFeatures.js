import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Profile from '../models/Profile.js';
import Application from '../models/Application.js';
import { generateToken } from '../utils/jwtUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5001;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedCount++;
  }
}

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`🧪 RUNNING CAREERSENSE COMPREHENSIVE VERIFICATION SUITE`);
  console.log(`📡 Testing against: ${BASE_URL}`);
  console.log(`======================================================\n`);

  await connectDB();

  // 1. Setup test student and test admin accounts
  let studentUser = await User.findOne({ email: 'student_test_verify@example.com' });
  if (!studentUser) {
    studentUser = await User.create({
      name: 'Test Student',
      email: 'student_test_verify@example.com',
      password: 'hashed_password_placeholder',
      college: 'MLR Institute of Technology',
      branch: 'Computer Science and Engineering',
      role: 'student',
    });
  } else {
    studentUser.role = 'student';
    await studentUser.save();
  }

  let adminUser = await User.findOne({ email: 'admin_test_verify@example.com' });
  if (!adminUser) {
    adminUser = await User.create({
      name: 'Test Administrator',
      email: 'admin_test_verify@example.com',
      password: 'hashed_password_placeholder',
      college: 'MLR Institute of Technology',
      branch: 'Placement Cell',
      role: 'admin',
    });
  } else {
    adminUser.role = 'admin';
    await adminUser.save();
  }

  const studentToken = generateToken(studentUser._id);
  const adminToken = generateToken(adminUser._id);

  // ---------------------------------------------------------
  // TEST GROUP 1: ADMIN SECURITY & ROLE ACCESS CONTROL
  // ---------------------------------------------------------
  console.log(`\n--- PART 1: Admin Security & Role-Based Access Control ---`);

  // 1.1 Unauthenticated request to /admin/dashboard
  const unauthRes = await fetch(`${BASE_URL}/admin/dashboard`);
  assert(unauthRes.status === 401, 'Unauthenticated access to /api/admin/dashboard returns 401');

  // 1.2 Student request to /admin/dashboard
  const studentAdminRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(studentAdminRes.status === 403, 'Student access to /api/admin/dashboard returns 403 Forbidden');

  // 1.3 Student request to /admin/jobs (POST)
  const studentCreateJobRes = await fetch(`${BASE_URL}/admin/jobs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: 'Malicious Job', company: 'Fake' }),
  });
  assert(studentCreateJobRes.status === 403, 'Student cannot create jobs via /api/admin/jobs (403 Forbidden)');

  // 1.4 Admin request to /admin/dashboard
  const adminDashRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminDashData = await adminDashRes.json();
  assert(adminDashRes.status === 200, 'Admin can access /api/admin/dashboard (200 OK)');
  assert(typeof adminDashData.data?.totalStudents === 'number', 'Dashboard returns real totalStudents count');
  assert(typeof adminDashData.data?.activeJobs === 'number', 'Dashboard returns real activeJobs count');
  assert(typeof adminDashData.data?.totalApplications === 'number', 'Dashboard returns real totalApplications count');
  assert(adminDashData.data?.applicationsByStatus !== undefined, 'Dashboard returns real applicationsByStatus aggregation');

  // 1.5 Admin student management API
  const adminStudentsRes = await fetch(`${BASE_URL}/admin/students?limit=5`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminStudentsData = await adminStudentsRes.json();
  assert(adminStudentsRes.status === 200, 'Admin can retrieve paginated students (/api/admin/students)');
  assert(Array.isArray(adminStudentsData.data), 'Returns array of student objects');
  assert(
    adminStudentsData.data.every((s) => !s.password),
    'Student records never expose passwords or password hashes'
  );

  // 1.6 Admin Job CRUD Operations
  const newJobPayload = {
    title: 'Automated Test SDE',
    company: 'CareerSense QA Labs',
    location: 'Hyderabad',
    employmentType: 'Full-Time',
    experienceLevel: 'Fresher',
    package: '8.0 LPA',
    applicationUrl: 'https://careers.careersense-test.com/apply/sde-1',
    source: 'TPO Direct Drive',
    requiredSkills: 'Node.js, React, MongoDB',
    isVerified: true,
    active: true,
  };

  const createJobRes = await fetch(`${BASE_URL}/admin/jobs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newJobPayload),
  });
  const createdJobData = await createJobRes.json();
  assert(createJobRes.status === 201, 'Admin can create new job drive (201 Created)');
  const createdJobId = createdJobData.data?._id;

  // Admin toggles job status
  const toggleRes = await fetch(`${BASE_URL}/admin/jobs/${createdJobId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ active: false }),
  });
  const toggleData = await toggleRes.json();
  assert(toggleRes.status === 200 && toggleData.data?.active === false, 'Admin can deactivate job listing (PATCH status)');

  // Admin deletes job
  const deleteJobRes = await fetch(`${BASE_URL}/admin/jobs/${createdJobId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(deleteJobRes.status === 200, 'Admin can delete job listing (DELETE /jobs/:id)');

  // ---------------------------------------------------------
  // TEST GROUP 2: RESUME UPLOAD, VIEW, DOWNLOAD, DELETE
  // ---------------------------------------------------------
  console.log(`\n--- PART 2: Resume Upload, View, Download, Replace, & Delete ---`);

  // Prepare test files
  const testDir = path.join(process.cwd(), 'temp_test_files');
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

  const validPdfPath = path.join(testDir, 'test_student_resume.pdf');
  fs.writeFileSync(validPdfPath, Buffer.from('%PDF-1.4 test resume content for verification suite'));

  const invalidFilePath = path.join(testDir, 'fake_resume.pdf');
  fs.writeFileSync(invalidFilePath, Buffer.from('NOT A PDF FILE - PLAIN TEXT'));

  // 2.1 Invalid file signature rejection
  const invalidForm = new FormData();
  invalidForm.append('resume', new Blob([fs.readFileSync(invalidFilePath)], { type: 'application/pdf' }), 'fake.pdf');

  const invalidUploadRes = await fetch(`${BASE_URL}/resume/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` },
    body: invalidForm,
  });
  assert(invalidUploadRes.status === 400, 'Rejects files with invalid magic byte signatures (400 Bad Request)');

  // 2.2 Valid PDF upload via multipart/form-data
  const validForm = new FormData();
  validForm.append('resume', new Blob([fs.readFileSync(validPdfPath)], { type: 'application/pdf' }), 'Nanditha_Resume.pdf');

  const validUploadRes = await fetch(`${BASE_URL}/resume/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` },
    body: validForm,
  });
  const validUploadData = await validUploadRes.json();
  assert(validUploadRes.status === 200, 'Student can upload valid PDF resume (/api/resume/upload 200 OK)');
  assert(validUploadData.data?.fileName === 'Nanditha_Resume.pdf', 'Saves original filename in metadata');

  // 2.3 Resume status endpoint
  const statusRes = await fetch(`${BASE_URL}/resume/status`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const statusData = await statusRes.json();
  assert(statusRes.status === 200 && statusData.data?.hasResume === true, 'Resume status reflects uploaded resume in MongoDB');

  // 2.4 Download resume endpoint
  const downloadRes = await fetch(`${BASE_URL}/resume/download`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(downloadRes.status === 200, 'Student can download their resume (/api/resume/download 200 OK)');
  assert(
    downloadRes.headers.get('content-disposition')?.includes('attachment'),
    'Sets Content-Disposition: attachment header'
  );
  assert(
    downloadRes.headers.get('content-type')?.includes('pdf'),
    'Returns correct Content-Type (application/pdf)'
  );
  const downloadedBytes = await downloadRes.arrayBuffer();
  assert(downloadedBytes.byteLength > 0, 'Returns actual file binary bytes');

  // 2.5 View resume endpoint (inline)
  const viewRes = await fetch(`${BASE_URL}/resume/view`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(viewRes.status === 200, 'Student can view their resume inline (/api/resume/view 200 OK)');
  assert(
    viewRes.headers.get('content-disposition')?.includes('inline'),
    'Sets Content-Disposition: inline header for browser preview'
  );

  // 2.6 Admin download of student resume
  const adminDownloadRes = await fetch(`${BASE_URL}/admin/resumes/${studentUser._id}/download`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(adminDownloadRes.status === 200, 'Admin can download student resume (/api/admin/resumes/:id/download)');

  // 2.7 Delete resume endpoint
  const deleteResumeRes = await fetch(`${BASE_URL}/resume`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(deleteResumeRes.status === 200, 'Student can delete their resume (DELETE /api/resume 200 OK)');

  // 2.8 Status after delete
  const statusAfterDeleteRes = await fetch(`${BASE_URL}/resume/status`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const statusAfterDeleteData = await statusAfterDeleteRes.json();
  assert(statusAfterDeleteData.data?.hasResume === false, 'Resume status reflects deleted state (hasResume: false)');

  // Clean test files
  try {
    fs.rmSync(testDir, { recursive: true, force: true });
  } catch {}

  // ---------------------------------------------------------
  // TEST GROUP 3: REAL JOB APPLICATIONS & TRACKING
  // ---------------------------------------------------------
  console.log(`\n--- PART 3: Real Job Listings & Application Tracking ---`);

  // 3.1 Verify verified campus jobs exist in database
  const jobsRes = await fetch(`${BASE_URL}/jobs`);
  const jobsData = await jobsRes.json();
  assert(jobsRes.status === 200 && Array.isArray(jobsData.data) && jobsData.data.length > 0, 'Public /api/jobs returns active job listings');
  
  const hasVerifiedJob = jobsData.data.some((j) => j.isVerified === true && j.applicationUrl?.startsWith('https://'));
  assert(hasVerifiedJob, 'Verified campus drives contain authentic HTTPS external application URLs');

  // 3.2 Add application with status 'Interested'
  const interestedAppPayload = {
    company: 'TCS',
    role: 'Ninja & Digital Software Engineer',
    status: 'Interested',
    driveType: 'Campus Hiring Drive',
    applicationUrl: 'https://nextstep.tcs.com/campus/#/',
    notes: 'Planning to submit application before Nov 05.',
  };

  const addAppRes = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(interestedAppPayload),
  });
  const addAppData = await addAppRes.json();
  assert(addAppRes.status === 201, 'Student can track job with status "Interested"');
  assert(addAppData.data?.status === 'Interested', 'Application status correctly saved as Interested');
  const appId = addAppData.data?._id;

  // 3.3 Student attempt to modify status directly via PUT /applications/:id must be rejected (403 Forbidden)
  const studentUpdateAppRes = await fetch(`${BASE_URL}/applications/${appId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${studentToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'Applied' }),
  });
  assert(
    studentUpdateAppRes.status === 403,
    'Student attempt to change status via direct API is rejected (403 Forbidden)'
  );

  // 3.4 Admin can update status to 'Applied' via /api/admin/applications/:id/status
  const adminUpdateAppRes = await fetch(`${BASE_URL}/admin/applications/${appId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'Applied', notes: 'Verified submission on TCS NextStep portal.' }),
  });
  const adminUpdateAppData = await adminUpdateAppRes.json();
  assert(
    adminUpdateAppRes.status === 200 && adminUpdateAppData.data?.status === 'Applied',
    'Admin can update application status to "Applied" (200 OK)'
  );

  // Clean up test records
  await Application.deleteMany({ user: studentUser._id });
  await User.deleteMany({ email: { $in: ['student_test_verify@example.com', 'admin_test_verify@example.com'] } });

  console.log(`\n======================================================`);
  console.log(`📊 TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log(`======================================================\n`);

  process.exit(failedCount > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
