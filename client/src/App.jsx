import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Scale, Menu, X, LogOut } from 'lucide-react';
import './App.css';
import Dashboard from './components/Dashboard';
import WorkoutChecklist from './components/WorkoutChecklist';
import WeightTracker from './components/WeightTracker';
import AuthForm from './components/AuthForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
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
            path="/*" 
            element={
              <ProtectedRoute>
                <AppContent user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

function AppContent({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/checklist') || path.includes('/workout')) return 'workout';
    if (path.includes('/weight')) return 'weight';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const navigateTo = (tab) => {
    const routes = { dashboard: '/dashboard', workout: '/checklist', weight: '/weight' };
    navigate(routes[tab]);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/auth');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'workout', label: 'Workout', icon: Dumbbell, path: '/checklist' },
    { id: 'weight', label: 'Progress', icon: Scale, path: '/weight' }
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const getInitials = (name) => name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="flex flex-col min-h-screen bg-obsidian">
      <header className="sticky top-0 z-40 flex justify-between items-center px-5 py-3.5 bg-gradient-to-b from-carbon to-carbon/95 backdrop-blur-xl border-b border-steel">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-transparent border-none text-chalk rounded-xl hover:bg-steel transition-colors active:scale-95"
          >
            <Menu size={22} />
          </button>
          <div className="flex flex-col">
            <span className="font-display text-xl font-extrabold tracking-[0.15em] text-lime leading-none">IRON LOG</span>
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
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeMenu}
          />
          <div className="absolute top-0 left-0 w-[280px] h-full bg-carbon border-r border-steel flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-steel">
              <span className="font-display text-lg font-extrabold tracking-[0.15em] text-lime">IRON LOG</span>
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
              {tabs.map(tab => (
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
                  <span>{tab.id === 'dashboard' ? 'Dashboard' : tab.id === 'workout' ? 'Workout' : 'Progress'}</span>
                </button>
              ))}
            </nav>

            <div className="p-3 border-t border-steel">
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
          {activeTab === 'dashboard' && <Dashboard user={user} />}
          {activeTab === 'workout' && <WorkoutChecklist />}
          {activeTab === 'weight' && <WeightTracker user={user} />}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] bg-gradient-to-t from-obsidian via-carbon to-transparent border-t border-steel">
        {tabs.map(tab => (
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
    </div>
  );
}

export default App;
