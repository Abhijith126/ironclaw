import { useState, useRef, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Scale, Menu, X, LogOut, Download, Upload, Cpu, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import './App.css';
import Dashboard from './components/Dashboard';
import WorkoutChecklist from './components/WorkoutChecklist';
import EquipmentTracker from './components/EquipmentTracker';
import WeightTracker from './components/WeightTracker';
import Settings from './components/Settings';
import InstallApp from './components/InstallApp';
import AuthForm from './components/AuthForm';
import ProtectedRoute from './components/ProtectedRoute';
import { userAPI, getExerciseNameMap } from './services/api';
import { ConfirmModal, AlertModal } from './components/Modal';
import { useDeviceInsets } from './hooks/useDeviceInsets';

// Detect if running as native app
const isNativeApp = window.matchMedia('(display-mode: standalone)').matches || 
                    window.navigator.userAgent.includes('wv');

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/auth"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthForm onAuthSuccess={handleAuthSuccess} />
              )
            }
          />
          <Route
            path="/install"
            element={<InstallApp />}
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

function AppContent({ user, onLogout, theme, toggleTheme, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [importData, setImportData] = useState(null);
  const [alert, setAlert] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const fileInputRef = useRef(null);
  const { top: safeAreaTop, bottom: safeAreaBottom, hasNotch, hasBottomInset } = useDeviceInsets();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/checklist') || path.includes('/workout')) return 'workout';
    if (path.includes('/equipment')) return 'equipment';
    if (path.includes('/weight')) return 'weight';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const navigateTo = (tab) => {
    const routes = {
      dashboard: '/dashboard',
      workout: '/checklist',
      equipment: '/equipment',
      weight: '/weight',
      settings: '/settings',
    };
    navigate(routes[tab]);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/auth');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleExport = async () => {
    try {
      const [scheduleRes, exerciseMap] = await Promise.all([
        userAPI.getWeeklySchedule(),
        getExerciseNameMap(),
      ]);
      const schedule = scheduleRes.data.weeklySchedule;
      
      const scheduleWithNames = {};
      for (const [day, exercises] of Object.entries(schedule || {})) {
        scheduleWithNames[day] = (exercises || []).map(ex => ({
          id: exerciseMap[ex.id]?.name || ex.id,
          sets: ex.sets,
          reps: ex.reps,
        }));
      }
      
      const data = JSON.stringify({ weeklySchedule: scheduleWithNames, exportedAt: new Date().toISOString() }, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workout-schedule-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      closeMenu();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.weeklySchedule || typeof data.weeklySchedule !== 'object') {
        setAlert({ isOpen: true, type: 'error', title: 'Invalid Format', message: 'Expected a workout schedule JSON file.' });
        return;
      }

      const exerciseMap = await getExerciseNameMap();
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const normalized = {};
      
      // Also create a reverse map from ID (kebab-case) to MongoDB ID
      const idToMongoId = {};
      Object.entries(exerciseMap).forEach(([name, info]) => {
        const kebabName = name.replace(/\s+/g, '-').toLowerCase();
        idToMongoId[kebabName] = info.id;
      });
      
      for (const day of validDays) {
        const exercises = data.weeklySchedule[day];
        if (Array.isArray(exercises)) {
          normalized[day] = exercises
            .filter(ex => ex && ex.id && ex.sets)
            .map(ex => {
              const exerciseKey = ex.id.toLowerCase().trim();
              let matchedId = null;
              
              // Check if it's already a valid MongoDB ObjectId (24 hex chars)
              if (exerciseKey.match(/^[0-9a-f]{24}$/)) {
                matchedId = exerciseKey;
              } else {
                // Try to find by kebab-case ID first
                matchedId = idToMongoId[exerciseKey];
                
                // Try by name (case insensitive)
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
      path: '/dashboard',
    },
    { id: 'workout', label: 'Workout', icon: Dumbbell, path: '/checklist' },
    { id: 'equipment', label: 'Equipment', icon: Cpu, path: '/equipment' },
    { id: 'weight', label: 'Progress', icon: Scale, path: '/weight' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings' },
  ];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const getInitials = (name) =>
    name
      ?.split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <div className="flex flex-col min-h-screen bg-obsidian">
      <header 
        className="sticky top-0 z-40 flex justify-between items-center px-5 py-3.5 bg-gradient-to-b from-carbon to-carbon/95 backdrop-blur-xl border-b border-steel"
        style={{ paddingTop: hasNotch ? `${safeAreaTop + 14}px` : undefined }}
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
            {getInitials(user?.name)}
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-60">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeMenu} />
          <div className="absolute top-0 left-0 w-[280px] h-full bg-carbon border-r border-steel flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-steel">
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
                {getInitials(user?.name)}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white text-sm">{user?.name || 'Athlete'}</span>
                <span className="text-[10px] text-silver">{user?.email || ''}</span>
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
                        : tab.id === 'equipment'
                          ? 'Equipment'
                          : tab.id === 'weight'
                            ? 'Progress'
                            : 'Settings'}
                  </span>
                </button>
              ))}
            </nav>

            <div className="p-3 border-t border-steel flex flex-col gap-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 w-full p-3 bg-transparent border-none rounded-xl text-silver text-sm hover:bg-steel hover:text-chalk transition-colors"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
              {!isNativeApp && (
                <button
                  onClick={() => navigate('/install')}
                  className="flex items-center gap-3 w-full p-3 bg-transparent border-none rounded-xl text-silver text-sm hover:bg-steel hover:text-chalk transition-colors"
                >
                  <Download size={18} />
                  <span>Get App</span>
                </button>
              )}
              <button
                onClick={handleExport}
                className="flex items-center gap-3 w-full p-3 bg-transparent border-none rounded-xl text-silver text-sm hover:bg-steel hover:text-chalk transition-colors"
              >
                <Download size={18} />
                <span>Export Schedule</span>
              </button>
              <button
                onClick={handleImportClick}
                className="flex items-center gap-3 w-full p-3 bg-transparent border-none rounded-xl text-silver text-sm hover:bg-steel hover:text-chalk transition-colors"
              >
                <Upload size={18} />
                <span>Import Schedule</span>
              </button>
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

      <main className="flex-1 px-5 py-5 pb-24">
        <div className="max-w-[600px] mx-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'workout' && <WorkoutChecklist />}
          {activeTab === 'equipment' && <EquipmentTracker />}
          {activeTab === 'weight' && <WeightTracker />}
          {activeTab === 'settings' && <Settings user={user} setUser={setUser} />}
        </div>
      </main>

      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] bg-gradient-to-t from-obsidian via-carbon to-transparent border-t border-steel"
        style={{ paddingBottom: hasBottomInset ? `${safeAreaBottom + 8}px` : undefined }}
      >
        {tabs.map((tab) => (
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
