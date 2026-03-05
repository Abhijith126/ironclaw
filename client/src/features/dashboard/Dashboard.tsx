import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Flame, Target } from 'lucide-react';
import { userAPI, getExerciseMap } from '../../services/api';
import { StatCard, Card, TipBox, EmptyState, ChartTooltip } from '../../components/ui';
import { getTodayName, sortByDate, formatDateShort, calculateWeightChange } from '../../utils';

function Dashboard() {
  const { t } = useTranslation();
  const [weightLog, setWeightLog] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [exerciseMap, setExerciseMap] = useState({});

  const todayName = useMemo(() => getTodayName(), []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [weightRes, workoutRes, scheduleRes, exerciseMapData] = await Promise.all([
        userAPI.getWeightLog(),
        userAPI.getWorkoutLog(),
        userAPI.getWeeklySchedule(),
        getExerciseMap(),
      ]);

      setWeightLog(weightRes.data.weightLog || []);
      setWorkoutLog(workoutRes.data.workoutLog || []);
      setCurrentStreak(workoutRes.data.currentStreak || 0);
      setWeeklySchedule(scheduleRes.data.weeklySchedule || {});
      setExerciseMap(exerciseMapData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const todaysPRs = useMemo(() => {
    const todayExercises = weeklySchedule[todayName] || [];
    return todayExercises
      .filter(e => e.pr?.weight)
      .map(e => ({
        name: exerciseMap[e.id]?.name || e.id,
        pr: e.pr,
      }))
      .slice(0, 5);
  }, [weeklySchedule, todayName, exerciseMap]);

  const todaysPRsComplete = useMemo(() => {
    const todayExercises = weeklySchedule[todayName] || [];
    const totalExercises = todayExercises.length;
    const prCount = todayExercises.filter(e => e.pr?.weight).length;
    return totalExercises > 0 && prCount >= totalExercises;
  }, [weeklySchedule, todayName]);

  const sortedWeightLog = useMemo(() => 
    sortByDate(weightLog, 'date'), 
    [weightLog]
  );

  const weightData = useMemo(() => 
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
              <div key={idx} className="flex justify-between items-center py-2 border-b border-steel/30 last:border-0">
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
                {parseFloat(String(weightChange)) <= 0 ? '↓' : '↑'} {Math.abs(parseFloat(String(weightChange)))} kg
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c6f135" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c6f135" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#888888' }}
                axisLine={{ stroke: '#2a2a2a' }}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#888888' }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip content={<ChartTooltip valueLabel="kg" />} />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#c6f135"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#weightGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#c6f135',
                  stroke: '#080808',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {weightData.length === 0 && !loading && (
        <EmptyState
          icon={Target}
          title={t('dashboard.startTracking')}
          message={t('dashboard.startTrackingMessage')}
        />
      )}

      <TipBox>
        {t('dashboard.proTipMessage')}
      </TipBox>
    </div>
  );
}

export default Dashboard;
