import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  School,
  GraduationCap,
  Award,
  Mail,
  Phone,
  FileText,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  MapPin,
  Loader2,
  Download,
  Upload,
  Trash2,
  Eye,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import { apiRequest, downloadFile, viewFile } from '../utils/api';
import { isAuthenticated, getCurrentUser } from '../utils/auth';

const getInitialProfile = () => {
  const activeUser = getCurrentUser();
  return {
    name: activeUser?.name || activeUser?.fullName || '',
    college: activeUser?.college || activeUser?.collegeName || '',
    branch: activeUser?.branch || '',
    graduationYear: activeUser?.graduationYear ? String(activeUser.graduationYear) : '',
    cgpa: '',
    email: activeUser?.email || '',
    phone: '',
    preferredRole: '',
    preferredLocation: '',
    completionPercentage: 0,
  };
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(getInitialProfile);
  const [editFormData, setEditFormData] = useState(getInitialProfile);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isResumeUploading, setIsResumeUploading] = useState(false);

  // Resume state & file picker ref
  const fileInputRef = useRef(null);
  const [resumeFile, setResumeFile] = useState(null);

  // Load real profile from backend MongoDB
  useEffect(() => {
    async function loadProfile() {
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }
      try {
        const activeUser = getCurrentUser();
        const res = await apiRequest('/profile');
        if (res.ok && res.data) {
          const loaded = {
            name: res.data.name || activeUser?.name || activeUser?.fullName || '',
            college: res.data.college || activeUser?.college || activeUser?.collegeName || '',
            branch: res.data.branch || activeUser?.branch || '',
            graduationYear: res.data.graduationYear ? String(res.data.graduationYear) : '',
            cgpa: (res.data.cgpa !== null && res.data.cgpa !== undefined && !isNaN(res.data.cgpa)) ? String(res.data.cgpa) : '',
            email: res.data.email || activeUser?.email || '',
            phone: res.data.phone || '',
            preferredRole: res.data.preferredRole || '',
            preferredLocation: res.data.preferredLocation || '',
            completionPercentage: res.data.completionPercentage || 0,
          };
          setProfileData(loaded);
          setEditFormData(loaded);

          // Check real resume status in MongoDB storage
          try {
            const resumeRes = await apiRequest('/resume/status');
            if (resumeRes.ok && resumeRes.data?.hasResume) {
              setResumeFile({
                name: resumeRes.data.fileName,
                size: resumeRes.data.fileSize
                  ? `${(resumeRes.data.fileSize / 1024).toFixed(1)} KB`
                  : 'Document',
                uploadedAt: resumeRes.data.uploadedAt
                  ? new Date(resumeRes.data.uploadedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recently',
                mimeType: resumeRes.data.mimeType,
              });
            } else {
              setResumeFile(null);
            }
          } catch {
            // Non-critical
          }
        }
      } catch {
        setErrorMessage('Unable to load profile from server. Showing cached information.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Handle student resume file upload via multipart/form-data
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected if replaced
    e.target.value = '';

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const isPdfOrDoc =
      validTypes.includes(file.type) || /\.(pdf|docx?)$/i.test(file.name);
    if (!isPdfOrDoc) {
      setToastMessage('Please select a valid PDF or Word document (.pdf, .docx, .doc).');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setToastMessage('Resume file size must be less than 5MB.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    setIsResumeUploading(true);
    setToastMessage('Uploading and verifying resume format...');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await apiRequest('/resume/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok && res.data) {
        const uploadedData = {
          name: res.data.fileName,
          size: `${(res.data.fileSize / 1024).toFixed(1)} KB`,
          uploadedAt: new Date(res.data.uploadedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          mimeType: res.data.mimeType,
        };

        setResumeFile(uploadedData);
        setToastMessage(`Resume "${file.name}" uploaded and verified successfully!`);
      } else {
        setToastMessage(res.message || 'Failed to upload resume. Please check file format.');
      }
    } catch {
      setToastMessage('Network error occurred during resume upload.');
    } finally {
      setIsResumeUploading(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Handle authenticated student resume download
  const handleDownloadResume = async () => {
    if (!resumeFile) {
      setToastMessage('Please upload your resume first.');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    try {
      setToastMessage('Downloading your verified resume...');
      await downloadFile('/resume/download', resumeFile.name || 'Student_Resume.pdf');
      setToastMessage(`Downloaded "${resumeFile.name || 'Student_Resume.pdf'}" successfully!`);
    } catch (err) {
      setToastMessage(err.message || 'Download failed. Please try again.');
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Handle authenticated student resume preview / view in new tab
  const handleViewResume = async () => {
    if (!resumeFile) return;
    try {
      setToastMessage('Opening resume preview...');
      await viewFile('/resume/view');
    } catch (err) {
      setToastMessage(err.message || 'Unable to preview resume in browser.');
    } finally {
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // Remove uploaded resume from backend storage
  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your stored resume?')) return;

    try {
      const res = await apiRequest('/resume', { method: 'DELETE' });
      if (res.ok) {
        setResumeFile(null);
        localStorage.removeItem('jobfit_student_resume');
        setToastMessage('Resume deleted successfully.');
      } else {
        setToastMessage(res.message || 'Failed to delete resume.');
      }
    } catch {
      setToastMessage('Network error while deleting resume.');
    } finally {
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const openEditModal = () => {
    setEditFormData({ ...profileData });
    setErrorMessage(null);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const parsedCgpa = editFormData.cgpa.trim() !== '' ? Number(editFormData.cgpa) : null;
    if (parsedCgpa !== null && (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10)) {
      setErrorMessage('Please enter a valid CGPA between 0.0 and 10.0');
      setIsSaving(false);
      return;
    }

    const payload = {
      name: editFormData.name.trim(),
      college: editFormData.college.trim(),
      branch: editFormData.branch.trim(),
      graduationYear: editFormData.graduationYear.trim(),
      cgpa: parsedCgpa,
      phone: editFormData.phone.trim(),
      preferredRole: editFormData.preferredRole.trim(),
      preferredLocation: editFormData.preferredLocation.trim(),
    };

    try {
      if (isAuthenticated()) {
        const res = await apiRequest('/profile', {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        if (res.ok && res.data) {
          const updated = {
            ...profileData,
            ...res.data,
            cgpa: (res.data.cgpa !== null && res.data.cgpa !== undefined && !isNaN(res.data.cgpa)) ? String(res.data.cgpa) : '',
          };
          setProfileData(updated);
          setIsEditModalOpen(false);
          setToastMessage('Student placement profile updated successfully in database!');
          setTimeout(() => setToastMessage(null), 3000);
        } else {
          setErrorMessage(res.message || 'Failed to update profile on server.');
        }
      } else {
        setProfileData({ ...profileData, ...payload, cgpa: parsedCgpa !== null ? String(parsedCgpa) : '' });
        setIsEditModalOpen(false);
        setToastMessage('Profile updated locally.');
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch {
      setErrorMessage('Network error while saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            <span>My Profile</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your academic and personal information for campus placement opportunities.
          </p>
        </div>

        <div>
          <Button
            variant="primary"
            size="md"
            onClick={openEditModal}
            leftIcon={<Edit3 className="w-4 h-4" />}
            disabled={isLoading}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500">Loading student profile from database...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Profile Overview Card */}
          <Card className="border-slate-200 bg-white">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-sm">
                    {profileData.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{profileData.name || 'Student Name'}</h2>
                    <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <School className="w-4 h-4 text-slate-400" />
                      <span>{profileData.college || 'College not specified'}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-100">
                        {profileData.graduationYear ? `B.Tech Batch of ${profileData.graduationYear}` : 'Graduation Year Not Set'}
                      </span>
                      {profileData.cgpa ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
                          CGPA: {profileData.cgpa}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium border border-amber-200">
                          CGPA Not Provided
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Completion Box */}
                <div className="w-full sm:w-64 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Profile Completion</span>
                    <span className="text-blue-600 font-bold">{profileData.completionPercentage}%</span>
                  </div>
                  <ProgressBar value={profileData.completionPercentage} size="md" barClassName="bg-blue-600" />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Updated with active placement criteria
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic & Placement Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Academic Details */}
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">Academic Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs">Degree Program</span>
                    <span className="font-semibold text-slate-800">Bachelor of Technology (B.Tech)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Engineering Branch</span>
                    <span className="font-semibold text-slate-800">{profileData.branch || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Graduation Batch</span>
                    <span className="font-semibold text-slate-800">
                      {profileData.graduationYear ? `${profileData.graduationYear} Passing Out` : 'Not Specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Current CGPA</span>
                    <span className={`font-semibold ${profileData.cgpa ? 'text-slate-800' : 'text-amber-600'}`}>
                      {profileData.cgpa ? `${profileData.cgpa} / 10.0` : 'Not Provided'}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-xs">College / Institution</span>
                    <span className="font-semibold text-slate-800">{profileData.college || 'Not Specified'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Placement Preferences */}
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">Placement Preferences</h3>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs">Target Roles</span>
                    <span className="font-semibold text-slate-800">{profileData.preferredRole || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Preferred Job Locations</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {profileData.preferredLocation || 'Not Specified'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-xs">College Email</span>
                      <span className="font-medium text-slate-700 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {profileData.email}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Phone Number</span>
                      <span className="font-medium text-slate-700 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {profileData.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resume Section */}
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      Campus Placement Resume
                    </h4>
                    {resumeFile ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified PDF Uploaded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        Placement CV Ready
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {resumeFile ? (
                      <>
                        <span className="font-medium text-slate-700">{resumeFile.name}</span>
                        {' • '}
                        {resumeFile.size || 'Document'} • Uploaded {resumeFile.uploadedAt || 'recently'}
                      </>
                    ) : (
                      <>
                        {profileData.name.replace(/\s+/g, '_')}_Resume_BTech.pdf • Upload your customized PDF or download an auto-generated verified placement CV
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {isResumeUploading ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading & verifying...</span>
                  </div>
                ) : resumeFile ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleViewResume}
                      className="flex items-center gap-1.5 text-xs text-slate-700"
                      title="Preview resume in new tab"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>View</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleDownloadResume}
                      className="flex items-center gap-1.5 text-xs text-slate-700"
                      title="Download verified resume"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Download</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs text-slate-700"
                      title="Upload a new version to replace current resume"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Replace Resume</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteResume}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1"
                      title="Delete resume from server"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Resume (PDF/DOCX)</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => !isSaving && setIsEditModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-lg border border-slate-200 max-w-lg w-full p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">Edit Student Profile</h3>
              <button
                type="button"
                onClick={() => !isSaving && setIsEditModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <FormField id="editName" label="Full Name" required>
                  <Input
                    id="editName"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </FormField>

                <FormField id="editCGPA" label="Current CGPA" required>
                  <Input
                    id="editCGPA"
                    value={editFormData.cgpa}
                    onChange={(e) => setEditFormData({ ...editFormData, cgpa: e.target.value })}
                  />
                </FormField>

                <FormField id="editCollege" label="College Name" className="sm:col-span-2" required>
                  <Input
                    id="editCollege"
                    value={editFormData.college}
                    onChange={(e) => setEditFormData({ ...editFormData, college: e.target.value })}
                  />
                </FormField>

                <FormField id="editBranch" label="Branch" className="sm:col-span-2" required>
                  <Input
                    id="editBranch"
                    value={editFormData.branch}
                    onChange={(e) => setEditFormData({ ...editFormData, branch: e.target.value })}
                  />
                </FormField>

                <FormField id="editYear" label="Graduation Year" required>
                  <Input
                    id="editYear"
                    value={editFormData.graduationYear}
                    onChange={(e) => setEditFormData({ ...editFormData, graduationYear: e.target.value })}
                  />
                </FormField>

                <FormField id="editPhone" label="Phone Number">
                  <Input
                    id="editPhone"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </FormField>

                <FormField id="editRole" label="Target Roles" className="sm:col-span-2">
                  <Input
                    id="editRole"
                    value={editFormData.preferredRole}
                    onChange={(e) => setEditFormData({ ...editFormData, preferredRole: e.target.value })}
                  />
                </FormField>

                <FormField id="editLocation" label="Preferred Locations" className="sm:col-span-2">
                  <Input
                    id="editLocation"
                    value={editFormData.preferredLocation}
                    onChange={(e) => setEditFormData({ ...editFormData, preferredLocation: e.target.value })}
                  />
                </FormField>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
                  {isSaving ? 'Saving to Database...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
