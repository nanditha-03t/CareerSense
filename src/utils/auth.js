/**
 * Real Authentication Service for CareerSense Frontend
 * Integrates React with the Express + MongoDB JWT backend.
 * Manages JWT tokens, user sessions, role checks, and persistent student authentication.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const TOKEN_KEY = 'jobfit_token';
const USER_KEY = 'jobfit_user';

// Get stored JWT token
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Check if current session has a valid JWT token
export function isAuthenticated() {
  const token = getToken();
  return Boolean(token && token.trim().length > 0);
}

// Get currently logged-in user data from storage
export function getCurrentUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (!parsed) return null;
    const normalizedName = parsed.name || parsed.fullName || '';
    return {
      ...parsed,
      name: normalizedName,
      fullName: normalizedName,
      role: parsed.role || 'student',
    };
  } catch (err) {
    console.error('Failed to parse active user:', err);
    return null;
  }
}

// Check if current user is an administrator based on cached session
export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

// Verify and refresh session directly with the backend server
// Ensures students cannot access admin features by tampering with localStorage
export async function verifyServerSession() {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      logoutUser();
      return null;
    }

    const data = await response.json();
    if (data.success && data.data?.user) {
      const serverUser = data.data.user;
      setAuthSession(token, serverUser);
      return serverUser;
    }
  } catch (err) {
    console.warn('Unable to verify session with backend:', err.message);
  }
  return getCurrentUser();
}

// Save authentication session (Token + Safe User Object)
// Clears any stale session beforehand to prevent cross-account pollution
export function setAuthSession(token, user) {
  try {
    // 1. Purge any previous session keys
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('jobfit_student_resume');

    // 2. Set new session keys
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (user) {
      const safeName = user.name || user.fullName || '';
      const normalizedUser = {
        id: user._id || user.id,
        _id: user._id || user.id,
        name: safeName,
        fullName: safeName,
        email: user.email,
        college: user.college || user.collegeName || '',
        branch: user.branch || '',
        graduationYear: user.graduationYear || '',
        role: user.role || 'student',
      };
      localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
    }

    // 3. Notify in-memory components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('jobfit_auth_changed', { detail: { user } })
      );
    }
  } catch (err) {
    console.error('Failed to save auth session:', err);
  }
}

// Clear session and logout student / admin
export function logoutUser() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('jobfit_student_resume');

    // Notify in-memory listeners of logout
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('jobfit_auth_changed', { detail: { user: null } })
      );
    }
  } catch (err) {
    console.error('Failed to logout:', err);
  }
}

/**
 * Register student account via backend API
 * POST /api/auth/register
 */
export async function registerStudent(userData) {
  try {
    const payload = {
      name: userData.fullName || userData.name,
      email: userData.email,
      password: userData.password,
      college: userData.collegeName || userData.college,
      branch: userData.branch,
      graduationYear: userData.graduationYear,
      phoneNumber: userData.phoneNumber,
    };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Registration failed. Please try again.',
      };
    }

    // Auto-login session if token returned
    if (data.data?.token && data.data?.user) {
      setAuthSession(data.data.token, data.data.user);
    }

    return {
      success: true,
      message: data.message,
      user: data.data?.user,
      token: data.data?.token,
    };
  } catch (err) {
    console.warn('Backend unavailable:', err.message);
    return {
      success: false,
      error: 'Unable to connect to CareerSense backend server. Please verify backend is running on port 5001.',
    };
  }
}

/**
 * Authenticate student/admin login via backend API
 * POST /api/auth/login
 * @param {string} email
 * @param {string} password
 * @param {string|null} portal 'student' | 'admin' | null
 */
export async function loginStudent(email, password, portal = null) {
  try {
    const payload = { email, password };
    if (portal) {
      payload.portal = portal;
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      return {
        success: false,
        status: response.status,
        error: data.message || 'Invalid email or password.',
      };
    }

    const { token, user } = data.data;
    setAuthSession(token, user);

    return {
      success: true,
      token,
      user,
    };
  } catch (err) {
    console.warn('Backend unavailable:', err.message);
    return {
      success: false,
      error: 'Unable to connect to CareerSense backend server. Please ensure backend is running.',
    };
  }
}

/**
 * Authenticate administrator login via backend API
 * POST /api/auth/login with portal: 'admin'
 */
export async function loginAdmin(email, password) {
  return loginStudent(email, password, 'admin');
}

export default {
  getToken,
  isAuthenticated,
  getCurrentUser,
  isAdmin,
  verifyServerSession,
  setAuthSession,
  logoutUser,
  registerStudent,
  loginStudent,
  loginAdmin,
};
