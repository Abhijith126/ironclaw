import { useState, useEffect } from 'react';
import { Plus, TrendingDown, TrendingUp, Scale as ScaleIcon } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { userAPI } from '../services/api';

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

function WeightTracker({ user, onWeightUpdate }) {
  const [inputWeight, setInputWeight] = useState('');
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightLog, setWeightLog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeightLog();
  }, []);

  const fetchWeightLog = async () => {
    try {
      const response = await userAPI.getWeightLog();
      setWeightLog(response.data.weightLog || []);
    } catch (error) {
      console.error('Error fetching weight log:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputWeight || parseFloat(inputWeight) <= 0) return;

    try {
      const response = await userAPI.addWeight(parseFloat(inputWeight), inputDate);
      setWeightLog(response.data.weightLog || []);
      setInputWeight('');
      if (onWeightUpdate) onWeightUpdate(response.data.weightLog);
    } catch (error) {
      console.error('Error adding weight:', error);
    }
  };

  const sortedLogs = [...weightLog].sort((a, b) => new Date(a.date) - new Date(b.date));
  const recentLogs = sortedLogs.slice(-10).reverse();

  const getTrend = () => {
    if (sortedLogs.length < 2) return null;
    const latest = sortedLogs[sortedLogs.length - 1].weight;
    const previous = sortedLogs[sortedLogs.length - 2].weight;
    return latest - previous;
  };

  const trend = getTrend();
  const currentWeight = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1].weight : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-graphite border border-steel rounded-2xl p-5">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-silver mb-4">
          Log Weight
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-silver">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                placeholder="0.0"
                className="px-4 py-3.5 bg-muted border border-steel rounded-xl text-white placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-silver">
                Date
              </label>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="px-4 py-3.5 bg-muted border border-steel rounded-xl text-white focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputWeight}
            className="flex items-center justify-center gap-2 py-3.5 bg-lime text-obsidian font-semibold rounded-xl hover:bg-lime-dim transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            <span>Add Entry</span>
          </button>
        </form>
      </div>

      {currentWeight && (
        <div className="flex justify-between items-center bg-gradient-to-br from-graphite to-carbon border border-steel rounded-xl p-5">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-silver mr-2">
              Current
            </span>
            <span className="font-display text-4xl font-bold text-white leading-none">
              {currentWeight.toFixed(1)}
            </span>
            <span className="text-sm text-silver">kg</span>
          </div>
          {trend !== null && (
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold ${trend <= 0 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}
            >
              {trend <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              <span>{Math.abs(trend).toFixed(1)}</span>
            </div>
          )}
        </div>
      )}

      {sortedLogs.length > 0 && (
        <div className="bg-graphite border border-steel rounded-2xl p-5">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-silver mb-4">
            Progress
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={sortedLogs.map((w) => ({
                date: new Date(w.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                }),
                weight: parseFloat(w.weight),
              }))}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c6f135" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#c6f135" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#888888' }}
                axisLine={{ stroke: '#2a2a2a' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#888888' }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#c6f135"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#weightGrad)"
                dot={{
                  r: 3,
                  fill: '#c6f135',
                  stroke: '#080808',
                  strokeWidth: 1.5,
                }}
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

      {recentLogs.length > 0 && (
        <div className="bg-graphite border border-steel rounded-2xl p-5">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-silver mb-3">
            Recent
          </h3>
          <div className="flex flex-col gap-1">
            {recentLogs.map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-xl">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-white">
                    {parseFloat(entry.weight).toFixed(1)} kg
                  </span>
                  <span className="text-[10px] text-silver">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {idx === 0 && trend !== null && (
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold ${trend <= 0 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}
                  >
                    {trend <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                    {Math.abs(trend).toFixed(1)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {weightLog.length === 0 && !loading && (
        <div className="bg-graphite border border-steel rounded-2xl p-10 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center text-iron">
            <ScaleIcon size={28} />
          </div>
          <h3 className="font-display text-lg font-bold text-chalk mb-2">No Data Yet</h3>
          <p className="text-sm text-silver max-w-[240px] mx-auto">
            Log your weight above to start tracking your progress over time.
          </p>
        </div>
      )}
    </div>
  );
}

export default WeightTracker;
