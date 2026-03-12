import { useState, useRef, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Dumbbell, Scale, UserCircle, Cpu } from 'lucide-react';
import './App.css';
import { ConfirmModal, AlertModal } from './components/ui';
import { useDeviceInsets, useTheme } from './hooks';
import { userAPI, getExerciseNameMap } from './services/api';
import { downloadJSON, readJSONFile } from './utils';
import { STORAGE_KEYS, ROUTES } from './constants';

import { Dashboard } from './features/dashboard';
import { WorkoutChecklist } from './features/workout';
import { ExercisesTracker } from './features/exercises';
import { WeightTracker } from './features/weight';
import { Settings } from './features/settings';
import { AboutPage } from './features/about';
import { AuthForm } from './features/auth';
import InstallPage from './components/InstallPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const { theme, toggleTheme } = useTheme();

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

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
                <AuthForm onAuthSuccess={handleAuthSuccess} />
              )
            }
          />
          <Route path={ROUTES.INSTALL} element={<InstallPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContent
                  user={user}
                  onLogout={handleLogout}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  setUser={setUser}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function AppContent({
  user,
  onLogout,
  theme,
  toggleTheme,
  setUser,
}: {
  user: Record<string, unknown> | null;
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
  setUser: (user: Record<string, unknown> | null) => void;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [importData, setImportData] = useState(null);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ isOpen: false, type: 'success', title: '', message: '' });
  const fileInputRef = useRef(null);
  const { top: safeAreaTop, bottom: safeAreaBottom, hasNotch, hasBottomInset } = useDeviceInsets();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/checklist') || path.includes('/workout')) return 'workout';
    if (path.includes('/exercises')) return 'exercises';
    if (path.includes('/weight')) return 'weight';
    if (path.includes('/settings') || path.includes('/about')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const navigateTo = (tab: string) => {
    const routes: Record<string, string> = {
      dashboard: ROUTES.DASHBOARD,
      workout: '/checklist',
      exercises: '/exercises',
      weight: ROUTES.WEIGHT,
      profile: ROUTES.SETTINGS,
    };
    navigate(routes[tab]);
  };

  const handleLogout = () => {
    onLogout();
    navigate(ROUTES.AUTH);
  };

  const handleExport = async () => {
    try {
      const [scheduleRes, exerciseMap] = await Promise.all([
        userAPI.getWeeklySchedule(),
        getExerciseNameMap(),
      ]);
      const schedule = (scheduleRes.data as Record<string, unknown>).weeklySchedule;

      const scheduleWithNames: Record<string, { id: string; name: string; sets: number; reps: number }[]> = {};
      for (const [day, exercises] of Object.entries(schedule || {})) {
        const exList = (exercises as { id: string; sets: number; reps: number }[]) || [];
        scheduleWithNames[day] = exList.map((ex) => ({
          id: ex.id,
          name: (exerciseMap as Record<string, { name: string }>)[ex.id]?.name || ex.id,
          sets: ex.sets,
          reps: ex.reps,
        }));
      }

      const data = { weeklySchedule: scheduleWithNames, exportedAt: new Date().toISOString(), version: '2' };
      const filename = `workout-schedule-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(data, filename);
      setAlert({
        isOpen: true,
        type: 'success',
        title: t('common.success'),
        message: t('importExport.importSuccess'),
      });
    } catch (err) {
      console.error('Export failed:', err);
      setAlert({
        isOpen: true,
        type: 'error',
        title: t('common.error'),
        message: t('importExport.importFailed'),
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = (await readJSONFile(file)) as Record<string, unknown>;

      if (!data.weeklySchedule || typeof data.weeklySchedule !== 'object') {
        setAlert({
          isOpen: true,
          type: 'error',
          title: t('importExport.invalidFormat'),
          message: t('importExport.invalidFormatMessage'),
        });
        return;
      }

      const exerciseMap = (await getExerciseNameMap()) as Record<string, { id: string; name: string }>;
      const exerciseMapById: Record<string, string> = {};
      Object.values(exerciseMap).forEach((info) => {
        exerciseMapById[info.id] = info.name;
      });

      const validDays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];
      const normalized: Record<string, { id: string; sets: number; reps: number }[]> = {};

      for (const day of validDays) {
        const exercises = (data.weeklySchedule as Record<string, unknown>)[day];
        if (Array.isArray(exercises)) {
          normalized[day] = (exercises as { id?: string; name?: string; sets: number; reps: number }[])
            .filter((ex) => ex && (ex.id || ex.name) && ex.sets)
            .map((ex) => {
              const exerciseId = ex.id;
              const exerciseName = ex.name;
              let matchedId: string | null = null;

              if (exerciseId) {
                if (exerciseMapById[exerciseId]) {
                  matchedId = exerciseId;
                } else if (exerciseId.startsWith('wger_')) {
                  matchedId = exerciseId;
                } else if (exerciseId.match(/^[0-9a-f]{24}$/)) {
                  matchedId = exerciseId;
                }
              }

              if (!matchedId && exerciseName) {
                const nameKey = exerciseName.toLowerCase().trim();
                for (const [name, info] of Object.entries(exerciseMap)) {
                  if (name === nameKey || name.replace(/\s+/g, '_') === nameKey) {
                    matchedId = info.id;
                    break;
                  }
                }
              }

              return {
                id: matchedId || exerciseId || exerciseName || 'unknown',
                sets: ex.sets,
                reps: ex.reps,
              };
            });
        } else {
          normalized[day] = [];
        }
      }

      setImportData(normalized);
    } catch (err) {
      console.error('Import failed:', err);
      setAlert({
        isOpen: true,
        type: 'error',
        title: t('importExport.importFailed'),
        message: t('importExport.invalidFormatMessage'),
      });
    }

    e.target.value = '';
  };

  const confirmImport = async () => {
    try {
      await userAPI.updateWeeklySchedule({ weeklySchedule: importData });
      setAlert({
        isOpen: true,
        type: 'success',
        title: t('common.success'),
        message: t('importExport.importSuccess'),
      });
      setImportData(null);
    } catch (err) {
      setAlert({
        isOpen: true,
        type: 'error',
        title: t('common.error'),
        message: t('importExport.importFailed'),
      });
    }
  };

  const tabs = [
    { id: 'dashboard', label: t('nav.home'), icon: LayoutDashboard },
    { id: 'workout', label: t('nav.workout'), icon: Dumbbell },
    { id: 'exercises', label: t('nav.exercises'), icon: Cpu },
    { id: 'weight', label: t('nav.progress'), icon: Scale },
    { id: 'profile', label: t('nav.profile'), icon: UserCircle },
  ];

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
          paddingTop: hasNotch ? `${safeAreaTop + 12}px` : undefined,
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
        style={{ paddingBottom: hasBottomInset ? `${safeAreaBottom + 96}px` : '96px' }}
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
                  user={user}
                  setUser={setUser}
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
        style={{ paddingBottom: hasBottomInset ? `${safeAreaBottom + 4}px` : undefined }}
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
        onClose={() => setImportData(null)}
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

export default App;
