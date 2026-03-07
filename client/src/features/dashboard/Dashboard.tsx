import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Flame, Target } from 'lucide-react';
import { userAPI } from '../../services/api';
import { StatCard, Card, TipBox, EmptyState, WeightChart } from '../../components/ui';
import { getTodayName, sortByDate, formatDateShort, calculateWeightChange } from '../../utils';
import { useExerciseMap } from '../../hooks';

function Dashboard() {
  const { t } = useTranslation();
  const [weightLog, setWeightLog] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState({});

  const { exerciseMap } = useExerciseMap();
  const todayName = useMemo(() => getTodayName(), []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [weightRes, workoutRes, scheduleRes] = await Promise.all([
        userAPI.getWeightLog(),
        userAPI.getWorkoutLog(),
        userAPI.getWeeklySchedule(),
      ]);

      setWeightLog(weightRes.data.weightLog || []);
      setWorkoutLog(workoutRes.data.workoutLog || []);
      setCurrentStreak(workoutRes.data.currentStreak || 0);
      setWeeklySchedule(scheduleRes.data.weeklySchedule || {});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const todaysPRs = useMemo(() => {
    const todayExercises = weeklySchedule[todayName] || [];
    return todayExercises
      .filter((e) => e.pr?.weight)
      .map((e) => ({
        name: exerciseMap[e.id]?.name || e.id,
        pr: e.pr,
      }))
      .slice(0, 5);
  }, [weeklySchedule, todayName, exerciseMap]);

  const todaysPRsComplete = useMemo(() => {
    const todayExercises = weeklySchedule[todayName] || [];
    const totalExercises = todayExercises.length;
    const prCount = todayExercises.filter((e) => e.pr?.weight).length;
    return totalExercises > 0 && prCount >= totalExercises;
  }, [weeklySchedule, todayName]);

  const sortedWeightLog = useMemo(() => sortByDate(weightLog, 'date'), [weightLog]);

  const weightData = useMemo(
    () =>
      sortedWeightLog.map((entry) => ({
        date: formatDateShort(entry.date),
        weight: parseFloat(entry.weight),
      })),
    [sortedWeightLog]
  );

  const latestWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : null;
  const startWeight = weightData.length > 0 ? weightData[0].weight : null;
  const weightChange = calculateWeightChange(latestWeight, startWeight);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Flame}
          label={t('dashboard.streak')}
          value={currentStreak}
          unit={t('dashboard.days')}
          variant="default"
        />
        <StatCard
          icon={TrendingUp}
          label={t('dashboard.weightLog')}
          value={weightLog.length}
          unit={t('dashboard.entries')}
          variant="success"
        />
      </div>

      {todaysPRs.length > 0 && (
        <Card variant="gradient">
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-lime" />
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-lime">
              {todaysPRsComplete ? t('dashboard.todaysPRs') : t('dashboard.targetPRs')}
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {todaysPRs.map((pr, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 border-b border-steel/30 last:border-0"
              >
                <span className="text-chalk font-medium">{pr.name}</span>
                <span className="text-lime font-display font-bold">
                  {pr.pr.weight} {t('workout.kg')} × {pr.pr.reps} {t('workout.reps')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {weightData.length > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-silver">
              {t('dashboard.weightProgress')}
            </h3>
            {weightChange && (
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${parseFloat(String(weightChange)) <= 0 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}
              >
                {parseFloat(String(weightChange)) <= 0 ? '↓' : '↑'}{' '}
                {Math.abs(parseFloat(String(weightChange)))} kg
              </span>
            )}
          </div>
          <WeightChart data={weightData} height={200} gradientId="dashboardWeightGrad" />
        </Card>
      )}

      {weightData.length === 0 && !loading && (
        <EmptyState
          icon={Target}
          title={t('dashboard.startTracking')}
          message={t('dashboard.startTrackingMessage')}
        />
      )}

      <TipBox>{t('dashboard.proTipMessage')}</TipBox>
    </div>
  );
}

export default Dashboard;
