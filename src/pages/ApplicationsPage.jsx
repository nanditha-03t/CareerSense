import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Plus,
  Building2,
  Calendar,
  Briefcase,
  X,
  CheckCircle2,
  Search,
  Filter,
  Trash2,
  AlertCircle,
  Loader2,
  FileText,
  Download,
  ExternalLink,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import { apiRequest, downloadFile } from '../utils/api';
import { isAuthenticated } from '../utils/auth';

const DEFAULT_APPLICATION_DATE = new Date().toLocaleDateString('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
});

const STATUS_COLORS = {
  Interested: 'bg-slate-100 text-slate-700 border-slate-200',
  Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  Shortlisted: 'bg-amber-50 text-amber-700 border-amber-200',
  Interview: 'bg-purple-50 text-purple-700 border-purple-200',
  Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [resumeStatus, setResumeStatus] = useState(null);

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    appliedDate: DEFAULT_APPLICATION_DATE,
    driveType: 'Campus Hiring Drive',
    notes: '',
  });

  const [refreshKey, setRefreshKey] = useState(0);

  // Check student resume status on mount
  useEffect(() => {
    async function checkResume() {
      if (isAuthenticated()) {
        try {
          const res = await apiRequest('/resume/status');
          if (res.ok && res.data) {
            setResumeStatus(res.data);
          }
        } catch {
          // Resume check is non-blocking
        }
      }
    }
    checkResume();
  }, []);

  // Load user applications from MongoDB
  useEffect(() => {
    async function loadApplications() {
      try {
        if (isAuthenticated()) {
          const res = await apiRequest('/applications');
          if (res.ok && Array.isArray(res.data)) {
            setApplications(
              res.data.map((app) => ({
                ...app,
                id: app._id || app.id,
              }))
            );
          } else {
            setErrorMessage(res.message || 'Unable to load applications from database.');
          }
        } else {
          setApplications([]);
        }
      } catch {
        setErrorMessage('Network error while connecting to applications server.');
      } finally {
        setIsLoading(false);
      }
    }
    loadApplications();
  }, [refreshKey]);

  const handleAddApplication = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      company: formData.company.trim(),
      role: formData.role.trim(),
      appliedDate: formData.appliedDate || DEFAULT_APPLICATION_DATE,
      driveType: formData.driveType || 'Campus Hiring Drive',
      notes: formData.notes || '',
    };

    try {
      if (isAuthenticated()) {
        const res = await apiRequest('/applications', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (res.ok && res.data) {
          const newApp = {
            ...res.data,
            id: res.data._id || res.data.id,
          };
          setApplications((prev) => [newApp, ...prev]);
          setIsModalOpen(false);
          setFormData({
            company: '',
            role: '',
            appliedDate: DEFAULT_APPLICATION_DATE,
            driveType: 'Campus Hiring Drive',
            notes: '',
          });
          setToastMessage(`Application for ${payload.role} at ${payload.company} added (Status: Interested)!`);
          setTimeout(() => setToastMessage(null), 3000);
        } else {
          setErrorMessage(res.message || 'Failed to save application to MongoDB.');
        }
      }
    } catch {
      setErrorMessage('Network error while saving application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteApplication = async (id, company) => {
    if (!window.confirm(`Remove application tracking for ${company}?`)) return;

    try {
      if (isAuthenticated() && !id.startsWith('app-')) {
        const res = await apiRequest(`/applications/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          setToastMessage(res.message || 'Failed to delete application.');
          setTimeout(() => setToastMessage(null), 2500);
          return;
        }
      }
      setApplications((prev) => prev.filter((app) => app.id !== id));
      setToastMessage(`Removed ${company} application tracking.`);
      setTimeout(() => setToastMessage(null), 2500);
    } catch {
      setToastMessage('Error deleting application.');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-blue-600" />
            <span>Application Tracking</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep track of campus placement drives and external job applications with live milestone updates.
          </p>
        </div>

        <div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Application
          </Button>
        </div>
      </div>

      {/* Resume Availability Integration Banner */}
      {resumeStatus?.hasResume ? (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-emerald-950">
                  Placement Resume on File: {resumeStatus.fileName}
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Ready to Apply
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                Download your verified resume to attach directly on employer career pages when completing applications.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              downloadFile(
                '/resume/download',
                resumeStatus.fileName || 'Placement_Resume.pdf'
              )
            }
            className="text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-100 shrink-0 flex items-center gap-1.5 bg-white"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download My Resume</span>
          </Button>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-amber-950">
                No Resume Uploaded on Your Profile
              </span>
              <p className="text-xs text-amber-700 mt-0.5">
                Upload your resume PDF/DOCX on your Profile page so you can easily review, download, and attach it to job applications.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-xs bg-amber-600 hover:bg-amber-700 text-white shrink-0"
          >
            Upload Resume on Profile
          </Button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setErrorMessage(null);
              setRefreshKey((k) => k + 1);
            }}
            className="text-xs font-semibold underline text-red-700 hover:text-red-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="border-slate-200 bg-white">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="All">All Applications</option>
              <option value="Interested">Interested</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Applications Table / Cards */}
      <Card className="border-slate-200 bg-white overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm">Loading applications from database...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No applications found</p>
            <p className="text-xs text-slate-400 mt-1">
              Explore available opportunities on the Jobs page and click "Save / Track" to monitor your progress.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Company & Role</th>
                  <th className="py-3 px-4">Drive Type</th>
                  <th className="py-3 px-4">Date Tracked</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.company}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{app.role}</span>
                      </div>
                      {app.applicationUrl && (
                        <a
                          href={app.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          Official Career Portal <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {app.driveType || 'Campus Hiring Drive'}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {app.appliedDate || 'Recent'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
                      {app.notes || '—'}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteApplication(app.id, app.company)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-lg border border-slate-200 max-w-md w-full p-6 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">Track New Application</h3>
              <button
                type="button"
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="space-y-4">
              <FormField label="Company Name" required>
                <Input
                  required
                  placeholder="e.g. TCS, Infosys, Amazon"
                  value={formData.company}
                  onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                />
              </FormField>

              <FormField label="Job Role" required>
                <Input
                  required
                  placeholder="e.g. Software Developer, SDE Intern"
                  value={formData.role}
                  onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                />
              </FormField>

              <div>
                <FormField label="Drive Type">
                  <Input
                    placeholder="e.g. On-Campus Drive, Off-Campus, Internship"
                    value={formData.driveType}
                    onChange={(e) => setFormData((p) => ({ ...p, driveType: e.target.value }))}
                  />
                </FormField>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Initial Status: Interested</span>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Official milestones (Shortlisted, Interview, Selected) are updated by campus placement administrators.
                  </p>
                </div>
              </div>

              <FormField label="Notes (Optional)">
                <textarea
                  rows="2"
                  placeholder="e.g. Uploaded resume on employer portal. Interview on Friday."
                  value={formData.notes}
                  onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </FormField>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save to Tracker'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
