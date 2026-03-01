import React, { useEffect, useState } from 'react';
import { workoutSchedules } from '../data/workoutTypes';
import { CheckCircle, Circle, Edit, Check, X } from 'lucide-react';
import ManageWorkouts from './ManageWorkouts';

function WorkoutChecklist({ schedule, completed, onComplete }) {
  const [editing, setEditing] = useState(false);
  const [userWeekly, setUserWeekly] = useState(null);
  const [completedMap, setCompletedMap] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('user-weekly');
    setUserWeekly(saved ? JSON.parse(saved) : null);

    const done = JSON.parse(localStorage.getItem('completed-exercises') || '{}');
    setCompletedMap(done);
  }, []);

  function saveCallback() {
    const saved = localStorage.getItem('user-weekly');
    setUserWeekly(saved ? JSON.parse(saved) : null);
    setEditing(false);
  }

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const tomorrowName = new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'long' });

  function getWorkoutByName(dayName) {
    if (userWeekly && userWeekly[dayName]) {
      const exList = (userWeekly[dayName] || []).map(e => ({ id: e.id, name: e.id, sets: e.sets, reps: e.reps }));
      // Try to get names from workoutSchedules
      exList.forEach(item => {
        Object.values(workoutSchedules).forEach(sch => {
          sch.weekly.forEach(d => {
            const found = (d.exercises || []).find(x => x.id === item.id);
            if (found) item.name = found.name;
          });
        });
      });
      return { name: `${dayName} (Custom)`, day: dayName, exercises: exList };
    }

    // fallback to default schedules
    const scheduleObj = workoutSchedules[schedule];
    if (!scheduleObj) return { name: 'Rest Day', day: dayName, exercises: [] };
    const found = scheduleObj.weekly.find(d => d.day === dayName);
    return found || { name: 'Rest Day', day: dayName, exercises: [] };
  }

  const todaysWorkout = getWorkoutByName(todayName);
  const tomorrowsWorkout = getWorkoutByName(tomorrowName);

  function toggleExerciseDone(exId) {
    const dayKey = new Date().toDateString();
    const copy = { ...(completedMap || {}) };
    const list = new Set(copy[dayKey] || []);
    if (list.has(exId)) list.delete(exId); else list.add(exId);
    copy[dayKey] = Array.from(list);
    setCompletedMap(copy);
    localStorage.setItem('completed-exercises', JSON.stringify(copy));
  }

  function markAllDone() {
    const dayKey = new Date().toDateString();
    const copy = { ...(completedMap || {}) };
    const list = new Set(copy[dayKey] || []);
    
    // Add all exercises for today to the completed list
    todaysWorkout.exercises.forEach(ex => {
      list.add(ex.id);
    });
    
    copy[dayKey] = Array.from(list);
    setCompletedMap(copy);
    localStorage.setItem('completed-exercises', JSON.stringify(copy));
    
    // Call the onComplete callback if provided
    if (onComplete) onComplete();
  }
  
  // Check if any exercises are incomplete (at least one unchecked)
  const hasIncomplete = todaysWorkout.exercises.length > 0 && 
                        todaysWorkout.exercises.some(ex => 
                          !(completedMap[new Date().toDateString()] || []).includes(ex.id)
                        );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div />
        <div className="flex items-center gap-2">
          <button onClick={() => setEditing(e => !e)} className="px-3 py-1 rounded bg-gym-muted text-white flex items-center gap-2">
            {editing ? <X size={16} /> : <Edit size={16} />}
            {editing ? 'Close Editor' : 'Edit Schedule'}
          </button>
          {!editing && (
            <button
              onClick={hasIncomplete ? markAllDone : onComplete}
              disabled={!hasIncomplete}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
               hasIncomplete
                  ? 'bg-[var(--accent)]/20 text-white hover:bg-[var(--accent)]/30'
                  : 'bg-[var(--success)]/20 text-[var(--success)] cursor-default'
              }`}
            >
              <Check size={18} />
              {hasIncomplete ? 'Mark Complete' : 'Done'}
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <ManageWorkouts scheduleKey={schedule} onSave={saveCallback} />
      ) : (
        <>
          <div className="bg-gym-charcoal rounded-xl p-5 border border-gym-steel">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">{todaysWorkout.name}</h2>
                <p className="text-xs text-gym-zinc uppercase tracking-wider">{todaysWorkout.day}'s Workout</p>
              </div>
            </div>

            <div className="space-y-2">
              {todaysWorkout.exercises.map((exercise) => {
                const doneList = completedMap[new Date().toDateString()] || [];
                const isDone = doneList.includes(exercise.id);
                return (
                  <div
                    key={exercise.id}
                    className="flex items-center justify-between p-4 bg-gym-muted rounded-lg border border-gym-steel"
                  >
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleExerciseDone(exercise.id)} className="text-gym-zinc">
                        {isDone ? (
                          <CheckCircle className="text-gym-success" size={22} />
                        ) : (
                          <Circle size={22} className="text-gym-slate" />
                        )}
                      </button>
                      <div>
                        <h4 className="font-medium text-white">{exercise.name}</h4>
                        <p className="text-xs text-gym-zinc">{exercise.sets} sets × {exercise.reps} reps</p>
                      </div>
                    </div>
                    {isDone && (
                      <span className="text-gym-success text-xs font-medium">Done</span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gym-zinc mt-4 pt-4 border-t border-gym-steel">Schedule ({schedule}) resets every Monday.</p>
          </div>

          <div className="bg-gym-muted rounded-xl p-5 border border-gym-steel">
            <h3 className="font-medium text-white text-sm mb-2">Next: {tomorrowsWorkout.name}</h3>
            <div className="space-y-2">
              {tomorrowsWorkout.exercises.map(ex => (
                <div key={ex.id} className="flex items-center gap-3 p-3 bg-gym-charcoal rounded">
                  <Circle size={18} className="text-gym-slate" />
                  <div>
                    <div className="text-white text-sm">{ex.name}</div>
                    <div className="text-xs text-gym-zinc">{ex.sets} sets × {ex.reps} reps</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gym-zinc mt-3">Next day's workouts are shown for planning and are not editable here.</p>
          </div>
        </>
      )}

      <div className="bg-gym-muted rounded-xl p-4 border border-gym-steel">
        <h3 className="font-medium text-gym-accent text-sm mb-1">Pro Tip</h3>
        <p className="text-xs text-gym-silver">Log weights in the Weight tab to track PRs. Complete workouts consistently to build streaks.</p>
      </div>
    </div>
  );
}

export default WorkoutChecklist;
