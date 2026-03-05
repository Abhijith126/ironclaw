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
import { LayoutDashboard, Dumbbell, Scale, Menu, X, LogOut, Download, Upload, Cpu, Sun, Moon, Settings as SettingsIcon, Info } from 'lucide-react';
import './App.css';
import { ConfirmModal, AlertModal, LanguageSwitcher } from './components/ui';
import { useDeviceInsets, useTheme } from './hooks';
import { userAPI, getExerciseNameMap } from './services/api';
import { getInitials, downloadJSON, readJSONFile } from './utils';
import { STORAGE_KEYS, ROUTES } from './constants';

import { Dashboard } from './features/dashboard';
import { WorkoutChecklist } from './features/workout';
import { EquipmentTracker } from './features/equipment';
import { ExercisesTracker } from './features/exercises';
import { WeightTracker } from './features/weight';
import { Settings } from './features/settings';
import { AboutPage } from './features/about';
import { AuthForm } from './features/auth';
import InstallPage from './components/InstallPage';
import ProtectedRoute from './components/ProtectedRoute';

const isNativeApp = window.matchMedia('(display-mode: standalone)').matches || 
                    window.navigator.userAgent.includes('wv');

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
          <Route
            path={ROUTES.INSTALL}
            element={<InstallPage />}
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppContent user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} setUser={setUser} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function AppContent({ user, onLogout, theme, toggleTheme, setUser }: { 
  user: Record<string, unknown> | null; 
  onLogout: () => void; 
  theme: string; 
  toggleTheme: () => void; 
  setUser: (user: Record<string, unknown> | null) => void;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [importData, setImportData] = useState(null);
  const [alert, setAlert] = useState<{ isOpen: boolean; type: 'success' | 'error'; title: string; message: string }>({ isOpen: false, type: 'success', title: '', message: '' });
  const fileInputRef = useRef(null);
  const { top: safeAreaTop, bottom: safeAreaBottom, hasNotch, hasBottomInset } = useDeviceInsets();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/checklist') || path.includes('/workout')) return 'workout';
    if (path.includes('/exercises')) return 'exercises';
    if (path.includes('/weight')) return 'weight';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/about')) return 'about';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const navigateTo = (tab) => {
    const routes = {
      dashboard: ROUTES.DASHBOARD,
      workout: '/checklist',
      exercises: '/exercises',
      weight: ROUTES.WEIGHT,
      settings: ROUTES.SETTINGS,
      about: '/about',
    };
    navigate(routes[tab]);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate(ROUTES.AUTH);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleExport = async () => {
    try {
      const [scheduleRes, exerciseMap] = await Promise.all([
        userAPI.getWeeklySchedule(),
        getExerciseNameMap(),
      ]);
      const schedule = (scheduleRes.data as Record<string, unknown>).weeklySchedule;
      
      const scheduleWithNames: Record<string, { id: string; sets: number; reps: number }[]> = {};
      for (const [day, exercises] of Object.entries(schedule || {})) {
        const exList = (exercises as { id: string; sets: number; reps: number }[]) || [];
        scheduleWithNames[day] = exList.map(ex => ({
          id: ((exerciseMap as Record<string, { name: string }>)[ex.id]?.name) || ex.id,
          sets: ex.sets,
          reps: ex.reps,
        }));
      }
      
      const data = { weeklySchedule: scheduleWithNames, exportedAt: new Date().toISOString() };
      const filename = `workout-schedule-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(data, filename);
      closeMenu();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const data = await readJSONFile(file) as Record<string, unknown>;
      
      if (!data.weeklySchedule || typeof data.weeklySchedule !== 'object') {
        setAlert({ isOpen: true, type: 'error', title: 'Invalid Format', message: 'Expected a workout schedule JSON file.' });
        return;
      }

      const exerciseMap = await getExerciseNameMap() as Record<string, { id: string }>;
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const normalized: Record<string, { id: string; sets: number; reps: number }[]> = {};
      
      const idToMongoId: Record<string, string> = {};
      Object.entries(exerciseMap).forEach(([name, info]) => {
        const kebabName = name.replace(/\s+/g, '-').toLowerCase();
        idToMongoId[kebabName] = info.id;
      });
      
      for (const day of validDays) {
        const exercises = (data.weeklySchedule as Record<string, unknown>)[day];
        if (Array.isArray(exercises)) {
          normalized[day] = (exercises as { id: string; sets: number; reps: number }[])
            .filter(ex => ex && ex.id && ex.sets)
            .map(ex => {
              const exerciseKey = String(ex.id).toLowerCase().trim();
              let matchedId: string | null = null;
              
              if (exerciseKey.match(/^[0-9a-f]{24}$/)) {
                matchedId = exerciseKey;
              } else {
                matchedId = idToMongoId[exerciseKey];
                
                if (!matchedId) {
                  for (const [name, info] of Object.entries(exerciseMap)) {
                    if (name === exerciseKey || name.replace(/\s+/g, '-') === exerciseKey) {
                      matchedId = info.id;
                      break;
                    }
                  }
                }
              }
              
              return {
                id: matchedId || ex.id,
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
      setAlert({ isOpen: true, type: 'error', title: 'Import Failed', message: 'Please check the file format.' });
    }
    
    e.target.value = '';
  };

  const confirmImport = async () => {
    try {
      await userAPI.updateWeeklySchedule({ weeklySchedule: importData });
      setAlert({ isOpen: true, type: 'success', title: 'Success!', message: 'Schedule imported successfully!' });
      setImportData(null);
      closeMenu();
    } catch (err) {
      setAlert({ isOpen: true, type: 'error', title: 'Import Failed', message: 'Failed to save schedule.' });
    }
  };

  const tabs = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      path: ROUTES.DASHBOARD,
      showInTab: true,
    },
    { id: 'workout', label: 'Workout', icon: Dumbbell, path: '/checklist', showInTab: true },
    { id: 'exercises', label: 'Exercises', icon: Cpu, path: '/exercises', showInTab: true },
    { id: 'weight', label: 'Progress', icon: Scale, path: ROUTES.WEIGHT, showInTab: true },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, path: ROUTES.SETTINGS, showInTab: false },
  ];

  const bottomNavTabs = tabs.filter(tab => tab.showInTab);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col min-h-screen bg-obsidian">
      <header 
        className="sticky top-0 z-40 flex justify-between items-center px-5 py-3.5 bg-gradient-to-b from-carbon to-carbon/95 backdrop-blur-xl border-b border-steel"
        style={{ 
          paddingTop: hasNotch ? `${safeAreaTop + 14}px` : undefined,
          backgroundColor: '#111111'
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-transparent border-none text-chalk rounded-xl hover:bg-steel transition-colors active:scale-95"
          >
            <Menu size={22} />
          </button>
          <div className="flex flex-col">
            <span className="font-display text-xl font-extrabold tracking-[0.15em] text-lime leading-none">
              IRON LOG
            </span>
            <span className="text-[10px] text-silver uppercase tracking-wider mt-0.5">{today}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lime to-lime-dim flex items-center justify-center font-display font-bold text-sm text-obsidian">
            {getInitials(String(user?.name || ''))}
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-60">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeMenu} />
          <div className="absolute top-0 left-0 w-[280px] h-full bg-carbon border-r border-steel flex flex-col" style={{ paddingBottom: hasBottomInset ? `${safeAreaBottom + 60}px` : '60px' }}>
            <div className="flex justify-between items-center p-5 pt-16 border-b border-steel">
              <span className="font-display text-lg font-extrabold tracking-[0.15em] text-lime">
                IRON LOG
              </span>
              <button
                onClick={closeMenu}
                className="w-9 h-9 flex items-center justify-center bg-transparent border-none text-silver rounded-lg hover:bg-steel hover:text-chalk transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex items-center gap-3.5 p-5 border-b border-steel bg-gradient-to-b from-graphite to-transparent">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime to-lime-dim flex items-center justify-center font-display font-bold text-base text-obsidian">
                {getInitials(String(user?.name || ''))}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white text-sm">{String(user?.name || 'Athlete')}</span>
                <span className="text-[10px] text-silver">{String(user?.email || '')}</span>
              </div>
            </div>

            <nav className="flex-1 p-3 flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigateTo(tab.id)}
                  className={`flex items-center gap-3.5 w-full p-3.5 bg-transparent border-none rounded-xl font-medium text-sm text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-lime/10 text-lime'
                      : 'text-silver hover:bg-steel hover:text-chalk'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>
                    {tab.id === 'dashboard'
                      ? 'Dashboard'
                      : tab.id === 'workout'
                        ? 'Workout'
                        : tab.id === 'exercises'
                          ? 'Exercises'
                          : tab.id === 'weight'
                            ? 'Progress'
                            : 'Settings'}
                  </span>
                </button>
              ))}
            </nav>

            <div className="p-3 border-t border-steel flex flex-col gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 w-full p-3 bg-transparent border-none rounded-xl text-silver text-sm hover:bg-steel hover:text-chalk transition-colors"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                <span>{theme === 'light' ? t('common.darkMode') : t('common.lightMode')}</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-3 w-full p-3 bg-transparent border-none rounded-xl text-silver text-sm hover:bg-steel hover:text-chalk transition-colors"
              >
                <Download size={18} />
                <span>{t('importExport.exportSchedule')}</span>
              </button>
              <button
                onClick={handleImportClick}
                className="flex items-center gap-3 w-full p-3 bg-transparent border-none rounded-xl text-silver text-sm hover:bg-steel hover:text-chalk transition-colors"
              >
                <Upload size={18} />
                <span>{t('importExport.importSchedule')}</span>
              </button>
              <button
                onClick={() => { navigateTo('about'); closeMenu(); }}
                className="flex items-center gap-3 w-full p-3 bg-transparent border-none rounded-xl text-silver text-sm hover:bg-steel hover:text-chalk transition-colors"
              >
                <Info size={18} />
                <span>{t('nav.about')}</span>
              </button>
              
              <div className="pt-2 border-t border-steel">
                <LanguageSwitcher />
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full p-3.5 bg-transparent border border-danger rounded-xl text-danger text-sm font-semibold hover:bg-danger hover:text-white transition-colors"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 px-5 py-5" style={{ paddingBottom: hasBottomInset ? `${safeAreaBottom + 96}px` : '144px' }}>
        <div className="max-w-[600px] mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'workout' && <WorkoutChecklist />}
          {activeTab === 'exercises' && <ExercisesTracker />}
          {activeTab === 'weight' && <WeightTracker />}
          {activeTab === 'settings' && <Settings user={user} setUser={setUser} />}
          {activeTab === 'about' && <AboutPage />}
        </div>
      </main>

      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2 px-3 pb-[max(0.80rem,env(safe-area-inset-bottom,0.80rem))] bg-gradient-to-t from-obsidian via-carbon to-transparent border-t border-steel"
        style={{ paddingBottom: hasBottomInset ? `${safeAreaBottom + 8}px` : undefined }}
      >
        {bottomNavTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigateTo(tab.id)}
            className={`relative flex flex-col items-center gap-1 px-4 py-2 bg-transparent border-none cursor-pointer transition-colors ${activeTab === tab.id ? 'text-lime' : 'text-silver'}`}
          >
            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute -bottom-2 w-6 h-0.5 bg-lime rounded-t-full shadow-[0_0_12px_rgba(198,241,53,0.4)]" />
            )}
          </button>
        ))}
      </nav>

      <ConfirmModal
        isOpen={!!importData}
        onClose={() => setImportData(null)}
        onConfirm={confirmImport}
        title="Import Schedule?"
        message="This will replace your current workout schedule with the imported file."
        confirmText="Import"
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
