import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuthStore } from '../stores/authStore';
import { PageTransition } from '../components/common/PageTransition';

// Auth pages
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage';

// Main pages
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { DocumentListPage } from '../features/documents/pages/DocumentListPage';
import { DocumentUploadPage } from '../features/documents/pages/DocumentUploadPage';
import { ProcessingScreenPage } from '../features/documents/pages/ProcessingScreenPage';
import { DocumentViewerPage } from '../features/documents/pages/DocumentViewerPage';
import { ExtractedDataScreenPage } from '../features/digitization/pages/ExtractedDataScreenPage';
import { VerificationScreenPage } from '../features/verification/pages/VerificationScreenPage';
import { ValidationScreenPage } from '../features/validation/pages/ValidationScreenPage';
import { LandRecordListPage } from '../features/land-records/pages/LandRecordListPage';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage';
import { AuditLogsPage } from '../features/audit/pages/AuditLogsPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Auth Routes with PageTransition */}
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <RegisterPage />
            </PageTransition>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PageTransition>
              <ForgotPasswordPage />
            </PageTransition>
          }
        />

        {/* Protected Application Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          {/* Document routes */}
          <Route path="documents" element={<DocumentListPage />} />
          <Route path="documents/upload" element={<DocumentUploadPage />} />
          <Route path="documents/processing" element={<ProcessingScreenPage />} />
          <Route path="documents/viewer" element={<DocumentViewerPage />} />

          {/* Digitization & Extraction */}
          <Route path="digitization/extracted-data" element={<ExtractedDataScreenPage />} />

          {/* Verification & Discrepancy */}
          <Route path="verification" element={<VerificationScreenPage />} />

          {/* Validation Engine */}
          <Route path="validation" element={<ValidationScreenPage />} />

          {/* Land Records & GIS */}
          <Route path="land-records" element={<LandRecordListPage />} />

          {/* Analytics & Audit */}
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="audit" element={<AuditLogsPage />} />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};
