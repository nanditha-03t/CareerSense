import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  Code2,
  Pencil,
  Trash2,
  Calendar,
  Globe,
  Loader2,
  GitBranch,
  Layers,
  Sparkles,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import { apiRequest } from '../utils/api';

// Recognized GitHub brand icon
function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

// Client-side HTTPS GitHub Repository validation
const GITHUB_REPO_REGEX = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\/)?$/;

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    techInput: '',
    description: '',
    domain: 'Full Stack Web Development',
    status: 'Completed',
    startDate: '',
    endDate: '',
    githubUrl: '',
    liveDemoUrl: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/projects');
      if (res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      setErrorMessage('Unable to load projects from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reset and open modal for creating
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      techInput: '',
      description: '',
      domain: 'Full Stack Web Development',
      status: 'Completed',
      startDate: '',
      endDate: '',
      githubUrl: '',
      liveDemoUrl: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Pre-fill and open modal for editing
  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      techInput: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      description: project.description || '',
      domain: project.domain || 'Full Stack Web Development',
      status: project.status || 'Completed',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      githubUrl: project.githubUrl || '',
      liveDemoUrl: project.liveDemoUrl || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Project title is required.';
    }
    if (!formData.description.trim()) {
      errors.description = 'Project description is required.';
    }
    if (!formData.techInput.trim()) {
      errors.techInput = 'Please specify at least one technology.';
    }

    // GitHub URL validation
    if (formData.githubUrl.trim()) {
      const trimmed = formData.githubUrl.trim();
      if (!GITHUB_REPO_REGEX.test(trimmed)) {
        errors.githubUrl =
          'Please enter a valid HTTPS GitHub repository URL (e.g. https://github.com/username/repository).';
      }
    }

    // Live Demo URL validation
    if (formData.liveDemoUrl.trim()) {
      const trimmed = formData.liveDemoUrl.trim();
      if (!/^https?:\/\/.+/i.test(trimmed)) {
        errors.liveDemoUrl = 'Live demo URL must start with http:// or https://';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save project (Create or Update)
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const techArray = formData.techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      technologies: techArray,
      domain: formData.domain,
      status: formData.status,
      startDate: formData.startDate.trim(),
      endDate: formData.endDate.trim(),
      githubUrl: formData.githubUrl.trim(),
      liveDemoUrl: formData.liveDemoUrl.trim(),
    };

    try {
      if (editingProject) {
        // PUT update
        const res = await apiRequest(`/projects/${editingProject._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        if (res.success && res.data) {
          setProjects((prev) =>
            prev.map((p) => (p._id === editingProject._id ? res.data : p))
          );
          setIsModalOpen(false);
          showToast(`Project "${res.data.title}" updated successfully!`);
        } else {
          setFormErrors({ submit: res.message || 'Failed to update project.' });
        }
      } else {
        // POST create
        const res = await apiRequest('/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (res.success && res.data) {
          setProjects((prev) => [res.data, ...prev]);
          setIsModalOpen(false);
          showToast(`Project "${res.data.title}" added to your portfolio!`);
        } else {
          setFormErrors({ submit: res.message || 'Failed to create project.' });
        }
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setFormErrors({ submit: 'Network error saving project. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete project
  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    setSubmitting(true);

    try {
      const res = await apiRequest(`/projects/${deletingProject._id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        setProjects((prev) => prev.filter((p) => p._id !== deletingProject._id));
        showToast(`Project "${deletingProject.title}" deleted.`);
        setDeletingProject(null);
      } else {
        setErrorMessage(res.message || 'Failed to delete project.');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setErrorMessage('Network error deleting project.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Planning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-blue-600" />
            <span>My Projects</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showcase your academic capstones, hackathon builds, and open source repositories.
          </p>
        </div>

        <div>
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Project
          </Button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-xl">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-600">Loading your project portfolio...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <div className="p-8 sm:p-12 text-center bg-white border border-dashed border-slate-300 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
            No projects added yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
            Add your engineering capstones, coursework mini-projects, or personal apps with GitHub
            repository links to stand out to campus placement recruiters.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Your First Project
          </Button>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => (
            <Card
              key={proj._id}
              className="border-slate-200 hover:border-slate-300 transition-all bg-white flex flex-col justify-between"
            >
              <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full gap-4">
                <div>
                  {/* Top metadata row */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Code2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{proj.domain || 'Software Engineering'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusBadge(
                          proj.status
                        )}`}
                      >
                        {proj.status || 'Completed'}
                      </span>
                      {(proj.startDate || proj.endDate) && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>
                            {proj.startDate && proj.endDate
                              ? `${proj.startDate} – ${proj.endDate}`
                              : proj.startDate || proj.endDate}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {proj.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Technologies Tags */}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Technologies & Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* GitHub URL / Live Demo Preview Box */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    {/* GitHub Link or Clean Fallback */}
                    {proj.githubUrl ? (
                      <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2 text-slate-700 min-w-0">
                          <GithubIcon className="w-4 h-4 text-slate-800 shrink-0" />
                          <span className="truncate font-mono text-[11px] text-slate-600">
                            {proj.githubUrl}
                          </span>
                        </div>
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold shrink-0 ml-2 hover:underline"
                        >
                          <span>View Repository</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                        <span>No GitHub repository linked to this project</span>
                      </div>
                    )}

                    {/* Live Demo Link (if available) */}
                    {proj.liveDemoUrl && (
                      <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50/60 border border-emerald-200">
                        <div className="flex items-center gap-2 text-emerald-800 min-w-0">
                          <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate font-mono text-[11px] text-emerald-700">
                            {proj.liveDemoUrl}
                          </span>
                        </div>
                        <a
                          href={proj.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold shrink-0 ml-2 hover:underline"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Placement Portfolio Verified
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(proj)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit project"
                      aria-label="Edit project"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingProject(proj)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete project"
                      aria-label="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => !submitting && setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-blue-600" />
                <span>{editingProject ? 'Edit Engineering Project' : 'Add Engineering Project'}</span>
              </h3>
              <button
                type="button"
                onClick={() => !submitting && setIsModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.submit && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formErrors.submit}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-4">
              {/* Project Title */}
              <FormField
                id="projTitle"
                label="Project Title"
                required
                error={formErrors.title}
              >
                <Input
                  id="projTitle"
                  placeholder="e.g. Distributed Task Scheduler"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  error={Boolean(formErrors.title)}
                />
              </FormField>

              {/* Technologies */}
              <FormField
                id="techInput"
                label="Technologies & Skills (comma-separated)"
                required
                hint="e.g. React, Node.js, Express, MongoDB, Tailwind CSS"
                error={formErrors.techInput}
              >
                <Input
                  id="techInput"
                  placeholder="Python, FastAPI, Docker, PostgreSQL"
                  value={formData.techInput}
                  onChange={(e) => setFormData({ ...formData, techInput: e.target.value })}
                  error={Boolean(formErrors.techInput)}
                />
              </FormField>

              {/* GitHub Repository URL */}
              <FormField
                id="githubUrl"
                label="GitHub Repository URL"
                hint="Must be a valid HTTPS URL (e.g. https://github.com/username/repository). Private repos are supported for viewers with access."
                error={formErrors.githubUrl}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="githubUrl"
                    type="url"
                    placeholder="https://github.com/username/repository"
                    value={formData.githubUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, githubUrl: e.target.value });
                      if (formErrors.githubUrl) {
                        setFormErrors({ ...formErrors, githubUrl: null });
                      }
                    }}
                    className={`w-full rounded-lg border pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      formErrors.githubUrl
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-300 focus:border-blue-600'
                    }`}
                  />
                </div>
              </FormField>

              {/* Live Demo URL */}
              <FormField
                id="liveDemoUrl"
                label="Live Demo or Deployment URL (Optional)"
                hint="Public web app link, e.g. https://myproject.vercel.app"
                error={formErrors.liveDemoUrl}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    id="liveDemoUrl"
                    type="url"
                    placeholder="https://my-app.vercel.app"
                    value={formData.liveDemoUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, liveDemoUrl: e.target.value });
                      if (formErrors.liveDemoUrl) {
                        setFormErrors({ ...formErrors, liveDemoUrl: null });
                      }
                    }}
                    className={`w-full rounded-lg border pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      formErrors.liveDemoUrl
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-300 focus:border-blue-600'
                    }`}
                  />
                </div>
              </FormField>

              {/* Domain & Status row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField id="projDomain" label="Project Domain">
                  <select
                    id="projDomain"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Full Stack Web Development">Full Stack Web Development</option>
                    <option value="Machine Learning & Data Science">Machine Learning & Data Science</option>
                    <option value="Cloud & Systems Engineering">Cloud & Systems Engineering</option>
                    <option value="Mobile Application Development">Mobile Application Development</option>
                    <option value="Cybersecurity & Networks">Cybersecurity & Networks</option>
                    <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                  </select>
                </FormField>

                <FormField id="projStatus" label="Status">
                  <select
                    id="projStatus"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                    <option value="Archived">Archived</option>
                  </select>
                </FormField>
              </div>

              {/* Dates row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField id="startDate" label="Start Date (Optional)">
                  <Input
                    id="startDate"
                    placeholder="e.g. Jan 2026"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </FormField>

                <FormField id="endDate" label="Completion Date (Optional)">
                  <Input
                    id="endDate"
                    placeholder="e.g. Apr 2026"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </FormField>
              </div>

              {/* Brief Description */}
              <FormField
                id="projDesc"
                label="Brief Description"
                required
                error={formErrors.description}
              >
                <textarea
                  id="projDesc"
                  rows={3}
                  placeholder="Summarize the core problem statement, system architecture, and measurable outcome..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full rounded-lg border py-2 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    formErrors.description
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-300 focus:border-blue-600'
                  }`}
                />
              </FormField>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  leftIcon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                >
                  {submitting
                    ? 'Saving...'
                    : editingProject
                    ? 'Update Project'
                    : 'Add to Portfolio'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => !submitting && setDeletingProject(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 z-10">
            <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              <span>Delete Project</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-900">"{deletingProject.title}"</span>?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={submitting}
                onClick={() => setDeletingProject(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={submitting}
                onClick={handleDeleteConfirm}
                leftIcon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              >
                {submitting ? 'Deleting...' : 'Delete Project'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
