import React, { PropsWithChildren, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import JobCreatePage from './pages/jobs/JobCreatePage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import AppLayout from './components/layout/AppLayout';
import SplashLoader from './components/common/SplashLoader';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null; 
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const AppContent = () => {
  const { loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Force splash screen to stay visible for 6 seconds on initial load
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Display the Microchip Splash Loader if minimum time hasn't passed OR auth is still loading
  if (showSplash || authLoading) {
    return <SplashLoader />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="jobs/new" element={<JobCreatePage />} />
        <Route path="jobs/:jobId" element={<JobDetailPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
           <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;