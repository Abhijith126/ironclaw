import { useEffect, useCallback, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Dumbbell, Scale, UserCircle, Cpu } from 'lucide-react';
import './App.css';
import { ConfirmModal, AlertModal } from './components/ui';
import { useDeviceInsets, useTheme, useImportExport, useAppNavigation } from './hooks';
import { AuthProvider, useAuth } from './contexts';
import { ROUTES } from './constants';

import { Dashboard } from './features/dashboard';
import { WorkoutChecklist } from './features/workout';
import { ExercisesTracker } from './features/exercises';
import { WeightTracker } from './features/weight';
import { Settings } from './features/settings';
import { AboutPage } from './features/about';
import { AuthForm } from './features/auth';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { top: safeAreaTop, bottom: safeAreaBottom } = useDeviceInsets();

  const {
    importData,
    handleExport,
    handleImportClick,
    handleImport,
    confirmImport,
    clearImportData,
    fileInputRef,
  } = useImportExport();

  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'success', title: '', message: '' });

  const { activeTab, tabs, navigateTo } = useAppNavigation(
    {
      home: t('nav.home'),
      workout: t('nav.workout'),
      exercises: t('nav.exercises'),
      progress: t('nav.progress'),
      profile: t('nav.profile'),
    },
    { LayoutDashboard, Dumbbell, Scale, UserCircle, Cpu }
  );

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col min-h-screen bg-obsidian">
      <header
        className="sticky top-0 z-40 flex justify-between items-center px-5 py-3 bg-carbon/95 backdrop-blur-xl border-b border-steel/50"
        style={{
          paddingTop: `${safeAreaTop + 12}px`,
        }}
      >
        <div className="flex flex-col">
          <span className="font-display text-lg font-extrabold tracking-[0.15em] text-lime leading-none">
            IRON LOG
          </span>
          <span className="text-[10px] text-silver uppercase tracking-wider mt-0.5">{today}</span>
        </div>
      </header>

      <main
        className="flex-1 px-5 py-5"
        style={{ paddingBottom: `${safeAreaBottom + 96}px` }}
      >
        <div className="max-w-150 mx-auto">
          <Routes>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path="/checklist" element={<WorkoutChecklist />} />
            <Route path="/exercises" element={<ExercisesTracker />} />
            <Route path={ROUTES.WEIGHT} element={<WeightTracker />} />
            <Route
              path={ROUTES.SETTINGS}
              element={
                <Settings
                  theme={theme}
                  toggleTheme={toggleTheme}
                  onLogout={handleLogout}
                  onExport={handleExport}
                  onImportClick={handleImportClick}
                />
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </div>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-carbon/95 backdrop-blur-xl border-t border-steel/50"
        style={{ paddingBottom: `${safeAreaBottom + 4}px` }}
      >
        <div className="flex justify-around items-start pt-1.5 pb-2 px-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 bg-transparent border-none cursor-pointer transition-all duration-200 ${
                  isActive ? 'text-lime' : 'text-silver active:text-chalk'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-1.5 w-8 h-0.5 bg-lime rounded-b-full shadow-[0_0_12px_rgba(198,241,53,0.4)]" />
                )}
                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span
                  className={`text-[10px] uppercase tracking-wider ${isActive ? 'font-bold' : 'font-medium'}`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <ConfirmModal
        isOpen={!!importData}
        onClose={clearImportData}
        onConfirm={confirmImport}
        title={t('importExport.importConfirm')}
        message={t('importExport.importConfirmMessage')}
        confirmText={t('common.import')}
        danger
      />

      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path={ROUTES.AUTH}
            element={
              user ? (
                <Navigate to={ROUTES.DASHBOARD} replace />
              ) : (
                <AuthForm />
              )
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;
