import { useState, useEffect, useMemo } from 'react';
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
import { userAPI, getExerciseMap } from '../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-carbon border border-steel rounded-lg px-3 py-2">
        <p className="text-[10px] text-silver uppercase">{label}</p>
        <p className="text-lime font-display font-bold">{payload[0].value} kg</p>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const [weightLog, setWeightLog] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weeklySchedule, setWeeklySchedule] = useState({});
  const [exerciseMap, setExerciseMap] = useState({});

  const todayName = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long' }), []);

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

  const totalLogs = weightLog.length;
  const weightData = [...weightLog]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      weight: parseFloat(entry.weight),
    }));

  const latestWeight = weightData.length > 0 ? weightData[weightData.length - 1].weight : null;
  const startWeight = weightData.length > 0 ? weightData[0].weight : null;
  const weightChange = latestWeight && startWeight ? (latestWeight - startWeight).toFixed(1) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-graphite border border-steel rounded-xl p-4 flex flex-col gap-2">
          <div className="w-9 h-9 rounded-lg bg-lime/15 flex items-center justify-center text-lime">
            <Flame size={18} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-silver">Streak</span>
          <span className="font-display text-2xl font-bold text-white leading-none">
            {currentStreak}
          </span>
          <span className="text-[10px] text-silver">days</span>
        </div>

        <div className="bg-graphite border border-steel rounded-xl p-4 flex flex-col gap-2">
          <div className="w-9 h-9 rounded-lg bg-success/15 flex items-center justify-center text-success">
            <TrendingUp size={18} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-silver">
            Weight Log
          </span>
          <span className="font-display text-2xl font-bold text-white leading-none">
            {totalLogs}
          </span>
          <span className="text-[10px] text-silver">entries</span>
        </div>
      </div>

      {todaysPRs.length > 0 && (
        <div className="bg-gradient-to-br from-lime/10 via-carbon to-carbon border border-lime/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-lime" />
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-lime">
              {todaysPRsComplete ? "Today's PRs" : 'Target PRs'}
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {todaysPRs.map((pr, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-steel/30 last:border-0">
                <span className="text-chalk font-medium">{pr.name}</span>
                <span className="text-lime font-display font-bold">
                  {pr.pr.weight} kg × {pr.pr.reps} reps
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {weightData.length > 0 && (
        <div className="bg-graphite border border-steel rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-silver">
              Weight Progress
            </h3>
            {weightChange && (
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${parseFloat(weightChange) <= 0 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}
              >
                {parseFloat(weightChange) <= 0 ? '↓' : '↑'} {Math.abs(weightChange)} kg
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
              <Tooltip content={<CustomTooltip />} />
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
        </div>
      )}

      {weightData.length === 0 && !loading && (
        <div className="bg-graphite border border-steel rounded-2xl p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center text-iron">
            <Target size={28} />
          </div>
          <h3 className="font-display text-lg font-bold text-chalk mb-2">Start Tracking</h3>
          <p className="text-sm text-silver">
            Log your first weight entry in the Progress tab to see your data here.
          </p>
        </div>
      )}

      <div className="bg-lime/10 border border-lime/20 rounded-xl p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-lime mb-1">Pro Tip</p>
        <p className="text-xs text-silver leading-relaxed">
          Consistency beats intensity. Log your weight regularly for accurate trend tracking.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
