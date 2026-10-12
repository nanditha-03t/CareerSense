import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  Sparkles,
  MapPin,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Bookmark,
  Check,
  Loader2,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { apiRequest } from '../utils/api';
import { isAuthenticated } from '../utils/auth';

const isValidHttpUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    const parsed = new URL(urlStr.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const DEFAULT_APPLICATION_DATE = new Date().toLocaleDateString('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
});

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('All');
  const [workplaceFilter, setWorkplaceFilter] = useState('All');
  const [minMatch, setMinMatch] = useState(0);

  const [selectedJob, setSelectedJob] = useState(null);
  const [trackingJobModal, setTrackingJobModal] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState('Interested');
  const [trackingNotes, setTrackingNotes] = useState('');

  const [appliedJobsMap, setAppliedJobsMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingApp, setIsSavingApp] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [externalRedirectJob, setExternalRedirectJob] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch real jobs and existing tracked applications
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const endpoint = isAuthenticated() ? '/skill-gap/jobs' : '/jobs';
        const [jobsRes, appsRes] = await Promise.all([
          apiRequest(endpoint),
          isAuthenticated() ? apiRequest('/applications') : Promise.resolve({ ok: false }),
        ]);

        if (jobsRes.ok && Array.isArray(jobsRes.data)) {
          setJobs(
            jobsRes.data.map((j) => ({
              ...j,
              id: j._id || j.id,
            }))
          );
        } else {
          setErrorMessage(jobsRes.message || 'Unable to retrieve campus jobs.');
        }

        if (appsRes.ok && Array.isArray(appsRes.data)) {
          const map = {};
          appsRes.data.forEach((app) => {
            const key = app.company?.toLowerCase();
            if (key) {
              map[key] = {
                id: app._id,
                status: app.status,
                appliedDate: app.appliedDate,
              };
            }
          });
          setAppliedJobsMap(map);
        }
      } catch {
        setErrorMessage('Network error connecting to CareerSense server.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle opening genuine employer application link
  const handleOpenExternalApply = (job) => {
    if (!isValidHttpUrl(job.applicationUrl)) {
      showToast('Official external apply URL not provided for this drive.');
      return;
    }

    // Open employer application in new tab with secure rel attributes
    window.open(job.applicationUrl, '_blank', 'noopener,noreferrer');

    // Display student confirmation notice
    setExternalRedirectJob(job);
  };

  // Save or track opportunity in student applications
  const handleSaveToApplications = async (e) => {
    e.preventDefault();
    if (!trackingJobModal) return;

    if (!isAuthenticated()) {
      showToast('Please sign in to save and track applications.');
      return;
    }

    setIsSavingApp(true);
    try {
      const payload = {
        company: trackingJobModal.company,
        role: trackingJobModal.title || trackingJobModal.role,
        status: 'Interested',
        driveType: trackingJobModal.employmentType === 'Internship' ? 'Internship Drive' : 'Campus Hiring Drive',
        applicationUrl: trackingJobModal.applicationUrl || '',
        appliedDate: DEFAULT_APPLICATION_DATE,
        notes: trackingNotes,
      };

      const res = await apiRequest('/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setAppliedJobsMap((prev) => ({
          ...prev,
          [trackingJobModal.company.toLowerCase()]: {
            id: res.data?._id,
            status: 'Interested',
          },
        }));
        setTrackingJobModal(null);
        setTrackingNotes('');
        setExternalRedirectJob(null);
        showToast(
          `Opportunity added to tracker as "Interested" for ${trackingJobModal.company}!`
        );
      } else {
        showToast(res.message || 'Failed to save application.');
      }
    } catch {
      showToast('Error saving application to your tracker.');
    } finally {
      setIsSavingApp(false);
    }
  };

  const getTrackingStatus = (job) => {
    return appliedJobsMap[job.company?.toLowerCase()];
  };

  const filteredJobs = jobs.filter((job) => {
    const roleStr = (job.title || job.role || '').toLowerCase();
    const companyStr = (job.company || '').toLowerCase();
    const locStr = (job.location || '').toLowerCase();
    const q = searchTerm.toLowerCase();

    const matchesSearch =
      roleStr.includes(q) ||
      companyStr.includes(q) ||
      locStr.includes(q) ||
      (job.requiredSkills || []).some((s) => s.toLowerCase().includes(q));

    const matchesEmployment =
      employmentTypeFilter === 'All' ||
      (job.employmentType || '').toLowerCase() === employmentTypeFilter.toLowerCase();

    const matchesWorkplace =
      workplaceFilter === 'All' ||
      (job.workplaceType || '').toLowerCase() === workplaceFilter.toLowerCase();

    const matchesMatch = (job.match || 0) >= minMatch;

    return matchesSearch && matchesEmployment && matchesWorkplace && matchesMatch;
  });

  return (
    <AppLayout>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-fade-in flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg bg-white border border-slate-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium text-slate-800">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <span>Campus Placement & Technology Jobs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Genuine verified vacancies with direct employer application links and personalized skill matching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
            {filteredJobs.length} Opportunities Available
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by job title, company, skills, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {/* Type Filter */}
              <select
                value={employmentTypeFilter}
                onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="All">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
              </select>

              {/* Workplace Filter */}
              <select
                value={workplaceFilter}
                onChange={(e) => setWorkplaceFilter(e.target.value)}
                className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700"
              >
                <option value="All">All Locations</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>

              {/* Match Filter */}
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs text-slate-500 font-medium">Min Fit:</span>
                <select
                  value={minMatch}
                  onChange={(e) => setMinMatch(Number(e.target.value))}
                  className="text-xs bg-transparent text-slate-700 font-semibold focus:outline-none"
                >
                  <option value={0}>0%+</option>
                  <option value={50}>50%+</option>
                  <option value={70}>70%+</option>
                  <option value={80}>80%+</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              Loading verified job listings and computing placement skill match...
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Jobs Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white border border-slate-200 rounded-xl">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">No matching vacancies found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search criteria or reducing the minimum fit filter.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const trackingInfo = getTrackingStatus(job);
              const hasExternalLink = isValidHttpUrl(job.applicationUrl);

              return (
                <Card
                  key={job.id}
                  className="border-slate-200 hover:border-slate-300 transition-colors bg-white flex flex-col justify-between"
                >
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    {/* Header: Title, Company, Source & Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {job.employmentType || 'Full-Time'}
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
                            {job.workplaceType || 'Onsite'}
                          </span>
                          {job.isVerified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {job.title || job.role}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 mt-0.5">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-800">{job.company}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {job.location}
                          </span>
                        </div>
                      </div>

                      {/* Day 7 Skill Match Badge & Academic Eligibility */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {typeof job.match === 'number' ? (
                          <div
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1 ${
                              job.match >= 80
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : job.match >= 60
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{job.match}% Fit</span>
                          </div>
                        ) : (
                          <div className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            <span>Pending Skills</span>
                          </div>
                        )}

                        {/* Academic Eligibility Badge */}
                        {job.eligibilityDetails && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              job.eligibilityDetails.status === 'eligible'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : job.eligibilityDetails.status === 'not_eligible'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                            title={job.eligibilityDetails.message}
                          >
                            {job.eligibilityDetails.badgeText}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata: Package, Source, Deadline */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[11px]">CTC Package</span>
                        <span className="font-semibold text-slate-800">
                          {job.package || job.salary || 'Competitive'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Hiring Source</span>
                        <span className="font-medium text-slate-700 truncate block">
                          {job.source || 'Campus Placement'}
                        </span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200/50 flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">
                          <strong>Deadline:</strong> {job.deadline || 'Open / Rolling'}
                        </span>
                        {trackingInfo && (
                          <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            Tracked: {trackingInfo.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Required Skills tags */}
                    <div>
                      <span className="text-xs text-slate-500 font-medium block mb-1.5">
                        Required Skills:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(job.requiredSkills || []).map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions: View Details, Save, Apply on Company Website */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        View Details & Gaps
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Save to My Applications Button */}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setTrackingJobModal(job);
                            setTrackingStatus(trackingInfo ? trackingInfo.status : 'Interested');
                          }}
                          className="text-xs flex items-center gap-1.5"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                          <span>{trackingInfo ? 'Update Status' : 'Save / Track'}</span>
                        </Button>

                        {/* Apply on Company Website */}
                        {hasExternalLink ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenExternalApply(job)}
                            className="text-xs flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <span>Apply on Company Site</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium px-2 py-1 bg-slate-50 rounded border border-slate-200">
                            On-Campus Registration
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: JOB DETAILS & SKILL GAP BREAKDOWN */}
      {/* ========================================================= */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setSelectedJob(null)}
          />
          <div className="relative bg-white rounded-xl shadow-lg border border-slate-200 max-w-xl w-full p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {selectedJob.title || selectedJob.role}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{selectedJob.company}</span>
                  <span className="text-slate-300">•</span>
                  <span>{selectedJob.location}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              {/* Placement Fit Match */}
              {typeof selectedJob.match === 'number' && (
                <div
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    selectedJob.match >= 80
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-blue-50/80 border-blue-200 text-blue-900'
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm">Placement Match: {selectedJob.match}%</p>
                    <p className="text-xs mt-0.5">
                      Formula: (matched required skills ÷ total required skills) × 100
                    </p>
                  </div>
                  <Sparkles className="w-6 h-6 text-blue-600 shrink-0" />
                </div>
              )}

              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Opportunity Description</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {selectedJob.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div>
                  <strong className="text-slate-900">CTC Package:</strong>{' '}
                  {selectedJob.package || selectedJob.salary || 'Competitive'}
                </div>
                <div>
                  <strong className="text-slate-900">Eligibility:</strong>{' '}
                  {selectedJob.eligibility}
                </div>
                <div>
                  <strong className="text-slate-900">Source:</strong> {selectedJob.source}
                </div>
                <div>
                  <strong className="text-slate-900">Deadline:</strong>{' '}
                  {selectedJob.deadline || 'Rolling'}
                </div>
              </div>

              {/* Academic Eligibility Evaluation Box */}
              {selectedJob.eligibilityDetails && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                    selectedJob.eligibilityDetails.status === 'eligible'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : selectedJob.eligibilityDetails.status === 'not_eligible'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {selectedJob.eligibilityDetails.status === 'eligible' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold">
                      Academic Eligibility: {selectedJob.eligibilityDetails.badgeText}
                    </span>
                    <p className="mt-0.5 leading-relaxed">
                      {selectedJob.eligibilityDetails.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Matched vs Missing Skills breakdown */}
              {selectedJob.matchDetails ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Matched Skills ({selectedJob.matchDetails.matchedCount})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.matchDetails.matchedSkills.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Missing Skills to Prepare ({selectedJob.matchDetails.missingCount})</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.matchDetails.missingSkills.length > 0 ? (
                        selectedJob.matchDetails.missingSkills.map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-medium"
                          >
                            ! {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-700 font-medium">
                          You meet 100% of the required skills for this opportunity! 🎉
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1.5">Required Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedJob.requiredSkills || []).map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-2.5">
              <Button variant="secondary" size="sm" onClick={() => setSelectedJob(null)}>
                Close
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const j = selectedJob;
                    setSelectedJob(null);
                    setTrackingJobModal(j);
                  }}
                  className="text-xs"
                >
                  <Bookmark className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  <span>Track Application</span>
                </Button>

                {isValidHttpUrl(selectedJob.applicationUrl) && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const j = selectedJob;
                      setSelectedJob(null);
                      handleOpenExternalApply(j);
                    }}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <span>Apply on Company Site</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SAVE TO MY APPLICATIONS TRACKER */}
      {/* ========================================================= */}
      {trackingJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setTrackingJobModal(null)}
          />
          <div className="relative bg-white rounded-xl shadow-lg border border-slate-200 max-w-md w-full p-6 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Save to My Applications</h3>
                <p className="text-xs text-slate-500">
                  {trackingJobModal.title || trackingJobModal.role} at {trackingJobModal.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTrackingJobModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveToApplications} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Initial Status: Interested</span>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    This vacancy will be saved to your application tracker as "Interested". Advancement milestones (Shortlisted, Interview, Selected) are verified by campus administrators.
                  </p>
                </div>
              </div>

              <FormField label="Personal Notes (Optional)">
                <textarea
                  rows="3"
                  value={trackingNotes}
                  onChange={(e) => setTrackingNotes(e.target.value)}
                  placeholder="e.g. Applied via official portal using referral. Assessment scheduled."
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800"
                />
              </FormField>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTrackingJobModal(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSavingApp}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                >
                  {isSavingApp ? 'Saving...' : 'Confirm Tracking'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: EXTERNAL APPLICATION CONFIRMATION BANNER */}
      {/* ========================================================= */}
      {externalRedirectJob && (
        <div className="fixed bottom-6 right-6 z-40 max-w-md bg-white rounded-xl shadow-2xl border border-blue-200 p-4 animate-slide-up">
          <div className="flex items-start justify-between gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">
                Opened {externalRedirectJob.company} Careers Portal
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Complete your application on their official portal, then track your milestone on CareerSense:
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setTrackingJobModal(externalRedirectJob);
                    setTrackingStatus('Applied');
                  }}
                  className="text-xs bg-blue-600 text-white"
                >
                  Mark as Applied
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setExternalRedirectJob(null)}
                  className="text-xs"
                >
                  Dismiss
                </Button>
              </div>
            </div>
            <button
              onClick={() => setExternalRedirectJob(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
