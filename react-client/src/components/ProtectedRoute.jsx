import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const AUTH_LOGIN_URL = 'http://localhost:5173/login';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      const currentUrl = window.location.href;
      const redirectParam = encodeURIComponent(currentUrl);
      window.location.href = `${AUTH_LOGIN_URL}?redirect=${redirectParam}`;
    }
  }, [user, loading, location]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return children;
}