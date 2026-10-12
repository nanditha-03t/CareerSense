import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck2,
  FileText,
  LogOut,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Download,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Building,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Loader2,
  X,
  ChevronRight,
  Eye,
  Check,
  ArrowRight,
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import { apiRequest, downloadFile } from '../utils/api';
import { getCurrentUser, logoutUser } from '../utils/auth';

const STATUS_COLORS = {
  Interested: 'bg-purple-50 text-purple-700 border-purple-200',
  Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  Shortlisted: 'bg-amber-50 text-amber-700 border-amber-200',
  Interview: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Determine active tab from pathname (/admin/students, /admin/jobs, etc.) or default to dashboard
  const currentTabFromUrl = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/students')) return 'students';
    if (path.includes('/jobs')) return 'jobs';
    if (path.includes('/applications')) return 'applications';
    if (path.includes('/resumes')) return 'resumes';
    return 'dashboard';
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState(currentTabFromUrl);

  useEffect(() => {
    setActiveTab(currentTabFromUrl);
  }, [currentTabFromUrl]);

  // Toast / feedback message
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // -------------------------------------------------------------
  // TAB 1: DASHBOARD STATE & DATA
  // -------------------------------------------------------------
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const fetchDashboardStats = async () => {
    setIsStatsLoading(true);
    try {
      const res = await apiRequest('/admin/dashboard');
      if (res.ok && res.data) {
        setDashboardStats(res.data);
      } else {
        showToast(res.message || 'Failed to load dashboard metrics.', 'error');
      }
    } catch {
      showToast('Network error loading dashboard statistics.', 'error');
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  // -------------------------------------------------------------
  // TAB 2: STUDENTS STATE & DATA
  // -------------------------------------------------------------
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentResumeFilter, setStudentResumeFilter] = useState('all');
  const [studentPage, setStudentPage] = useState(1);
  const [studentPagination, setStudentPagination] = useState({ total: 0, totalPages: 1 });
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [isStudentDetailLoading, setIsStudentDetailLoading] = useState(false);

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const query = new URLSearchParams({
        page: studentPage,
        limit: 10,
        ...(studentSearch && { search: studentSearch }),
        ...(studentResumeFilter !== 'all' && {
          hasResume: studentResumeFilter === 'with_resume' ? 'true' : 'false',
        }),
      });
      const res = await apiRequest(`/admin/students?${query.toString()}`);
      if (res.ok && Array.isArray(res.data)) {
        setStudents(res.data);
        if (res.pagination) {
          setStudentPagination(res.pagination);
        }
      }
    } catch {
      showToast('Failed to load students.', 'error');
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    }
  }, [activeTab, studentPage, studentResumeFilter]);

  const handleStudentSearchSubmit = (e) => {
    e.preventDefault();
    setStudentPage(1);
    fetchStudents();
  };

  const handleViewStudent = async (studentId) => {
    setIsStudentDetailLoading(true);
    setSelectedStudentDetail(null);
    try {
      const res = await apiRequest(`/admin/students/${studentId}`);
      if (res.ok && res.data) {
        setSelectedStudentDetail(res.data);
      } else {
        showToast('Unable to load student profile.', 'error');
      }
    } catch {
      showToast('Error loading student details.', 'error');
    } finally {
      setIsStudentDetailLoading(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 3: JOBS STATE & DATA
  // -------------------------------------------------------------
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('all');
  const [jobPage, setJobPage] = useState(1);
  const [jobPagination, setJobPagination] = useState({ total: 0, totalPages: 1 });
  const [isSyncingJobs, setIsSyncingJobs] = useState(false);

  // Job Modal (Create & Edit)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    company: '',
    location: 'Hyderabad / Pan India',
    employmentType: 'Full-Time',
    experienceLevel: 'Fresher',
    workplaceType: 'Onsite',
    package: '4.5 – 7.0 LPA',
    applicationUrl: '',
    source: 'Placement Cell Entry',
    requiredSkills: '',
    description: '',
    eligibility: 'B.Tech with 60% aggregate throughout academics',
    deadline: 'Rolling / Open',
    driveDate: 'Upcoming Campus Drive',
    active: true,
    isVerified: true,
  });

  const [jobToDelete, setJobToDelete] = useState(null);

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const query = new URLSearchParams({
        page: jobPage,
        limit: 12,
        ...(jobSearch && { search: jobSearch }),
        ...(jobStatusFilter === 'active' && { active: 'true' }),
        ...(jobStatusFilter === 'inactive' && { active: 'false' }),
      });
      const res = await apiRequest(`/admin/jobs?${query.toString()}`);
      if (res.ok && Array.isArray(res.data)) {
        setJobs(res.data);
        if (res.pagination) {
          setJobPagination(res.pagination);
        }
      }
    } catch {
      showToast('Failed to load jobs.', 'error');
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs();
    }
  }, [activeTab, jobPage, jobStatusFilter]);

  const handleJobSearchSubmit = (e) => {
    e.preventDefault();
    setJobPage(1);
    fetchJobs();
  };

  const handleOpenAddJob = () => {
    setEditingJob(null);
    setJobFormData({
      title: '',
      company: '',
      location: 'Hyderabad / Pan India',
      employmentType: 'Full-Time',
      experienceLevel: 'Fresher',
      workplaceType: 'Onsite',
      package: '4.5 – 7.0 LPA',
      applicationUrl: '',
      source: 'Campus Placement Drive',
      requiredSkills: 'Java, Python, SQL, Data Structures',
      description: 'Campus placement hiring opportunity for B.Tech engineering graduates.',
      eligibility: 'B.Tech CSE/IT with no active backlogs',
      deadline: 'Rolling / Open',
      driveDate: 'Upcoming Campus Drive',
      active: true,
      isVerified: true,
    });
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job) => {
    setEditingJob(job);
    setJobFormData({
      title: job.title || job.role || '',
      company: job.company || '',
      location: job.location || 'Hyderabad / Pan India',
      employmentType: job.employmentType || 'Full-Time',
      experienceLevel: job.experienceLevel || 'Fresher',
      workplaceType: job.workplaceType || 'Onsite',
      package: job.package || job.salary || '',
      applicationUrl: job.applicationUrl || '',
      source: job.source || 'Campus Placement Drive',
      requiredSkills: Array.isArray(job.requiredSkills)
        ? job.requiredSkills.join(', ')
        : job.requiredSkills || '',
      description: job.description || '',
      eligibility: job.eligibility || '',
      deadline: job.deadline || '',
      driveDate: job.driveDate || '',
      active: job.active !== false,
      isVerified: Boolean(job.isVerified),
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (!jobFormData.title.trim() || !jobFormData.company.trim()) {
      showToast('Title and Company are required.', 'error');
      return;
    }

    try {
      const endpoint = editingJob ? `/admin/jobs/${editingJob._id}` : '/admin/jobs';
      const method = editingJob ? 'PUT' : 'POST';

      const res = await apiRequest(endpoint, {
        method,
        body: JSON.stringify(jobFormData),
      });

      if (res.ok) {
        showToast(
          editingJob ? 'Job listing updated successfully.' : 'New job listing created.',
          'success'
        );
        setIsJobModalOpen(false);
        fetchJobs();
      } else {
        showToast(res.message || 'Failed to save job.', 'error');
      }
    } catch {
      showToast('Error saving job listing.', 'error');
    }
  };

  const handleToggleJobStatus = async (job) => {
    try {
      const res = await apiRequest(`/admin/jobs/${job._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !job.active }),
      });
      if (res.ok) {
        showToast(`Job "${job.title || job.role}" ${!job.active ? 'activated' : 'deactivated'}.`);
        fetchJobs();
      } else {
        showToast(res.message || 'Status toggle failed.', 'error');
      }
    } catch {
      showToast('Error toggling job status.', 'error');
    }
  };

  const handleDeleteJobConfirm = async () => {
    if (!jobToDelete) return;
    try {
      const res = await apiRequest(`/admin/jobs/${jobToDelete._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Job listing deleted successfully.');
        setJobToDelete(null);
        fetchJobs();
      } else {
        showToast(res.message || 'Failed to delete job.', 'error');
      }
    } catch {
      showToast('Error deleting job listing.', 'error');
    }
  };

  const handleSyncLiveJobs = async () => {
    setIsSyncingJobs(true);
    try {
      const res = await apiRequest('/admin/jobs/sync-live', { method: 'POST' });
      if (res.ok) {
        showToast(res.message || 'Live feeds synchronized successfully!');
        fetchJobs();
      } else {
        showToast(res.message || 'Sync failed.', 'error');
      }
    } catch {
      showToast('Error triggering live job feed sync.', 'error');
    } finally {
      setIsSyncingJobs(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 4: APPLICATIONS STATE & DATA
  // -------------------------------------------------------------
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [appPage, setAppPage] = useState(1);
  const [appPagination, setAppPagination] = useState({ total: 0, totalPages: 1 });
  const [appToUpdate, setAppToUpdate] = useState(null);
  const [updateAppStatus, setUpdateAppStatus] = useState('Applied');
  const [updateAppNotes, setUpdateAppNotes] = useState('');

  const fetchApplications = async () => {
    setAppsLoading(true);
    try {
      const query = new URLSearchParams({
        page: appPage,
        limit: 12,
        ...(appSearch && { search: appSearch }),
        ...(appStatusFilter !== 'All' && { status: appStatusFilter }),
      });
      const res = await apiRequest(`/admin/applications?${query.toString()}`);
      if (res.ok && Array.isArray(res.data)) {
        setApplications(res.data);
        if (res.pagination) {
          setAppPagination(res.pagination);
        }
      }
    } catch {
      showToast('Failed to load applications.', 'error');
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab, appPage, appStatusFilter]);

  const handleAppSearchSubmit = (e) => {
    e.preventDefault();
    setAppPage(1);
    fetchApplications();
  };

  const handleSaveAppUpdate = async (e) => {
    e.preventDefault();
    if (!appToUpdate) return;
    try {
      const res = await apiRequest(`/admin/applications/${appToUpdate._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: updateAppStatus,
          notes: updateAppNotes,
        }),
      });
      if (res.ok) {
        showToast('Application updated successfully.');
        setAppToUpdate(null);
        fetchApplications();
      } else {
        showToast(res.message || 'Update failed.', 'error');
      }
    } catch {
      showToast('Error updating application.', 'error');
    }
  };

  // -------------------------------------------------------------
  // TAB 5: RESUMES STATE & DATA
  // -------------------------------------------------------------
  const [resumeStudents, setResumeStudents] = useState([]);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [resumeSearch, setResumeSearch] = useState('');

  const fetchResumes = async () => {
    setResumesLoading(true);
    try {
      const query = new URLSearchParams({
        hasResume: 'true',
        limit: 50,
        ...(resumeSearch && { search: resumeSearch }),
      });
      const res = await apiRequest(`/admin/students?${query.toString()}`);
      if (res.ok && Array.isArray(res.data)) {
        setResumeStudents(res.data);
      }
    } catch {
      showToast('Failed to load resumes.', 'error');
    } finally {
      setResumesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'resumes') {
      fetchResumes();
    }
  }, [activeTab]);

  const handleAdminDownloadResume = async (student) => {
    try {
      showToast(`Downloading resume for ${student.name}...`, 'info');
      await downloadFile(
        `/admin/resumes/${student._id}/download`,
        student.resumeFileName || `${student.name.replace(/\s+/g, '_')}_Resume.pdf`
      );
      showToast(`Resume downloaded for ${student.name}.`, 'success');
    } catch (err) {
      showToast(err.message || 'Download failed.', 'error');
    }
  };

  // Switch tabs and sync URL
  const handleNavClick = (tabKey) => {
    setActiveTab(tabKey);
    const path = tabKey === 'dashboard' ? '/admin' : `/admin/${tabKey}`;
    navigate(path, { replace: true });
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-fade-in flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg bg-white border border-slate-200">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span className="text-sm font-medium text-slate-800">{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white font-bold shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base">
                CareerSense Admin Panel
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                Placement Cell / TPO
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Campus Placement & Skill Gap Management
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logoutUser();
              navigate('/student/login');
            }}
            className="hidden sm:inline-flex text-xs text-slate-600 hover:text-slate-900"
          >
            Switch to Student Portal
          </Button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 text-right">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                {currentUser?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-400">{currentUser?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Admin Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Administration
            </p>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavClick('students')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'students'
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Student Management</span>
            </button>

            <button
              onClick={() => handleNavClick('jobs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'jobs'
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Job Management</span>
            </button>

            <button
              onClick={() => handleNavClick('applications')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'applications'
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              <span>Application Tracking</span>
            </button>

            <button
              onClick={() => handleNavClick('resumes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'resumes'
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-rose-600" />
              <span>Resume Management</span>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs font-semibold text-slate-700">Security & Privileges</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Role verified via server-side JWT authentication.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Admin</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Content Pane */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* ========================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Placement Overview & Analytics</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Live statistics queried directly from the campus placement MongoDB database.
                </p>
              </div>

              {isStatsLoading ? (
                <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                  <p className="text-sm">Querying database metrics...</p>
                </div>
              ) : dashboardStats ? (
                <>
                  {/* KPI Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white border-slate-200 shadow-sm">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Registered Students
                          </p>
                          <p className="text-2xl font-bold text-slate-900 mt-1">
                            {dashboardStats.totalStudents}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">Verified accounts in MongoDB</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Users className="w-6 h-6" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Active Placement Jobs
                          </p>
                          <p className="text-2xl font-bold text-emerald-600 mt-1">
                            {dashboardStats.activeJobs}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {dashboardStats.totalJobs} total drives listed
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Briefcase className="w-6 h-6" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Tracked Applications
                          </p>
                          <p className="text-2xl font-bold text-indigo-600 mt-1">
                            {dashboardStats.totalApplications}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">Student application records</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <FileCheck2 className="w-6 h-6" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Students with Resume
                          </p>
                          <p className="text-2xl font-bold text-rose-600 mt-1">
                            {dashboardStats.studentsWithResumes}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {dashboardStats.resumePercentage}% completion rate
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                          <FileText className="w-6 h-6" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Application Status Pipeline Breakdown */}
                  <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                      <h2 className="text-base font-bold text-slate-900 mb-4">
                        Applications Pipeline by Status (Real Database Aggregation)
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {Object.entries(dashboardStats.applicationsByStatus).map(
                          ([status, count]) => (
                            <div
                              key={status}
                              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                            >
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded border inline-block w-fit ${
                                  STATUS_COLORS[status] || 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {status}
                              </span>
                              <div className="mt-3">
                                <span className="text-2xl font-bold text-slate-900">{count}</span>
                                <span className="text-xs text-slate-400 ml-1.5">records</span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bottom Grids: Recent Registrations & Applications */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Student Registrations */}
                    <Card className="bg-white border-slate-200 shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-slate-900">
                            Recent Student Registrations
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleNavClick('students')}
                            className="text-xs text-blue-600"
                          >
                            View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {dashboardStats.recentStudents?.map((student) => (
                            <div
                              key={student._id}
                              className="py-3 flex items-center justify-between"
                            >
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {student.name}
                                </p>
                                <p className="text-xs text-slate-500">{student.email}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-slate-400 block">
                                  {student.branch || 'CSE'}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {new Date(student.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Applications Activity */}
                    <Card className="bg-white border-slate-200 shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-slate-900">
                            Recent Application Activity
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleNavClick('applications')}
                            className="text-xs text-blue-600"
                          >
                            View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {dashboardStats.recentApplications?.map((app) => (
                            <div key={app._id} className="py-3 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {app.user?.name || 'Student'}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {app.role} at <span className="font-medium">{app.company}</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                    STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {app.status}
                                </span>
                                <span className="text-[11px] text-slate-400 block mt-1">
                                  {app.appliedDate || 'Recent'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-500 bg-white rounded-lg border border-slate-200">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p>No dashboard statistics available.</p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: STUDENT MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'students' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Student Directory</h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Manage student profiles, verify resume availability, and view placement readiness.
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
                  <form onSubmit={handleStudentSearchSubmit} className="flex-1 flex gap-2 w-full">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Search student by name, email, or branch..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="pl-9 text-sm"
                      />
                    </div>
                    <Button type="submit" size="sm">
                      Search
                    </Button>
                  </form>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-slate-500 font-medium shrink-0">Resume:</span>
                    <select
                      value={studentResumeFilter}
                      onChange={(e) => {
                        setStudentResumeFilter(e.target.value);
                        setStudentPage(1);
                      }}
                      className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700"
                    >
                      <option value="all">All Students</option>
                      <option value="with_resume">With Resume Uploaded</option>
                      <option value="without_resume">Missing Resume</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Students Table */}
              <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-3.5">Student Name & Email</th>
                        <th className="px-4 py-3.5">Branch / College</th>
                        <th className="px-4 py-3.5">CGPA</th>
                        <th className="px-4 py-3.5">Skills</th>
                        <th className="px-4 py-3.5">Applications</th>
                        <th className="px-4 py-3.5">Resume</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentsLoading ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-slate-400">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                            Loading student records...
                          </td>
                        </tr>
                      ) : students.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-slate-500">
                            No students found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        students.map((student) => (
                          <tr key={student._id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5">
                              <p className="font-semibold text-slate-900">{student.name}</p>
                              <p className="text-xs text-slate-500">{student.email}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="text-slate-800 text-xs font-medium">
                                {student.branch || 'CSE'}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {student.college || 'MLRIT'} • {student.graduationYear || '2028'}
                              </p>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-800 text-xs">
                              {student.cgpa ? `${student.cgpa} / 10` : '—'}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                              {student.skillsCount} skills
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                              {student.applicationsCount} tracked
                            </td>
                            <td className="px-4 py-3.5">
                              {student.hasResume ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <Check className="w-3 h-3" /> Available
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                  Not Uploaded
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewStudent(student._id)}
                                className="text-xs"
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Showing {students.length} of {studentPagination.total} registered students
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={studentPage <= 1}
                      onClick={() => setStudentPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <span className="px-3 font-semibold text-slate-700">
                      {studentPage} / {studentPagination.totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={studentPage >= studentPagination.totalPages}
                      onClick={() => setStudentPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: JOB MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'jobs' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Campus Drives & Vacancies</h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Post verified campus hiring drives, manage external vacancies, or sync live feeds.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Button
                    variant="outline"
                    onClick={handleSyncLiveJobs}
                    disabled={isSyncingJobs}
                    className="text-xs flex items-center gap-2 border-slate-300"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingJobs ? 'animate-spin' : ''}`} />
                    <span>Sync Live Job Feeds</span>
                  </Button>
                  <Button
                    onClick={handleOpenAddJob}
                    className="text-xs flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Job Drive</span>
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
                  <form onSubmit={handleJobSearchSubmit} className="flex-1 flex gap-2 w-full">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Search by job title, company, skills, or location..."
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                        className="pl-9 text-sm"
                      />
                    </div>
                    <Button type="submit" size="sm">
                      Search
                    </Button>
                  </form>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-slate-500 font-medium shrink-0">Status:</span>
                    <select
                      value={jobStatusFilter}
                      onChange={(e) => {
                        setJobStatusFilter(e.target.value);
                        setJobPage(1);
                      }}
                      className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700"
                    >
                      <option value="all">All Drives</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Jobs Table */}
              <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-3.5">Role & Company</th>
                        <th className="px-4 py-3.5">Package / CTC</th>
                        <th className="px-4 py-3.5">Location & Type</th>
                        <th className="px-4 py-3.5">Source & Verification</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {jobsLoading ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-slate-400">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                            Loading job listings...
                          </td>
                        </tr>
                      ) : jobs.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-slate-500">
                            No job listings found.
                          </td>
                        </tr>
                      ) : (
                        jobs.map((job) => (
                          <tr key={job._id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5">
                              <p className="font-semibold text-slate-900">{job.title || job.role}</p>
                              <p className="text-xs font-medium text-blue-600">{job.company}</p>
                              {job.applicationUrl && (
                                <a
                                  href={job.applicationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-slate-400 hover:text-blue-600 flex items-center gap-1 mt-0.5"
                                >
                                  External Apply Link <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-xs text-slate-800">
                              {job.package || job.salary || 'Competitive'}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-600">
                              <p>{job.location || 'Pan India'}</p>
                              <span className="text-[11px] text-slate-400">
                                {job.employmentType} • {job.workplaceType || 'Onsite'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-xs font-medium text-slate-700 block">
                                {job.source || 'Placement Cell'}
                              </span>
                              {job.isVerified ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Listing
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">Manual / Sample</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => handleToggleJobStatus(job)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                                  job.active !== false
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                }`}
                              >
                                {job.active !== false ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="px-4 py-3.5 text-right space-x-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditJob(job)}
                                className="p-1.5 text-slate-600 hover:text-blue-600"
                                title="Edit Listing"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setJobToDelete(job)}
                                className="p-1.5 text-slate-600 hover:text-rose-600"
                                title="Delete Listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Showing {jobs.length} of {jobPagination.total} job drives
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={jobPage <= 1}
                      onClick={() => setJobPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <span className="px-3 font-semibold text-slate-700">
                      {jobPage} / {jobPagination.totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={jobPage >= jobPagination.totalPages}
                      onClick={() => setJobPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: APPLICATION TRACKING */}
          {/* ========================================================= */}
          {activeTab === 'applications' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Campus Applications Management</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Review student job applications across all drives and update tracking milestones.
                </p>
              </div>

              {/* Filters */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
                  <form onSubmit={handleAppSearchSubmit} className="flex-1 flex gap-2 w-full">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Search by student name, email, company, or role..."
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        className="pl-9 text-sm"
                      />
                    </div>
                    <Button type="submit" size="sm">
                      Search
                    </Button>
                  </form>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-slate-500 font-medium shrink-0">Status:</span>
                    <select
                      value={appStatusFilter}
                      onChange={(e) => {
                        setAppStatusFilter(e.target.value);
                        setAppPage(1);
                      }}
                      className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Interested">Interested</option>
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Applications Table */}
              <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-3.5">Student</th>
                        <th className="px-4 py-3.5">Company & Role</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5">Application Date</th>
                        <th className="px-4 py-3.5">Notes</th>
                        <th className="px-4 py-3.5 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appsLoading ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-slate-400">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                            Loading tracked applications...
                          </td>
                        </tr>
                      ) : applications.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-slate-500">
                            No applications tracked yet.
                          </td>
                        </tr>
                      ) : (
                        applications.map((app) => (
                          <tr key={app._id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5">
                              <p className="font-semibold text-slate-900">
                                {app.user?.name || 'Student Record'}
                              </p>
                              <p className="text-xs text-slate-500">{app.user?.email || '—'}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="font-semibold text-slate-800 text-xs">{app.role}</p>
                              <p className="text-xs text-blue-600 font-medium">{app.company}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                                  STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {app.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-500">
                              {app.appliedDate ||
                                new Date(app.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-600 max-w-xs truncate">
                              {app.notes || '—'}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setAppToUpdate(app);
                                  setUpdateAppStatus(app.status);
                                  setUpdateAppNotes(app.notes || '');
                                }}
                                className="text-xs"
                              >
                                Change Status
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Showing {applications.length} of {appPagination.total} applications
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={appPage <= 1}
                      onClick={() => setAppPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <span className="px-3 font-semibold text-slate-700">
                      {appPage} / {appPagination.totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={appPage >= appPagination.totalPages}
                      onClick={() => setAppPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: RESUME MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'resumes' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Student Resumes Directory</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Access student resumes stored in private secure backend storage with audit logging.
                </p>
              </div>

              {/* Resumes List */}
              <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-3.5">Student</th>
                        <th className="px-4 py-3.5">Branch & CGPA</th>
                        <th className="px-4 py-3.5">Resume File Name</th>
                        <th className="px-4 py-3.5">File Size</th>
                        <th className="px-4 py-3.5">Uploaded Date</th>
                        <th className="px-4 py-3.5 text-right">Download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {resumesLoading ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-slate-400">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                            Loading uploaded resumes...
                          </td>
                        </tr>
                      ) : resumeStudents.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-slate-500">
                            No uploaded resumes on file.
                          </td>
                        </tr>
                      ) : (
                        resumeStudents.map((student) => (
                          <tr key={student._id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5">
                              <p className="font-semibold text-slate-900">{student.name}</p>
                              <p className="text-xs text-slate-500">{student.email}</p>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-600">
                              <p className="font-medium">{student.branch || 'CSE'}</p>
                              <span className="text-[11px] text-slate-400">
                                CGPA: {student.cgpa || '8.0'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-xs font-medium text-slate-800">
                              <span className="inline-flex items-center gap-1.5 text-blue-600 font-semibold">
                                <FileText className="w-3.5 h-3.5 text-blue-500" />
                                {student.resumeFileName || 'Resume.pdf'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-500">
                              {student.resumeFileSize
                                ? `${(student.resumeFileSize / 1024).toFixed(1)} KB`
                                : '—'}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-500">
                              {student.resumeUploadedAt
                                ? new Date(student.resumeUploadedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : 'Recent'}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAdminDownloadResume(student)}
                                className="text-xs flex items-center gap-1.5 ml-auto text-blue-600 hover:text-blue-700"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT JOB */}
      {/* ========================================================= */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingJob ? 'Edit Campus Job Drive' : 'Post New Campus Job Drive'}
              </h3>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Job Title / Role" required>
                  <Input
                    required
                    value={jobFormData.title}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. Software Development Engineer"
                  />
                </FormField>

                <FormField label="Company Name" required>
                  <Input
                    required
                    value={jobFormData.company}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, company: e.target.value }))
                    }
                    placeholder="e.g. TCS, Infosys, Amazon"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField label="Location">
                  <Input
                    value={jobFormData.location}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="e.g. Hyderabad / Bangalore"
                  />
                </FormField>

                <FormField label="Employment Type">
                  <select
                    value={jobFormData.employmentType}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, employmentType: e.target.value }))
                    }
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </FormField>

                <FormField label="Workplace Type">
                  <select
                    value={jobFormData.workplaceType}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, workplaceType: e.target.value }))
                    }
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800"
                  >
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Package / CTC">
                  <Input
                    value={jobFormData.package}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, package: e.target.value }))
                    }
                    placeholder="e.g. 6.5 – 9.5 LPA"
                  />
                </FormField>

                <FormField label="Source Name">
                  <Input
                    value={jobFormData.source}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, source: e.target.value }))
                    }
                    placeholder="e.g. Official Careers Portal"
                  />
                </FormField>
              </div>

              <FormField label="Official Application URL (HTTPS)">
                <Input
                  type="url"
                  value={jobFormData.applicationUrl}
                  onChange={(e) =>
                    setJobFormData((prev) => ({ ...prev, applicationUrl: e.target.value }))
                  }
                  placeholder="https://company.com/careers/job-123"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Must be the genuine external career portal or application URL.
                </span>
              </FormField>

              <FormField label="Required Skills (Comma separated)" required>
                <Input
                  value={jobFormData.requiredSkills}
                  onChange={(e) =>
                    setJobFormData((prev) => ({ ...prev, requiredSkills: e.target.value }))
                  }
                  placeholder="Java, Python, SQL, Data Structures"
                />
              </FormField>

              <FormField label="Eligibility Criteria">
                <Input
                  value={jobFormData.eligibility}
                  onChange={(e) =>
                    setJobFormData((prev) => ({ ...prev, eligibility: e.target.value }))
                  }
                  placeholder="B.Tech with 60% aggregate and no active backlogs"
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  rows="3"
                  value={jobFormData.description}
                  onChange={(e) =>
                    setJobFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800"
                  placeholder="Job roles and responsibilities..."
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Drive Date">
                  <Input
                    value={jobFormData.driveDate}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, driveDate: e.target.value }))
                    }
                    placeholder="e.g. Nov 20, 2026"
                  />
                </FormField>

                <FormField label="Deadline">
                  <Input
                    value={jobFormData.deadline}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, deadline: e.target.value }))
                    }
                    placeholder="e.g. Nov 10, 2026"
                  />
                </FormField>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jobFormData.active}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, active: e.target.checked }))
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-slate-700">Listing is Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jobFormData.isVerified}
                    onChange={(e) =>
                      setJobFormData((prev) => ({ ...prev, isVerified: e.target.checked }))
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-slate-700">Mark as Verified by TPO</span>
                </label>
              </div>

              <div className="p-4 border-t border-slate-200 flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsJobModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingJob ? 'Save Changes' : 'Create Job Listing'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: DELETE CONFIRMATION */}
      {/* ========================================================= */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Remove Job Listing?</h3>
            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to remove{' '}
              <span className="font-semibold text-slate-800">
                "{jobToDelete.title || jobToDelete.role}"
              </span>{' '}
              at <span className="font-semibold text-slate-800">{jobToDelete.company}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => setJobToDelete(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleDeleteJobConfirm}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Yes, Delete Listing
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: VIEW STUDENT DETAILS */}
      {/* ========================================================= */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {selectedStudentDetail.user?.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedStudentDetail.user?.email}</p>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Academic Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase">College</span>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {selectedStudentDetail.profile?.college || selectedStudentDetail.user?.college}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase">Branch</span>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {selectedStudentDetail.profile?.branch || selectedStudentDetail.user?.branch}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase">CGPA</span>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5">
                    {selectedStudentDetail.profile?.cgpa || '8.0'} / 10
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase">Passout</span>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {selectedStudentDetail.profile?.graduationYear ||
                      selectedStudentDetail.user?.graduationYear ||
                      '2028'}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Verified Technical Skills (
                  {selectedStudentDetail.skills?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudentDetail.skills?.length > 0 ? (
                    selectedStudentDetail.skills.map((s) => (
                      <span
                        key={s._id}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                      >
                        {s.name} ({s.level || 'Intermediate'})
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No skills added yet.</span>
                  )}
                </div>
              </div>

              {/* Resume */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Resume Status
                </h4>
                {selectedStudentDetail.hasResume ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-900">
                        {selectedStudentDetail.profile?.resumeFileName || 'Resume.pdf'}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleAdminDownloadResume({
                          _id: selectedStudentDetail.user?._id,
                          name: selectedStudentDetail.user?.name,
                          resumeFileName: selectedStudentDetail.profile?.resumeFileName,
                        })
                      }
                      className="text-xs text-emerald-700 hover:text-emerald-800"
                    >
                      Download Resume
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Student has not uploaded a resume.</p>
                )}
              </div>

              {/* Applications Tracked */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Application History (
                  {selectedStudentDetail.applications?.length || 0})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                  {selectedStudentDetail.applications?.length > 0 ? (
                    selectedStudentDetail.applications.map((a) => (
                      <div key={a._id} className="p-3 flex items-center justify-between bg-white">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{a.role}</p>
                          <p className="text-[11px] text-blue-600">{a.company}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            STATUS_COLORS[a.status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No applications recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: UPDATE APPLICATION STATUS */}
      {/* ========================================================= */}
      {appToUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Update Application Status</h3>
                <p className="text-xs text-slate-500">
                  {appToUpdate.role} at {appToUpdate.company}
                </p>
              </div>
              <button
                onClick={() => setAppToUpdate(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppUpdate} className="space-y-4">
              <FormField label="Tracking Milestone" required>
                <select
                  value={updateAppStatus}
                  onChange={(e) => setUpdateAppStatus(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800"
                >
                  <option value="Interested">Interested</option>
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </FormField>

              <FormField label="Placement Cell Notes">
                <textarea
                  rows="3"
                  value={updateAppNotes}
                  onChange={(e) => setUpdateAppNotes(e.target.value)}
                  placeholder="e.g. Cleared round 1 technical assessment. Interview on Tuesday."
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800"
                />
              </FormField>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setAppToUpdate(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
