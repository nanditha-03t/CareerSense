# CareerSense – Campus Placement & Skill Gap Analysis Platform

A full-stack placement intelligence and recruitment platform built for engineering students (B.Tech) and Training & Placement Officers (TPO/Admins) to manage campus placement drives, diagnose skill gaps with deterministic set mathematics, securely manage resumes, and track genuine job applications.

---

## 1. Project Overview

**CareerSense** bridges the gap between campus recruitment hiring standards (MNCs like TCS, Infosys, Accenture, Wipro, Amazon, Microsoft) and students' current competencies.

### Core Value Propositions:
- **Role-Based Portals:** Dedicated Student Dashboard and Admin / TPO Management Console with server-side authorization.
- **Deterministic Skill Gap Diagnostics:** Uses an explainable set-theory formula to calculate job fit percentage and identify matched vs. missing skills without hallucination or mock numbers.
- **Enterprise-Grade Resume Storage:** Real multipart/form-data upload with magic byte signature checks, private local disk storage, ownership verification, inline browser viewing, and secure downloads.
- **Genuine Job Vacancies & Live Feeds:** Pre-seeded authentic MNC campus drives with official application URLs alongside live tech job synchronization from verified developer feeds (Remotive API).
- **Application Tracking:** Realistic tracker tracking states (`Interested`, `Applied`, `Shortlisted`, `Interview`, `Selected`, `Rejected`) without fake employer submission claims.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 19 (SPA with React Router DOM v7)
- **Tooling:** Vite 8.3
- **Styling:** Tailwind CSS 3.4 (CareerSense collegiate light theme)
- **Icons:** Lucide React
- **API Communication:** Native `fetch` with JWT Authorization and dynamic `FormData` boundary handling
- **Linter & Code Quality:** Oxlint (0 errors, 0 warnings)

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 4.21
- **Database:** MongoDB 7.0+
- **ODM:** Mongoose 9.1
- **Authentication & Security:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, and server-side RBAC middleware (`requireAdmin`)
- **File Uploads:** `multer` with private disk storage and file signature verification
- **External Feeds:** Native fetch with caching and deduplication

---

## 3. Architecture & Data Flow

```text
React 19 Frontend (Vite on :5173)
       │
       ▼ (HTTP / REST + Bearer JWT Token)
Express.js Backend (Port 5001)
       │
       ├─► Middleware:
       │     ├─ protect (Token signature verification & user resolution)
       │     └─ requireAdmin (Server-side role authorization)
       │
       ├─► Student Endpoints:
       │     ├─ /api/auth               (Register, Login, Me)
       │     ├─ /api/profile            (Student Profile & Academic Record)
       │     ├─ /api/skills             (CRUD Student Skills)
       │     ├─ /api/jobs               (List Jobs with Computed Fit %)
       │     ├─ /api/skill-gap          (Campus Readiness & Recommendations)
       │     ├─ /api/applications       (Application Tracking Pipeline)
       │     ├─ /api/preparation        (Preparation Milestones & Checklists)
       │     ├─ /api/resume/upload      (Multipart Upload with Magic Bytes Check)
       │     ├─ /api/resume/status      (Check Resume Metadata)
       │     ├─ /api/resume/view        (Inline Browser PDF Preview)
       │     ├─ /api/resume/download    (Attachment Download)
       │     └─ /api/resume/delete      (Secure File & Metadata Removal)
       │
       ├─► Admin / TPO Endpoints:
       │     ├─ GET  /api/admin/dashboard          (Real MongoDB Metrics & Aggregations)
       │     ├─ GET  /api/admin/students           (Paginated Directory & Resume Indicators)
       │     ├─ GET  /api/admin/students/:id       (Detailed Student Profile & Skills)
       │     ├─ GET  /api/admin/jobs               (Manage Job Listings)
       │     ├─ POST /api/admin/jobs               (Create Verified / Campus Drives)
       │     ├─ PUT  /api/admin/jobs/:id           (Edit Drive Details)
       │     ├─ PATCH /api/admin/jobs/:id/status   (Toggle Active / Inactive)
       │     ├─ DELETE /api/admin/jobs/:id         (Remove Drive)
       │     ├─ GET  /api/admin/applications       (View Tracked Student Applications)
       │     └─ GET  /api/admin/resumes/:id/download (Audited Admin Resume Download)
       │
       ▼
MongoDB Database & Private Storage
       ├─ Users Collection (Includes role: 'student' | 'admin')
       ├─ Profiles Collection (Includes resume metadata & storage key)
       ├─ Jobs Collection (Verified drives, external URLs, source)
       ├─ Applications Collection (Placement tracking pipeline)
       └─ backend/uploads/resumes/ (Private disk storage, non-public)
```

---

## 4. Authentication Portals, RBAC & Status Permissions

### Separate Login Portals
CareerSense provides distinct authentication entry points with server-side role validation:
1. **Portal Selection Landing Page (`/login`):** An intuitive collegiate choice hub directing users to either **Student Portal** or **Admin / TPO Portal**.
2. **Student Login Portal (`/student/login`):** Dedicated to B.Tech students. Rejects administrator accounts with a 403 Forbidden alert directing them to the admin portal. Redirects to `/dashboard` upon verification.
3. **Admin / TPO Login Portal (`/admin/login`):** Dedicated to placement cell administrators. Rejects student accounts with a 403 Forbidden alert. Redirects to `/admin` upon verification. No public admin registration or role selector is exposed.

### Account Switching & Reliable Logout
- **Clean Session Teardown:** The `logoutUser()` utility completely purges `jobfit_token`, `jobfit_user`, `jobfit_student_resume`, and dispatches a window event to notify active React components.
- **Cross-Account Isolation:** When logging in as another student or administrator, previous session state is wiped before storing new credentials. User greetings, profiles, skills, and application lists are dynamically queried and bound to the authenticated user ID.
- **Visible Logout Controls:** Dedicated, accessible **Logout** buttons are integrated into both student headers/sidebars and the admin panel header/sidebar.

### Application Status Restriction Architecture
- **Read-Only Student Interface:** Students can track opportunities, view company details, and observe current milestone statuses, but cannot edit statuses via dropdowns, buttons, or direct requests.
- **Backend Security Enforcement:**
  - `POST /api/applications`: For student requests, newly tracked applications are strictly assigned the initial default status `"Interested"`.
  - `PUT /api/applications/:id`: Rejects any student request containing a status update with `403 Forbidden` (`"Forbidden: Students cannot modify application status. Only administrators can update application statuses."`).
  - `PATCH /api/admin/applications/:id/status`: Restricted exclusively to administrators (`protect`, `requireAdmin`). Validates allowed statuses (`Interested`, `Applied`, `Shortlisted`, `Interview`, `Selected`, `Rejected`) and updates MongoDB.

### Promoting an Admin Account
To promote an authorized account to administrator, run the secure CLI script from the project root:

```bash
# Promoting an existing user to admin
node backend/scripts/promoteAdmin.js nandithat3@gmail.com
```

### Admin Dashboard Features (`/admin`)
- **Real Database KPI Cards:** Real counts for Total Students, Active Job Listings, Tracked Applications, and Students with Resumes.
- **Application Status Aggregation:** Real breakdown of applications by stage (`Interested`, `Applied`, `Shortlisted`, `Interview`, `Selected`, `Rejected`).
- **Student Management Tab:** Search by name/email, view college and branch, check resume availability, inspect student skills, and view application counts.
- **Job Management Tab:** View verified vs. manual drives, create new drives, toggle listing active/inactive status, edit drive parameters, and delete obsolete listings.
- **Application Management Tab:** Review all student applications across the college, filter by status, and update official milestones via the status action modal.
- **Resume Management Tab:** Inspect students with uploaded resumes and perform authenticated, audited resume downloads.

---

## 5. Resume Management System

### Failure Diagnosis & Resolution
- **Root Cause of Original Failure:** The previous implementation converted files into base64 Data URLs via JavaScript `FileReader` and submitted them inside a JSON payload to `PUT /api/profile`. Express's JSON body parser limits payloads to 100KB, causing silent `413 PayloadTooLargeError` crashes on genuine resumes. Furthermore, the frontend `api.js` wrapper hardcoded `Content-Type: application/json`, stripping multipart boundary markers whenever `FormData` was submitted.
- **Resolution:**
  1. Implemented a dedicated `multer` storage engine writing to `backend/uploads/resumes/`.
  2. Storage directory is completely private and not exposed via `express.static`.
  3. Server-generated filenames prevent filename collision or directory traversal attacks.
  4. Added file magic byte inspection:
     - PDF: Must start with `%PDF-` (`0x25 0x50 0x44 0x46 0x2D`)
     - DOCX: Must start with PK ZIP header (`0x50 0x4B 0x03 0x04`)
  5. Implemented maximum file size check of 5 MB.
  6. Frontend `api.js` updated to dynamically omit `Content-Type` for `FormData`, letting the browser configure the correct boundary.

### Endpoints
| Endpoint | Method | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/resume/upload` | `POST` | Student | Upload or replace resume (PDF/DOCX, $\le 5$ MB) |
| `/api/resume/status` | `GET` | Student | Retrieve resume metadata and availability |
| `/api/resume/view` | `GET` | Student | Stream file inline with `Content-Disposition: inline` for preview |
| `/api/resume/download` | `GET` | Student | Authenticated binary download with `Content-Disposition: attachment` |
| `/api/resume` | `DELETE` | Student | Delete physical file from disk and clear MongoDB metadata |
| `/api/admin/resumes/:userId/download` | `GET` | Admin | Authorized administrator resume download |

---

## 6. Real Job Vacancies & Live Feeds

### Verified Campus Placement Drives
CareerSense includes verified campus recruitment drives for premier technology employers:
- **TCS** (Ninja / Digital / Prime / Elevate) – Official TCS NextStep Portal
- **Infosys** (Specialist Programmer & Digital Specialist Engineer) – Infosys Careers
- **Accenture** (Associate Software Engineer & Advanced ASE) – Accenture India Campus
- **Wipro** (Elite National Talent Hunt & Turbo) – Wipro Careers
- **Cognizant** (GenC / GenC Elevate / GenC Next) – Cognizant Campus
- **Amazon** (Software Development Engineer - Intern & Full-Time) – Amazon Jobs
- **Microsoft** (Software Engineer - University Graduate & Intern) – Microsoft Careers
- **Cisco** (Technical Consulting Engineer & SDE Intern) – Cisco Careers

### External Developer Feeds
- Integrated with the **Remotive API** (`https://remotive.com/api/remote-jobs`) to sync live software engineering vacancies.
- Implements background deduplication via unique `externalId` tracking.
- If external feeds are unreachable or rate-limited, the system falls back gracefully to verified campus listings without crashing.

### Authentic Application Workflow
- **No Fake Auto-Submission:** Clicking "Apply on Company Site" opens the official employer portal in a new tab (`target="_blank" rel="noopener noreferrer"`) after verifying that the URL uses the `https://` protocol.
- **Application Tracker Modal:** Students choose whether to track the drive as `Interested` or `Applied`, record their application date, and save notes.
- **Resume Integration:** The Applications page highlights whether the student has an active resume uploaded and provides a direct "Download My Resume" button so students can prepare their resume before submitting externally.

---

## 7. Skill Matching Algorithm

$$\text{Fit Percentage} = \left( \frac{|\text{StudentSkills} \cap \text{JobRequiredSkills}|}{|\text{JobRequiredSkills}|} \right) \times 100$$

- **Normalization:** Skill names from both the student's inventory and the job's required skills list are trimmed and lowercased (`" React.js "` $\rightarrow$ `"react.js"`).
- **Explainability:** Returns exact matched and missing skill arrays for each job listing.
- **Safety:** If a listing specifies zero required skills, the score defaults safely to `100%`.

---

## 8. Installation & Setup Guide

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **MongoDB:** Community Edition running locally on port `27017` or a MongoDB Atlas URI

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/JobFit.git
cd JobFit

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/jobfit
JWT_SECRET=your_super_secure_jwt_secret_key_2026
JWT_EXPIRES_IN=1d
```

Create a `.env` file in the project root:
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Initialize & Seed Database
```bash
# Seed initial placement drives and benchmarks
cd backend
npm run seed
cd ..
```

### 4. Promote Initial Administrator
```bash
# Promote your administrative account
node backend/scripts/promoteAdmin.js nandithat3@gmail.com
```

### 5. Running the Application
```bash
# Terminal 1: Start Backend (Port 5001)
node backend/server.js

# Terminal 2: Start Frontend (Port 5173)
npm run dev
```

---

## 9. Verification & Automated Testing

A comprehensive end-to-end test suite validates all implemented features:

```bash
node backend/scripts/verifyFeatures.js
```

### Automated Test Coverage (32/32 Passed)
- **Admin RBAC:** Unauthenticated rejection (401), student forbidden access (403), admin authorized access (200), real MongoDB statistics, paginated student listings without password leakage, job creation, active status toggling, and deletion.
- **Resume System:** Invalid magic byte signature rejection (400), valid PDF upload (200), database metadata verification, binary attachment download (200), inline preview streaming (200), admin authorized resume download (200), and complete file/metadata deletion (200).
- **Job Feeds & Tracking:** Public job querying with dynamic fit percentage, HTTPS application URL validation, tracking as `Interested`, and status transition to `Applied`.

---

## 10. Author Information

- **Student Developer:** Nanditha Tirukovela
- **Degree:** B.Tech in Computer Science and Engineering (CSE)
- **Institution:** MLR Institute of Technology
- **Project Domain:** Full-Stack Web Development, Campus Placement Analytics & Educational Technology
