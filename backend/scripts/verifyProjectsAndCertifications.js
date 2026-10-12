import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Certification from '../models/Certification.js';
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

// Helper to create a valid minimal PDF buffer
function createSamplePdfBuffer(title = 'Sample Certificate') {
  return Buffer.from(
    `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 100 700 Td (${title}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000201 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n294\n%%EOF`
  );
}

// Helper to create multipart form-data payload in Node.js
function buildMultipartFormData(fields = {}, file = null) {
  const boundary = `----CareerSenseFormBoundary${Date.now()}`;
  const buffers = [];

  for (const [key, val] of Object.entries(fields)) {
    buffers.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${val}\r\n`
      )
    );
  }

  if (file) {
    buffers.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${file.fieldname}"; filename="${file.filename}"\r\nContent-Type: ${file.contentType}\r\n\r\n`
      )
    );
    buffers.push(file.content);
    buffers.push(Buffer.from('\r\n'));
  }

  buffers.push(Buffer.from(`--${boundary}--\r\n`));

  return {
    contentType: `multipart/form-data; boundary=${boundary}`,
    body: Buffer.concat(buffers),
  };
}

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`🧪 TESTING PROJECTS GITHUB LINKS & CERTIFICATIONS PDF UPLOADS`);
  console.log(`📡 Target API: ${BASE_URL}`);
  console.log(`======================================================\n`);

  await connectDB();

  // 1. Setup Student 1 and Student 2 accounts for ownership & isolation testing
  let student1 = await User.findOne({ email: 'student_pc_test1@example.com' });
  if (!student1) {
    student1 = await User.create({
      name: 'Nanditha ProjectTester',
      email: 'student_pc_test1@example.com',
      password: 'hashed_password_test',
      college: 'MLR Institute of Technology',
      branch: 'Computer Science and Engineering',
      role: 'student',
    });
  }

  let student2 = await User.findOne({ email: 'student_pc_test2@example.com' });
  if (!student2) {
    student2 = await User.create({
      name: 'Aditya RivalTester',
      email: 'student_pc_test2@example.com',
      password: 'hashed_password_test',
      college: 'VNR VJIET',
      branch: 'Information Technology',
      role: 'student',
    });
  }

  const token1 = generateToken(student1._id);
  const token2 = generateToken(student2._id);

  // Clean up any previous test projects and certifications for these 2 test students
  await Project.deleteMany({ user: { $in: [student1._id, student2._id] } });
  const oldCerts = await Certification.find({ user: { $in: [student1._id, student2._id] } });
  for (const oc of oldCerts) {
    if (oc.certificateStorageKey) {
      const p = path.join(process.cwd(), 'uploads', 'certifications', oc.certificateStorageKey);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
  }
  await Certification.deleteMany({ user: { $in: [student1._id, student2._id] } });

  // --------------------------------------------------------------------------
  // SECTION 1: PROJECTS & GITHUB URL VALIDATION TESTS
  // --------------------------------------------------------------------------
  console.log(`--- SECTION 1: Projects & GitHub Repository Links ---`);

  // 1.1 Add project with valid GitHub URL
  const validProjectPayload = {
    title: 'Cloud Distributed Cache Engine',
    description: 'High-performance Redis-compatible distributed cache built in Go with Raft consensus.',
    technologies: ['Go', 'Raft', 'Docker', 'Distributed Systems'],
    githubUrl: 'https://github.com/nanditha/distributed-cache',
    liveDemoUrl: 'https://cache.example.com',
    status: 'Completed',
    startDate: 'Jan 2026',
    endDate: 'May 2026',
    domain: 'Cloud & Systems Engineering',
  };

  const addProjRes = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validProjectPayload),
  });

  const addProjData = await addProjRes.json();
  assert(addProjRes.status === 201 && addProjData.success, 'Add project with valid GitHub URL succeeds (201 Created)');
  assert(
    addProjData.data.githubUrl === 'https://github.com/nanditha/distributed-cache',
    'Saves correct GitHub URL in MongoDB record'
  );
  assert(
    addProjData.data.liveDemoUrl === 'https://cache.example.com',
    'Keeps Live Demo URL separate from GitHub URL'
  );

  const createdProjectId = addProjData.data._id;

  // 1.2 Reject invalid GitHub URLs
  const invalidUrls = [
    'http://github.com/nanditha/repo', // Insecure HTTP
    'https://gitlab.com/nanditha/repo', // Non-GitHub domain
    'https://github.com/', // Missing owner & repo
    'https://github.com/nanditha', // Missing repo
    'not-a-valid-url', // Plain text
    'javascript:alert(1)', // XSS payload
  ];

  for (const badUrl of invalidUrls) {
    const badProjRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token1}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Project with Bad URL',
        description: 'Should fail validation',
        technologies: ['Python'],
        githubUrl: badUrl,
      }),
    });
    const badProjData = await badProjRes.json();
    assert(
      badProjRes.status === 400 && !badProjData.success,
      `Rejects invalid GitHub URL "${badUrl}" with 400 Bad Request`
    );
  }

  // 1.3 Edit and save a GitHub URL
  const editProjRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token1}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      githubUrl: 'https://github.com/nanditha/distributed-cache-v2',
      status: 'In Progress',
    }),
  });
  const editProjData = await editProjRes.json();
  assert(editProjRes.status === 200 && editProjData.success, 'Student can edit project GitHub URL later (200 OK)');
  assert(
    editProjData.data.githubUrl === 'https://github.com/nanditha/distributed-cache-v2',
    'Updated GitHub URL persisted in MongoDB'
  );

  // 1.4 Save a project without a GitHub URL (clean fallback)
  const noGithubProjRes = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Coursework Microcontroller Lab',
      description: 'Embedded 8051 assembly code for stepper motor control.',
      technologies: ['Assembly', '8051', 'Hardware'],
      githubUrl: '',
      domain: 'IoT & Embedded Systems',
    }),
  });
  const noGithubData = await noGithubProjRes.json();
  assert(
    noGithubProjRes.status === 201 && noGithubData.data.githubUrl === '',
    'Saves project without GitHub URL cleanly without errors'
  );

  // 1.5 Student 2 cannot edit or delete Student 1's project (Ownership Security)
  const rivalEditRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token2}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: 'Hacked Title' }),
  });
  assert(rivalEditRes.status === 403, 'Student 2 cannot edit Student 1 project (403 Forbidden)');

  const rivalDeleteRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token2}` },
  });
  assert(rivalDeleteRes.status === 403, 'Student 2 cannot delete Student 1 project (403 Forbidden)');

  // 1.6 Student 1 can delete their own project
  const ownerDeleteRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token1}` },
  });
  assert(ownerDeleteRes.status === 200, 'Student 1 can delete their own project (200 OK)');

  // --------------------------------------------------------------------------
  // SECTION 2: CERTIFICATIONS & PDF UPLOADS & FILE STORAGE TESTS
  // --------------------------------------------------------------------------
  console.log(`\n--- SECTION 2: Certifications, PDF Uploads & File Storage ---`);

  // 2.1 Upload a valid PDF certification
  const pdfBuffer = createSamplePdfBuffer('AWS Certified Developer Associate');
  const multipartUpload = buildMultipartFormData(
    {
      title: 'AWS Certified Developer Associate',
      issuer: 'Amazon Web Services',
      issueDate: 'Sep 2026',
      credentialId: 'AWS-DEV-784912',
      verificationUrl: 'https://aws.amazon.com/verification/AWS-DEV-784912',
      grade: 'Score: 880/1000',
      skills: JSON.stringify(['AWS Lambda', 'DynamoDB', 'API Gateway', 'S3']),
    },
    {
      fieldname: 'certificate',
      filename: 'aws-certified-developer.pdf',
      contentType: 'application/pdf',
      content: pdfBuffer,
    }
  );

  const createCertRes = await fetch(`${BASE_URL}/certifications`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      'Content-Type': multipartUpload.contentType,
    },
    body: multipartUpload.body,
  });

  const createCertData = await createCertRes.json();
  assert(createCertRes.status === 201 && createCertData.success, 'Upload valid PDF certification (201 Created)');
  assert(
    createCertData.data.certificateFileName === 'aws-certified-developer.pdf',
    'Stores original certificate filename in MongoDB'
  );
  assert(
    Boolean(createCertData.data.certificateStorageKey) &&
      createCertData.data.certificateStorageKey.startsWith('cert-'),
    'Generates safe internal storage key rather than user-supplied filename'
  );
  assert(
    createCertData.data.certificateFileSize > 0,
    'Records accurate certificate file size'
  );

  const certId = createCertData.data._id;
  const storageKey = createCertData.data.certificateStorageKey;

  // Verify file exists on disk in private uploads folder
  const CERT_DIR = path.resolve(__dirname, '../uploads/certifications');
  const diskPath = path.join(CERT_DIR, storageKey);
  assert(fs.existsSync(diskPath), 'Physical PDF file exists in private uploads/certifications directory');

  // 2.2 Reject non-PDF files (e.g. text or image)
  const fakePdfBuffer = Buffer.from('Plain text content that is not a PDF');
  const fakeMultipart = buildMultipartFormData(
    {
      title: 'Fake Certificate',
      issuer: 'Fake Issuer',
      issueDate: 'Oct 2026',
    },
    {
      fieldname: 'certificate',
      filename: 'disguised.pdf',
      contentType: 'application/pdf',
      content: fakePdfBuffer,
    }
  );

  const fakeCertRes = await fetch(`${BASE_URL}/certifications`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      'Content-Type': fakeMultipart.contentType,
    },
    body: fakeMultipart.body,
  });
  const fakeCertData = await fakeCertRes.json();
  assert(
    fakeCertRes.status === 400 && !fakeCertData.success,
    'Rejects disguised non-PDF file using magic byte signature validation (400 Bad Request)'
  );

  // 2.3 Reject files exceeding size limit (> 5 MB)
  const oversizedBuffer = Buffer.alloc(5.2 * 1024 * 1024, '%PDF-oversized-content');
  const oversizedMultipart = buildMultipartFormData(
    {
      title: 'Oversized Certificate',
      issuer: 'Huge Issuer',
      issueDate: 'Oct 2026',
    },
    {
      fieldname: 'certificate',
      filename: 'huge-cert.pdf',
      contentType: 'application/pdf',
      content: oversizedBuffer,
    }
  );

  const oversizedRes = await fetch(`${BASE_URL}/certifications`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      'Content-Type': oversizedMultipart.contentType,
    },
    body: oversizedMultipart.body,
  });
  const oversizedData = await oversizedRes.json();
  assert(
    oversizedRes.status === 400 && !oversizedData.success,
    'Rejects file exceeding 5MB upload size limit (400 Bad Request)'
  );

  // 2.4 View PDF inline (GET /api/certifications/:id/view)
  const viewRes = await fetch(`${BASE_URL}/certifications/${certId}/view`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  assert(viewRes.status === 200, 'Student 1 can view uploaded certificate PDF inline (200 OK)');
  assert(
    viewRes.headers.get('content-type') === 'application/pdf',
    'Returns correct Content-Type: application/pdf header'
  );
  assert(
    viewRes.headers.get('content-disposition')?.includes('inline'),
    'Sets Content-Disposition: inline header for browser tab viewing'
  );
  const viewBytes = await viewRes.arrayBuffer();
  assert(viewBytes.byteLength > 0, 'Streams genuine PDF bytes to client');

  // 2.5 Download PDF (GET /api/certifications/:id/download)
  const downloadRes = await fetch(`${BASE_URL}/certifications/${certId}/download`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  assert(downloadRes.status === 200, 'Student 1 can download certificate PDF (200 OK)');
  assert(
    downloadRes.headers.get('content-disposition')?.includes('attachment'),
    'Sets Content-Disposition: attachment header for safe download'
  );

  // 2.6 Persistence across requests / refresh / relogin
  const refreshedToken = generateToken(student1._id);
  const getCertsRes = await fetch(`${BASE_URL}/certifications`, {
    headers: { Authorization: `Bearer ${refreshedToken}` },
  });
  const getCertsData = await getCertsRes.json();
  assert(getCertsRes.status === 200, 'Fetch certifications after session refresh (200 OK)');
  const foundCert = getCertsData.data.find((c) => c._id === certId);
  assert(
    foundCert && foundCert.certificateFileName === 'aws-certified-developer.pdf',
    'Certification metadata and PDF reference persist cleanly in database'
  );

  // 2.7 Cross-account protection: Student 2 cannot access Student 1's PDF or cert
  const rivalViewRes = await fetch(`${BASE_URL}/certifications/${certId}/view`, {
    headers: { Authorization: `Bearer ${token2}` },
  });
  assert(rivalViewRes.status === 403, 'Student 2 cannot view Student 1 private certificate PDF (403 Forbidden)');

  const rivalDownloadRes = await fetch(`${BASE_URL}/certifications/${certId}/download`, {
    headers: { Authorization: `Bearer ${token2}` },
  });
  assert(rivalDownloadRes.status === 403, 'Student 2 cannot download Student 1 private certificate PDF (403 Forbidden)');

  const rivalDeleteCertRes = await fetch(`${BASE_URL}/certifications/${certId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token2}` },
  });
  assert(rivalDeleteCertRes.status === 403, 'Student 2 cannot delete Student 1 certification (403 Forbidden)');

  // 2.8 Replace certificate PDF
  const replacementPdf = createSamplePdfBuffer('Updated AWS Certified Solutions Architect');
  const replaceMultipart = buildMultipartFormData(
    {},
    {
      fieldname: 'certificate',
      filename: 'aws-updated-cert.pdf',
      contentType: 'application/pdf',
      content: replacementPdf,
    }
  );

  const replaceRes = await fetch(`${BASE_URL}/certifications/${certId}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token1}`,
      'Content-Type': replaceMultipart.contentType,
    },
    body: replaceMultipart.body,
  });
  const replaceData = await replaceRes.json();
  assert(replaceRes.status === 200 && replaceData.success, 'Student can replace certificate PDF (200 OK)');
  assert(
    replaceData.data.certificateFileName === 'aws-updated-cert.pdf',
    'Updated certificate filename stored in DB'
  );
  const newStorageKey = replaceData.data.certificateStorageKey;
  assert(newStorageKey !== storageKey, 'New unique storage key generated for replacement file');
  assert(!fs.existsSync(diskPath), 'Old certificate file cleanly unlinked from disk upon replacement');
  const newDiskPath = path.join(CERT_DIR, newStorageKey);
  assert(fs.existsSync(newDiskPath), 'New certificate file exists on disk');

  // 2.9 Delete certificate PDF file only
  const deleteFileRes = await fetch(`${BASE_URL}/certifications/${certId}/file`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token1}` },
  });
  const deleteFileData = await deleteFileRes.json();
  assert(deleteFileRes.status === 200, 'Student can delete attached PDF only without deleting cert record (200 OK)');
  assert(deleteFileData.data.certificateFileName === '', 'PDF metadata cleared in DB');
  assert(!fs.existsSync(newDiskPath), 'PDF file cleanly removed from disk');

  // 2.10 Delete entire certification record
  const deleteCertRes = await fetch(`${BASE_URL}/certifications/${certId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token1}` },
  });
  assert(deleteCertRes.status === 200, 'Student can delete entire certification (200 OK)');
  const verifyDeleted = await Certification.findById(certId);
  assert(!verifyDeleted, 'Certification permanently removed from MongoDB');

  // Summary
  console.log(`\n======================================================`);
  console.log(`📊 TEST SUITE RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log(`======================================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
