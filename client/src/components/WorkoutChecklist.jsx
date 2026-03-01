import { useEffect, useState, useMemo } from 'react';
import { CheckCircle, Circle, Edit, Check } from 'lucide-react';
import ManageWorkouts from './ManageWorkouts';
import { userAPI, getExerciseMap } from '../services/api';

function WorkoutChecklist() {
  const [editing, setEditing] = useState(false);
  const [userWeekly, setUserWeekly] = useState(null);
  const [completedMap, setCompletedMap] = useState({});
  const [animatingId, setAnimatingId] = useState(null);
  const [exerciseMap, setExerciseMap] = useState({});

  const todayName = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long' }), []);
  const tomorrowName = useMemo(
    () =>
      new Date(Date.now() + 86400000).toLocaleDateString('en-US', {
        weekday: 'long',
      }),
    []
  );

  useEffect(() => {
    fetchSchedule();
    fetchWorkoutLog();
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const map = await getExerciseMap();
      setExerciseMap(map);
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
    }
  };

  useEffect(() => {
    if (!editing) {
      fetchWorkoutLog();
    }
  }, [editing]);

  const fetchSchedule = async () => {
    try {
      const response = await userAPI.getWeeklySchedule();
      const schedule = response.data.weeklySchedule;
      if (schedule && Object.keys(schedule).length > 0) {
        const normalized = {};
        Object.entries(schedule).forEach(([key, value]) => {
          normalized[key] = value || [];
        });
        setUserWeekly(normalized);
      } else {
        const empty = {};
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(
          (day) => (empty[day] = [])
        );
        setUserWeekly(empty);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const fetchWorkoutLog = async () => {
    try {
      const response = await userAPI.getWorkoutLog();
      const workoutLog = response.data.workoutLog || [];

      const map = {};
      workoutLog.forEach((w) => {
        const dateKey = new Date(w.date).toDateString();
        if (!map[dateKey]) map[dateKey] = [];
        if (w.completed) map[dateKey].push(w.exerciseId);
      });
      setCompletedMap(map);
    } catch (error) {
      console.error('Error fetching workout log:', error);
    }
  };

  function saveCallback() {
    fetchSchedule();
    setEditing(false);
  }

  function getWorkoutByName(dayName) {
    if (userWeekly && userWeekly[dayName]) {
      const exList = (userWeekly[dayName] || []).map((e) => {
        const exercise = exerciseMap[e.id];
        return {
          id: e.id,
          name: exercise?.name || e.id,
          sets: e.sets,
          reps: e.reps,
        };
      });
      return { name: dayName, day: dayName, exercises: exList };
    }
    return { name: 'Rest Day', day: dayName, exercises: [] };
  }

  const todaysWorkout = getWorkoutByName(todayName);
  const tomorrowsWorkout = getWorkoutByName(tomorrowName);

  const todayKey = new Date().toDateString();
  const completedToday = completedMap[todayKey] || [];
  const completedCount = todaysWorkout.exercises.filter((ex) =>
    completedToday.includes(ex.id)
  ).length;
  const totalCount = todaysWorkout.exercises.length;
  const isAllComplete = totalCount > 0 && completedCount === totalCount;

  async function toggleExerciseDone(exId) {
    setAnimatingId(exId);

    const dayKey = new Date().toDateString();
    const copy = { ...completedMap };
    const list = new Set(copy[dayKey] || []);

    if (list.has(exId)) {
      list.delete(exId);
    } else {
      list.add(exId);
    }

    copy[dayKey] = Array.from(list);
    setCompletedMap(copy);

    try {
      await userAPI.logWorkout(exId, list.size > 0);
    } catch (error) {
      console.error('Error logging workout:', error);
    }

    setTimeout(() => setAnimatingId(null), 300);
  }

  async function markAllDone() {
    const dayKey = new Date().toDateString();
    const copy = { ...completedMap };
    const list = new Set(copy[dayKey] || []);

    todaysWorkout.exercises.forEach((ex) => list.add(ex.id));
    copy[dayKey] = Array.from(list);
    setCompletedMap(copy);

    try {
      // Mark all exercises as complete
      for (const ex of todaysWorkout.exercises) {
        await userAPI.logWorkout(ex.id, true);
      }
    } catch (error) {
      console.error('Error logging workout:', error);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {editing ? (
        <ManageWorkouts onSave={saveCallback} />
      ) : (
        <>
          <div className="bg-graphite border border-steel rounded-2xl p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white">Today</h2>
                <p className="text-xs text-silver uppercase tracking-wider mt-0.5">
                  {todaysWorkout.name}
                </p>
              </div>
              {totalCount > 0 && (
                <div
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                    isAllComplete ? 'bg-success/15' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`font-display font-bold ${
                      isAllComplete ? 'text-success' : 'text-lime'
                    }`}
                  >
                    {completedCount}
                  </span>
                  <span className="text-silver text-sm">/ {totalCount}</span>
                </div>
              )}
            </div>

            {totalCount === 0 ? (
              <p className="text-center text-silver py-6">Rest day! Take it easy and recover.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {todaysWorkout.exercises.map((exercise) => {
                  const isDone = completedToday.includes(exercise.id);
                  return (
                    <button
                      key={exercise.id}
                      onClick={() => toggleExerciseDone(exercise.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left w-full ${
                        isDone
                          ? 'bg-success/10 border-success/20'
                          : 'bg-muted border-steel active:scale-[0.99]'
                      }`}
                    >
                      <span className={isDone ? 'text-success' : 'text-iron'}>
                        {isDone ? (
                          <CheckCircle size={22} strokeWidth={2.5} />
                        ) : (
                          <Circle size={22} strokeWidth={1.5} />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${
                            isDone ? 'text-white/60 line-through' : 'text-white'
                          }`}
                        >
                          {exercise.name}
                        </p>
                        <p className="text-xs text-silver">
                          {exercise.sets} sets × {exercise.reps}
                        </p>
                      </div>
                      {isDone && (
                        <span className="px-2 py-1 bg-success rounded text-[10px] font-bold uppercase tracking-wider text-white">
                          Done
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {totalCount > 0 && !isAllComplete && (
              <button
                onClick={markAllDone}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-lime text-obsidian font-semibold rounded-xl hover:bg-lime-dim transition-colors active:scale-[0.98]"
              >
                <Check size={18} />
                <span>Mark All Complete</span>
              </button>
            )}
          </div>

          {tomorrowsWorkout.exercises.length > 0 && (
            <div className="bg-graphite border border-steel rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-1 bg-steel text-[10px] font-bold uppercase tracking-wider text-silver rounded">
                  Next Up
                </span>
                <span className="font-display font-bold text-white text-sm">
                  {tomorrowsWorkout.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tomorrowsWorkout.exercises.slice(0, 3).map((ex) => (
                  <span key={ex.id} className="px-3 py-1.5 bg-muted text-xs text-silver rounded-lg">
                    {ex.name}
                  </span>
                ))}
                {tomorrowsWorkout.exercises.length > 3 && (
                  <span className="px-3 py-1.5 text-xs text-lime">
                    +{tomorrowsWorkout.exercises.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-2 py-3 bg-steel text-chalk font-semibold rounded-xl hover:bg-iron transition-colors active:scale-[0.98]"
          >
            <Edit size={16} />
            <span>Edit Schedule</span>
          </button>

          <div className="bg-lime/10 border border-lime/20 rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-lime mb-1">
              Daily Tip
            </p>
            <p className="text-xs text-silver leading-relaxed">
              Complete your workout and tap each exercise to mark it done.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default WorkoutChecklist;
