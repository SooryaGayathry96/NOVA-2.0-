import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AudioProvider } from './context/AudioContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { LearningAcademy } from './pages/LearningAcademy';
import { ModuleDetail } from './pages/ModuleDetail';
import { MissionControl } from './pages/MissionControl';
import { MissionDetail } from './pages/MissionDetail';
import { SpaceSimulatorPage } from './pages/SpaceSimulatorPage';
import { QuizList } from './pages/QuizList';
import { QuizPage } from './pages/QuizPage';
import { ProgressTracker } from './pages/ProgressTracker';
import { Leaderboard } from './pages/Leaderboard';
import { NasaExplorer } from './pages/NasaExplorer';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main App Layout
const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-space-950 text-slate-100">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex w-full">
        {user && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all ${user ? '' : 'max-w-7xl'}`}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Cadet & Academy routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/academy"
              element={
                <ProtectedRoute>
                  <LearningAcademy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/academy/:id"
              element={
                <ProtectedRoute>
                  <ModuleDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/missions"
              element={
                <ProtectedRoute>
                  <MissionControl />
                </ProtectedRoute>
              }
            />
            <Route
              path="/missions/:id"
              element={
                <ProtectedRoute>
                  <MissionDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulator"
              element={
                <ProtectedRoute>
                  <SpaceSimulatorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes"
              element={
                <ProtectedRoute>
                  <QuizList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes/:id"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <ProgressTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nasa-explorer"
              element={
                <ProtectedRoute>
                  <NasaExplorer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AudioProvider>
          <AppLayout />
        </AudioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
