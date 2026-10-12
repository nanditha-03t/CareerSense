import { getToken, logoutUser } from './auth';

/**
 * CareerSense Centralized API Client
 * Automatically attaches Authorization Bearer token to authenticated requests.
 * Properly handles JSON payloads, FormData multipart uploads, and binary file downloads.
 * Handles token expiration and invalid token responses (401) by clearing session.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token expired / invalid token
    if (response.status === 401) {
      logoutUser();
      // Redirect to login if in browser and not already on auth page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/signin')) {
        window.location.href = '/login?session_expired=true';
      }
    }

    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      ...data,
    };
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error);
    return {
      ok: false,
      success: false,
      message: 'Network error connecting to CareerSense server.',
    };
  }
}

/**
 * Authenticated file download helper
 * Streams file from backend with JWT authentication and triggers native browser save
 */
export async function downloadFile(endpoint, defaultFilename = 'resume.pdf') {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Download failed' }));
    throw new Error(err.message || 'Download failed');
  }

  const blob = await response.blob();

  // Parse filename from Content-Disposition header if available
  const disposition = response.headers.get('Content-Disposition');
  let filename = defaultFilename;
  if (disposition && disposition.includes('filename=')) {
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match && match[1]) {
      filename = decodeURIComponent(match[1].replace(/['"]/g, ''));
    }
  }

  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);

  return filename;
}

/**
 * Authenticated file inline viewing helper
 * Fetches file with JWT auth and opens in a new browser tab
 */
export async function viewFile(endpoint) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Failed to view file' }));
    throw new Error(err.message || 'Unable to open file');
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  window.open(blobUrl, '_blank', 'noopener,noreferrer');
}

export default apiRequest;
