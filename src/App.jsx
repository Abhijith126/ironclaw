import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import WorkoutChecklist from './components/WorkoutChecklist';
import WeightTracker from './components/WeightTracker';
import { Calendar, Dumbbell, TrendingUp } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('workout');
  const [workoutData, setWorkoutData] = useState(() => {
    const saved = localStorage.getItem('workout-tracker-data');
    return saved ? JSON.parse(saved) : {
      schedule: 'push-pull-legs',
      today: new Date().toDateString(),
      completed: false,
      weightLog: []
    };
  });

  // Auto-reset weekly (Monday)
  useEffect(() => {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('weekly-reset');
    const currentWeek = new Date().getWeekNumber();

    if (lastReset !== currentWeek.toString()) {
      setWorkoutData(prev => ({
        ...prev,
        today,
        completed: false
      }));
      localStorage.setItem('weekly-reset', currentWeek.toString());
    }
  }, [workoutData]);

  // Persist data
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
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'weight', label: 'Weight', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Health & Fitness Tracker</h1>
          <p className="text-sm text-gray-600 mt-1">Build your habit, track your progress</p>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'workout' && (
          <WorkoutChecklist
            schedule={workoutData.schedule}
            completed={workoutData.completed}
            onComplete={markComplete}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard data={workoutData} />
        )}

        {activeTab === 'weight' && (
          <WeightTracker
            weightLog={workoutData.weightLog}
            onAdd={addWeightEntry}
          />
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          Built with zero budget. Your health, your data.
        </div>
      </footer>
    </div>
  );
}

export default App;
