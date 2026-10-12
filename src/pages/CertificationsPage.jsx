import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Plus,
  CheckCircle2,
  AlertCircle,
  Building,
  ExternalLink,
  X,
  FileText,
  Download,
  Eye,
  Trash2,
  Pencil,
  UploadCloud,
  Loader2,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import { apiRequest, downloadFile, viewFile } from '../utils/api';

// Format file size in KB or MB
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  if (bytes < k) return `${bytes} B`;
  if (bytes < k * k) return `${(bytes / k).toFixed(1)} KB`;
  return `${(bytes / (k * k)).toFixed(1)} MB`;
}

// 5MB limit
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [deletingCert, setDeletingCert] = useState(null);
  const [replacingCert, setReplacingCert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileActionLoading, setFileActionLoading] = useState({});

  // Form data for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expirationDate: '',
    credentialId: '',
    verificationUrl: '',
    grade: 'Certified',
    skillsInput: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);
  const replaceFileInputRef = useRef(null);

  // Fetch certifications
  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/certifications');
      if (res.success && Array.isArray(res.data)) {
        setCertifications(res.data);
      } else {
        setCertifications([]);
      }
    } catch (err) {
      console.error('Failed to load certifications:', err);
      setErrorMessage('Unable to load certifications from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Add modal
  const handleOpenAddModal = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      issueDate: 'Oct 2026',
      expirationDate: '',
      credentialId: '',
      verificationUrl: '',
      grade: 'Certified',
      skillsInput: '',
    });
    setSelectedFile(null);
    setFileError(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (cert) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title || '',
      issuer: cert.issuer || '',
      issueDate: cert.issueDate || '',
      expirationDate: cert.expirationDate || '',
      credentialId: cert.credentialId || '',
      verificationUrl: cert.verificationUrl || '',
      grade: cert.grade || 'Certified',
      skillsInput: Array.isArray(cert.skills) ? cert.skills.join(', ') : '',
    });
    setSelectedFile(null);
    setFileError(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // File selection & validation
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate PDF extension & MIME
    const isPdfExt = file.name.toLowerCase().endsWith('.pdf');
    const isPdfMime = file.type === 'application/pdf' || file.type === '';

    if (!isPdfExt || !isPdfMime) {
      setFileError('Invalid file format. Only PDF documents (.pdf) are permitted.');
      setSelectedFile(null);
      if (e.target) e.target.value = '';
      return;
    }

    // Validate size limit (5MB)
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File size (${formatFileSize(file.size)}) exceeds the 5 MB limit.`);
      setSelectedFile(null);
      if (e.target) e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Certification title is required.';
    if (!formData.issuer.trim()) errors.issuer = 'Issuing organization is required.';
    if (!formData.issueDate.trim()) errors.issueDate = 'Issue date is required.';

    if (formData.verificationUrl.trim()) {
      if (!/^https?:\/\/.+/i.test(formData.verificationUrl.trim())) {
        errors.verificationUrl = 'Verification URL must start with http:// or https://';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Certification (Add or Edit)
  const handleSaveCert = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const skillsArray = formData.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingCert) {
        // PUT update metadata
        const payload = {
          title: formData.title.trim(),
          issuer: formData.issuer.trim(),
          issueDate: formData.issueDate.trim(),
          expirationDate: formData.expirationDate.trim(),
          credentialId: formData.credentialId.trim(),
          verificationUrl: formData.verificationUrl.trim(),
          grade: formData.grade.trim(),
          skills: skillsArray,
        };

        const res = await apiRequest(`/certifications/${editingCert._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        if (res.success && res.data) {
          // If a new PDF file was also selected while editing, upload it
          if (selectedFile) {
            const formDataObj = new FormData();
            formDataObj.append('certificate', selectedFile);

            const uploadRes = await apiRequest(
              `/certifications/${editingCert._id}/upload`,
              {
                method: 'POST',
                body: formDataObj,
              }
            );

            if (uploadRes.success && uploadRes.data) {
              setCertifications((prev) =>
                prev.map((c) => (c._id === editingCert._id ? uploadRes.data : c))
              );
            } else {
              setCertifications((prev) =>
                prev.map((c) => (c._id === editingCert._id ? res.data : c))
              );
              setErrorMessage(
                uploadRes.message || 'Metadata updated, but PDF upload encountered an issue.'
              );
            }
          } else {
            setCertifications((prev) =>
              prev.map((c) => (c._id === editingCert._id ? res.data : c))
            );
          }

          setIsModalOpen(false);
          showToast(`Certification "${formData.title}" updated successfully!`);
        } else {
          setFormErrors({ submit: res.message || 'Failed to update certification.' });
        }
      } else {
        // POST create certification (with optional PDF file using FormData)
        const formDataObj = new FormData();
        formDataObj.append('title', formData.title.trim());
        formDataObj.append('issuer', formData.issuer.trim());
        formDataObj.append('issueDate', formData.issueDate.trim());
        formDataObj.append('expirationDate', formData.expirationDate.trim());
        formDataObj.append('credentialId', formData.credentialId.trim());
        formDataObj.append('verificationUrl', formData.verificationUrl.trim());
        formDataObj.append('grade', formData.grade.trim());
        formDataObj.append('skills', JSON.stringify(skillsArray));

        if (selectedFile) {
          formDataObj.append('certificate', selectedFile);
        }

        const res = await apiRequest('/certifications', {
          method: 'POST',
          body: formDataObj,
        });

        if (res.success && res.data) {
          setCertifications((prev) => [res.data, ...prev]);
          setIsModalOpen(false);
          showToast(
            `Certification "${res.data.title}" ${
              selectedFile ? 'and verified PDF document ' : ''
            }added successfully!`
          );
        } else {
          setFormErrors({ submit: res.message || 'Failed to create certification.' });
        }
      }
    } catch (err) {
      console.error('Error saving certification:', err);
      setFormErrors({ submit: 'Network error occurred. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Replace PDF document for a certification
  const handleReplacePdf = async (e) => {
    e.preventDefault();
    if (!replacingCert || !selectedFile) return;

    setSubmitting(true);
    const formDataObj = new FormData();
    formDataObj.append('certificate', selectedFile);

    try {
      const res = await apiRequest(`/certifications/${replacingCert._id}/upload`, {
        method: 'POST',
        body: formDataObj,
      });

      if (res.success && res.data) {
        setCertifications((prev) =>
          prev.map((c) => (c._id === replacingCert._id ? res.data : c))
        );
        setReplacingCert(null);
        setSelectedFile(null);
        showToast(`Certificate document replaced for "${res.data.title}"!`);
      } else {
        setFileError(res.message || 'Failed to upload certificate PDF.');
      }
    } catch (err) {
      console.error('Error replacing certificate PDF:', err);
      setFileError('Network error uploading certificate PDF.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete attached PDF only
  const handleDeletePdfOnly = async (cert) => {
    if (!window.confirm(`Remove the attached PDF document from "${cert.title}"?`)) return;

    try {
      setFileActionLoading((prev) => ({ ...prev, [cert._id]: true }));
      const res = await apiRequest(`/certifications/${cert._id}/file`, {
        method: 'DELETE',
      });

      if (res.success && res.data) {
        setCertifications((prev) =>
          prev.map((c) => (c._id === cert._id ? res.data : c))
        );
        showToast(`Attached PDF removed from "${cert.title}".`);
      } else {
        setErrorMessage(res.message || 'Failed to delete certificate PDF.');
      }
    } catch (err) {
      console.error('Error deleting PDF:', err);
      setErrorMessage('Network error removing certificate PDF.');
    } finally {
      setFileActionLoading((prev) => ({ ...prev, [cert._id]: false }));
    }
  };

  // Delete entire certification record
  const handleDeleteCertConfirm = async () => {
    if (!deletingCert) return;
    setSubmitting(true);

    try {
      const res = await apiRequest(`/certifications/${deletingCert._id}`, {
        method: 'DELETE',
      });

      if (res.success) {
        setCertifications((prev) => prev.filter((c) => c._id !== deletingCert._id));
        showToast(`Certification "${deletingCert.title}" deleted.`);
        setDeletingCert(null);
      } else {
        setErrorMessage(res.message || 'Failed to delete certification.');
      }
    } catch (err) {
      console.error('Error deleting certification:', err);
      setErrorMessage('Network error deleting certification.');
    } finally {
      setSubmitting(false);
    }
  };

  // View PDF inline
  const handleViewPdf = async (cert) => {
    try {
      setFileActionLoading((prev) => ({ ...prev, [`view-${cert._id}`]: true }));
      await viewFile(`/certifications/${cert._id}/view`);
    } catch (err) {
      console.error('Error viewing certificate PDF:', err);
      setErrorMessage(err.message || 'Unable to open certificate PDF.');
    } finally {
      setFileActionLoading((prev) => ({ ...prev, [`view-${cert._id}`]: false }));
    }
  };

  // Download PDF
  const handleDownloadPdf = async (cert) => {
    try {
      setFileActionLoading((prev) => ({ ...prev, [`download-${cert._id}`]: true }));
      await downloadFile(
        `/certifications/${cert._id}/download`,
        cert.certificateFileName || `${cert.title}-Certificate.pdf`
      );
      showToast(`Downloading "${cert.certificateFileName || 'certificate.pdf'}"...`);
    } catch (err) {
      console.error('Error downloading certificate PDF:', err);
      setErrorMessage(err.message || 'Unable to download certificate PDF.');
    } finally {
      setFileActionLoading((prev) => ({ ...prev, [`download-${cert._id}`]: false }));
    }
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            <span>My Certifications</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload, verify, and showcase your professional credentials and PDF certificates.
          </p>
        </div>

        <div>
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Certification
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

      {/* Error Banner */}
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
          <p className="text-sm font-medium text-slate-600">
            Loading your certifications portfolio...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && certifications.length === 0 && (
        <div className="p-8 sm:p-12 text-center bg-white border border-dashed border-slate-300 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
            No certifications added yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
            Upload verified course credentials, NPTEL certificates, or AWS/Cloud badges with PDF
            attachments for campus placement verification.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Your First Certification
          </Button>
        </div>
      )}

      {/* Certifications Grid */}
      {!loading && certifications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certifications.map((cert) => {
            const hasPdf = Boolean(cert.certificateStorageKey);
            const isViewing = fileActionLoading[`view-${cert._id}`];
            const isDownloading = fileActionLoading[`download-${cert._id}`];
            const isDeletingFile = fileActionLoading[cert._id];

            return (
              <Card
                key={cert._id}
                className="border-slate-200 hover:border-slate-300 transition-all bg-white flex flex-col justify-between"
              >
                <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full gap-4">
                  <div>
                    {/* Header badge & status */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                        <Award className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasPdf ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <FileCheck className="w-3 h-3 text-emerald-600" />
                            <span>PDF Attached</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                            <span>No PDF</span>
                          </span>
                        )}
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                          {cert.grade || 'Certified'}
                        </span>
                      </div>
                    </div>

                    {/* Title & Issuer */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {cert.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{cert.issuer}</span>
                    </p>

                    {/* Dates & Credential ID details */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Issue Date</span>
                        <span className="font-semibold text-slate-800">{cert.issueDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">
                          {cert.expirationDate ? 'Valid Until' : 'Credential ID'}
                        </span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {cert.expirationDate || cert.credentialId || 'Verified Record'}
                        </span>
                      </div>
                    </div>

                    {/* Skills Covered */}
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1.5">
                          {cert.skills.map((s) => (
                            <span
                              key={s}
                              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attached PDF Box or Upload CTA */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      {hasPdf ? (
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-900 truncate">
                                  {cert.certificateFileName}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {formatFileSize(cert.certificateFileSize)} • Verified PDF Document
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeletePdfOnly(cert)}
                              disabled={isDeletingFile}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors"
                              title="Remove certificate PDF attachment"
                              aria-label="Remove certificate PDF attachment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* PDF Actions: View, Download, Replace */}
                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="text-xs py-1 px-2.5 h-7"
                              onClick={() => handleViewPdf(cert)}
                              disabled={isViewing}
                              leftIcon={
                                isViewing ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Eye className="w-3 h-3 text-blue-600" />
                                )
                              }
                            >
                              <span>View PDF</span>
                            </Button>

                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="text-xs py-1 px-2.5 h-7"
                              onClick={() => handleDownloadPdf(cert)}
                              disabled={isDownloading}
                              leftIcon={
                                isDownloading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Download className="w-3 h-3 text-slate-600" />
                                )
                              }
                            >
                              <span>Download</span>
                            </Button>

                            <button
                              type="button"
                              onClick={() => {
                                setReplacingCert(cert);
                                setSelectedFile(null);
                                setFileError(null);
                              }}
                              className="text-[11px] font-medium text-slate-500 hover:text-blue-600 ml-auto inline-flex items-center gap-1 hover:underline"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Replace</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 border border-dashed border-amber-200 text-xs">
                          <span className="text-amber-800 text-[11px]">
                            No certificate document attached
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setReplacingCert(cert);
                              setSelectedFile(null);
                              setFileError(null);
                            }}
                            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 text-xs hover:underline"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload PDF</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Verification URL and Edit/Delete */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      {cert.verificationUrl ? (
                        <a
                          href={cert.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-xs hover:underline"
                        >
                          <span>Verify Online</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">
                          {cert.credentialId ? `ID: ${cert.credentialId}` : 'Campus Placement Record'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(cert)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit certification"
                        aria-label="Edit certification"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCert(cert)}
                        className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete certification"
                        aria-label="Delete certification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Certification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => !submitting && setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span>
                  {editingCert ? 'Edit Certification' : 'Add Course / Certification'}
                </span>
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

            <form onSubmit={handleSaveCert} className="space-y-4">
              {/* Title */}
              <FormField
                id="certTitle"
                label="Certification Name / Title"
                required
                error={formErrors.title}
              >
                <Input
                  id="certTitle"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  error={Boolean(formErrors.title)}
                />
              </FormField>

              {/* Issuing Organization */}
              <FormField
                id="certIssuer"
                label="Issuing Organization"
                required
                error={formErrors.issuer}
              >
                <Input
                  id="certIssuer"
                  placeholder="e.g. Amazon Web Services, NPTEL / IIT, Coursera"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  error={Boolean(formErrors.issuer)}
                />
              </FormField>

              {/* Dates row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  id="certIssueDate"
                  label="Issue Date"
                  required
                  error={formErrors.issueDate}
                >
                  <Input
                    id="certIssueDate"
                    placeholder="e.g. Oct 2026"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    error={Boolean(formErrors.issueDate)}
                  />
                </FormField>

                <FormField id="certExpDate" label="Expiration Date (Optional)">
                  <Input
                    id="certExpDate"
                    placeholder="e.g. Oct 2029 or No Expiration"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  />
                </FormField>
              </div>

              {/* Score / Grade & Credential ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField id="certGrade" label="Score / Grade / Honors">
                  <Input
                    id="certGrade"
                    placeholder="e.g. Elite + Gold (92%)"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  />
                </FormField>

                <FormField id="certCredId" label="Credential ID (Optional)">
                  <Input
                    id="certCredId"
                    placeholder="e.g. AWS-PSA-908234"
                    value={formData.credentialId}
                    onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  />
                </FormField>
              </div>

              {/* Credential Verification URL */}
              <FormField
                id="certUrl"
                label="Verification URL (Optional)"
                hint="Public link to verify certificate online"
                error={formErrors.verificationUrl}
              >
                <Input
                  id="certUrl"
                  type="url"
                  placeholder="https://aws.amazon.com/verification/..."
                  value={formData.verificationUrl}
                  onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
                  error={Boolean(formErrors.verificationUrl)}
                />
              </FormField>

              {/* Skills */}
              <FormField
                id="certSkills"
                label="Skills Covered (comma-separated)"
                hint="e.g. Cloud Architecture, S3, EC2, IAM"
              >
                <Input
                  id="certSkills"
                  placeholder="SQL, Database Normalization, Relational Algebra"
                  value={formData.skillsInput}
                  onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                />
              </FormField>

              {/* Upload Certificate PDF Control */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Upload Certificate PDF{' '}
                  <span className="text-slate-400 font-normal">
                    {editingCert?.certificateFileName ? '(Optional replace)' : '(Optional attachment)'}
                  </span>
                </label>

                {editingCert?.certificateFileName && !selectedFile && (
                  <div className="mb-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700 truncate">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate font-medium">{editingCert.certificateFileName}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">Currently attached</span>
                  </div>
                )}

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {selectedFile ? (
                    <div className="flex items-center justify-between gap-3 text-left bg-white p-2.5 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-6 h-6 text-rose-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {formatFileSize(selectedFile.size)} • Ready to upload
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <UploadCloud className="w-7 h-7 text-blue-600 mx-auto mb-1.5" />
                      <p className="text-xs font-medium text-slate-700">
                        Click to select Certificate PDF
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PDF format only, maximum 5 MB
                      </p>
                    </div>
                  )}
                </div>

                {fileError && (
                  <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fileError}</span>
                  </p>
                )}
              </div>

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
                    : editingCert
                    ? 'Update Certificate'
                    : 'Add Certificate'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Replace / Upload PDF Modal */}
      {replacingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => !submitting && setReplacingCert(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <span>Upload Certificate PDF</span>
              </h3>
              <button
                type="button"
                onClick={() => !submitting && setReplacingCert(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Attaching certificate document for{' '}
              <span className="font-semibold text-slate-900">"{replacingCert.title}"</span>.
            </p>

            <form onSubmit={handleReplacePdf} className="space-y-4">
              <div
                onClick={() => replaceFileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all"
              >
                <input
                  ref={replaceFileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {selectedFile ? (
                  <div className="flex items-center justify-between gap-3 text-left bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-6 h-6 text-rose-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {formatFileSize(selectedFile.size)} • Ready to upload
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (replaceFileInputRef.current) replaceFileInputRef.current.value = '';
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-800">
                      Click to choose Certificate PDF file
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Strictly PDF documents only (maximum 5 MB)
                    </p>
                  </div>
                )}
              </div>

              {fileError && (
                <p className="text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fileError}</span>
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={submitting}
                  onClick={() => setReplacingCert(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting || !selectedFile}
                  leftIcon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                >
                  {submitting ? 'Uploading PDF...' : 'Upload & Save PDF'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => !submitting && setDeletingCert(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 z-10">
            <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              <span>Delete Certification</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-900">"{deletingCert.title}"</span>
              {deletingCert.certificateStorageKey ? ' and its attached PDF certificate file' : ''}?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={submitting}
                onClick={() => setDeletingCert(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={submitting}
                onClick={handleDeleteCertConfirm}
                leftIcon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              >
                {submitting ? 'Deleting...' : 'Delete Certification'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
