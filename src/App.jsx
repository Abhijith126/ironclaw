import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import WorkoutChecklist from './components/WorkoutChecklist';
import WeightTracker from './components/WeightTracker';
import { LayoutDashboard, Dumbbell, Scale } from 'lucide-react';

// ISO week number helper (Monday-based weeks)
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workoutData, setWorkoutData] = useState(() => {
    const saved = localStorage.getItem('workout-tracker-data');
    return saved ? JSON.parse(saved) : {
      schedule: 'push-pull-legs',
      today: new Date().toDateString(),
      completed: false,
      weightLog: []
    };
  });

  useEffect(() => {
    const now = new Date();
    const today = now.toDateString();
    const lastReset = localStorage.getItem('weekly-reset');
    const currentWeek = getWeekNumber(now);

    if (lastReset !== currentWeek.toString()) {
      setWorkoutData(prev => ({
        ...prev,
        today,
        completed: false
      }));
      localStorage.setItem('weekly-reset', currentWeek.toString());
    }
  }, [workoutData]);

  useEffect(() => {
    localStorage.setItem('workout-tracker-data', JSON.stringify(workoutData));
  }, [workoutData]);

  const markComplete = () => {
    setWorkoutData(prev => ({ ...prev, completed: true }));
  };

  const addWeightEntry = (weight) => {
    setWorkoutData(prev => ({
      ...prev,
      weightLog: [...prev.weightLog, { date: new Date().toISOString(), weight }]
    }));
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workout', label: 'Workouts', icon: Dumbbell },
    { id: 'weight', label: 'Weight', icon: Scale }
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-gym-black">
      <header className="shrink-0 px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4">
        <h1 className="font-display font-bold text-xl tracking-tight text-white">
          Workout Tracker
        </h1>
        <p className="text-gym-zinc text-sm mt-0.5">Build the habit. Track the gains.</p>
      </header>

      <main className="flex-1 overflow-auto px-4 pb-24">
        {activeTab === 'dashboard' && (
          <Dashboard data={workoutData} />
        )}

        {activeTab === 'workout' && (
          <WorkoutChecklist
            schedule={workoutData.schedule}
            completed={workoutData.completed}
            onComplete={markComplete}
          />
        )}

        {activeTab === 'weight' && (
          <WeightTracker
            weightLog={workoutData.weightLog}
            onAdd={addWeightEntry}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gym-charcoal/95 backdrop-blur-md border-t border-gym-steel safe-area-bottom">
        <div className="max-w-lg mx-auto flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-gym-accent'
                  : 'text-gym-zinc hover:text-gym-silver'
              }`}
            >
              <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
