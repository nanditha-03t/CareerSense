import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PortalSelectionPage from './pages/PortalSelectionPage';
import StudentLoginPage from './pages/StudentLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SkillsPage from './pages/SkillsPage';
import JobsPage from './pages/JobsPage';
import SkillGapPage from './pages/SkillGapPage';
import ApplicationsPage from './pages/ApplicationsPage';
import PreparationPage from './pages/PreparationPage';
import ProjectsPage from './pages/ProjectsPage';
import CertificationsPage from './pages/CertificationsPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Core public authentication & portal routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PortalSelectionPage />} />
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/signin" element={<Navigate to="/student/login" replace />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/register" element={<SignUpPage />} />

        {/* Public placement opportunities browsing */}
        <Route path="/jobs" element={<JobsPage />} />

        {/* Protected placement & dashboard routes requiring student authentication */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <SkillsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-gap"
          element={
            <ProtectedRoute>
              <SkillGapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preparation"
          element={
            <ProtectedRoute>
              <PreparationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certifications"
          element={
            <ProtectedRoute>
              <CertificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
