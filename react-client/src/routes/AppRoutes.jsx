import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Authorize from '../pages/Authorize';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Protecting /authorize */}
      <Route
        path="/authorize"
        element={
          <ProtectedRoute>
            <Authorize />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/authorize" replace />} />
    </Routes>
  );
};

export default AppRoutes;
