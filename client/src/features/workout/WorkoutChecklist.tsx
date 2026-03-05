import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Edit } from 'lucide-react';
import ManageWorkouts from './ManageWorkouts';
import { userAPI, getExerciseMap } from '../../services/api';
import { PageHeader, ExerciseItem, Button, Card, Badge, TipBox } from '../../components/ui';
import { getTodayName, getTomorrowName, getDateKey } from '../../utils';

function WorkoutChecklist() {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [userWeekly, setUserWeekly] = useState(null);
  const [completedMap, setCompletedMap] = useState({});
  const [animatingId, setAnimatingId] = useState(null);
  const [exerciseMap, setExerciseMap] = useState({});
  const [editingPR, setEditingPR] = useState(null);
  const [prValues, setPrValues] = useState({ weight: '', reps: '' });

  const todayName = useMemo(() => getTodayName(), []);
  const tomorrowName = useMemo(() => getTomorrowName(), []);

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

  const saveCallback = () => {
    fetchSchedule();
    setEditing(false);
  };

  const getWorkoutByName = (dayName) => {
    if (userWeekly && userWeekly[dayName]) {
      const exList = (userWeekly[dayName] || []).map((e) => {
        const exercise = exerciseMap[e.id];
        return {
          id: e.id,
          name: exercise?.name || e.id,
          sets: e.sets,
          reps: e.reps,
          pr: e.pr || null,
        };
      });
      return { name: dayName, day: dayName, exercises: exList };
    }
    return { name: t('workout.restDay'), day: dayName, exercises: [] };
  };

  const todaysWorkout = getWorkoutByName(todayName);
  const tomorrowsWorkout = getWorkoutByName(tomorrowName);

  const todayKey = getDateKey();
  const completedToday = completedMap[todayKey] || [];
  const completedCount = todaysWorkout.exercises.filter((ex) =>
    completedToday.includes(ex.id)
  ).length;
  const totalCount = todaysWorkout.exercises.length;
  const isAllComplete = totalCount > 0 && completedCount === totalCount;

  const toggleExerciseDone = async (exId) => {
    setAnimatingId(exId);

    const dayKey = getDateKey();
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
  };

  const markAllDone = async () => {
    const dayKey = getDateKey();
    const copy = { ...completedMap };
    const list = new Set(copy[dayKey] || []);

    todaysWorkout.exercises.forEach((ex) => list.add(ex.id));
    copy[dayKey] = Array.from(list);
    setCompletedMap(copy);

    try {
      for (const ex of todaysWorkout.exercises) {
        await userAPI.logWorkout(ex.id, true);
      }
    } catch (error) {
      console.error('Error logging workout:', error);
    }
  };

  const openEditPR = (exercise) => {
    setEditingPR(exercise.id);
    setPrValues({
      weight: exercise.pr?.weight || '',
      reps: exercise.pr?.reps || '',
    });
  };

  const handlePRChange = (id, field, value) => {
    setPrValues(prev => ({ ...prev, [field]: value }));
  };

  const savePR = async (exerciseId) => {
    const next = { ...userWeekly };
    const dayExercises = next[todayName] || [];
    const idx = dayExercises.findIndex(e => e.id === exerciseId);
    if (idx !== -1) {
      dayExercises[idx] = {
        ...dayExercises[idx],
        pr: { weight: Number(prValues.weight) || null, reps: Number(prValues.reps) || null }
      };
      next[todayName] = dayExercises;
      setUserWeekly(next);
      
      try {
        await userAPI.updateWeeklySchedule({ weeklySchedule: next });
      } catch (err) {
        console.error('Failed to save PR:', err);
      }
    }
    setEditingPR(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader 
        title={t('workout.title')} 
        subtitle={t('workout.trackAndComplete')} 
      />
      
      {editing ? (
        <ManageWorkouts onSave={saveCallback} />
      ) : (
        <>
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white">{t('workout.today')}</h2>
                <p className="text-xs text-silver uppercase tracking-wider mt-0.5">
                  {todaysWorkout.name}
                </p>
              </div>
              {totalCount > 0 && (
                <Badge variant={isAllComplete ? 'success' : 'default'}>
                  <span className={`font-display font-bold ${isAllComplete ? 'text-success' : 'text-lime'}`}>
                    {completedCount}
                  </span>
                  <span className="text-silver text-sm ml-1">/ {totalCount}</span>
                </Badge>
              )}
            </div>

            {totalCount === 0 ? (
              <p className="text-center text-silver py-6">{t('workout.restDayMessage')}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {todaysWorkout.exercises.map((exercise) => {
                  const isDone = completedToday.includes(exercise.id);
                  const showPR = exercise.pr?.weight || editingPR === exercise.id;
                  
                  return (
                    <ExerciseItem
                      key={exercise.id}
                      exercise={exercise}
                      isCompleted={isDone}
                      onToggle={toggleExerciseDone}
                      onEditPR={openEditPR}
                      editingPR={editingPR}
                      prValues={prValues}
                      onPRChange={handlePRChange}
                      onSavePR={savePR}
                      showPR={showPR}
                      doneLabel={t('workout.done')}
                      setPRLabel={t('workout.setYourPR')}
                      updatePRLabel={t('workout.updateYourPR')}
                    />
                  );
                })}
              </div>
            )}

            {totalCount > 0 && !isAllComplete && (
              <Button onClick={markAllDone} className="w-full mt-4">
                <Check size={18} />
                <span>{t('workout.markAllComplete')}</span>
              </Button>
            )}
          </Card>

          {tomorrowsWorkout.exercises.length > 0 ? (
            <Card variant="secondary">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="default">{t('workout.nextUp')}</Badge>
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
            </Card>
          ) : (
            <Card variant="secondary">
              <div className="flex items-center gap-3">
                <Badge variant="primary">{t('workout.tomorrow')}</Badge>
                <span className="font-display font-bold text-white text-sm">{t('workout.restDay')}</span>
              </div>
              <p className="text-xs text-silver mt-2">
                {t('workout.restDayMessage')}
              </p>
            </Card>
          )}

          <Button variant="secondary" onClick={() => setEditing(true)}>
            <Edit size={16} />
            <span>{t('workout.editSchedule')}</span>
          </Button>

          <TipBox>
            {t('workout.dailyTipMessage')}
          </TipBox>
        </>
      )}
    </div>
  );
}

export default WorkoutChecklist;
