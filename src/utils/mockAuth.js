/**
 * Authentication Adapter for CareerSense Frontend
 * Bridges React components with the real Node.js + Express + JWT authentication API.
 * Keeps backward compatibility with existing components while using real backend APIs.
 */

import {
  loginStudent,
  registerStudent,
  logoutUser as realLogout,
  getCurrentUser as realGetCurrentUser,
  isAuthenticated as realIsAuthenticated,
  getToken as realGetToken,
  isAdmin as realIsAdmin,
  verifyServerSession as realVerifyServerSession,
} from './auth';

export const getToken = realGetToken;
export const isAuthenticated = realIsAuthenticated;
export const isAdmin = realIsAdmin;
export const verifyServerSession = realVerifyServerSession;

export function getCurrentUser() {
  const user = realGetCurrentUser();
  if (user) {
    const safeName =
      user.name || user.fullName || user.email?.split('@')[0] || 'User';
    return {
      id: user.id || user._id,
      _id: user.id || user._id,
      fullName: safeName,
      name: safeName,
      email: user.email,
      collegeName: user.college || user.collegeName || '',
      college: user.college || user.collegeName || '',
      branch: user.branch || '',
      graduationYear: user.graduationYear || '',
      role: user.role || 'student',
      ...user,
    };
  }
  return null;
}

export function logoutUser() {
  realLogout();
}

export async function authenticateUser(email, password, portal = null) {
  const result = await loginStudent(email, password, portal);
  return result;
}

export async function registerUser(userData) {
  const result = await registerStudent(userData);
  return result;
}

export function getRegisteredUsers() {
  const active = getCurrentUser();
  return active ? [active] : [];
}

export function findUserByEmail(email) {
  const active = getCurrentUser();
  if (active && active.email.toLowerCase() === email.toLowerCase()) {
    return active;
  }
  return null;
}

export default {
  getToken,
  isAuthenticated,
  isAdmin,
  getCurrentUser,
  logoutUser,
  authenticateUser,
  registerUser,
  getRegisteredUsers,
  findUserByEmail,
  verifyServerSession,
};
