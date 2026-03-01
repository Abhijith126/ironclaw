import React, { useState } from 'react';
import { Plus, TrendingDown, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function WeightTracker({ weightLog, onAdd }) {
  const [inputWeight, setInputWeight] = useState('');
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputWeight || parseFloat(inputWeight) <= 0) return;

    onAdd(parseFloat(inputWeight));
    setInputWeight('');
  };

  const recentLogs = [...weightLog]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const getTrend = () => {
    if (weightLog.length < 2) return null;
    const latest = weightLog[weightLog.length - 1].weight;
    const previous = weightLog[weightLog.length - 2].weight;
    return latest - previous;
  };

  const trend = getTrend();

  return (
    <div className="space-y-5">
      <div className="bg-gym-charcoal rounded-xl p-5 border border-gym-steel">
        <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Log Weight</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gym-zinc mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              placeholder="e.g., 75.5"
              className="w-full px-4 py-2.5 bg-gym-muted border border-gym-steel rounded-lg text-white placeholder-gym-zinc focus:ring-2 focus:ring-gym-accent focus:border-gym-accent outline-none transition"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gym-zinc mb-1">Date</label>
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gym-muted border border-gym-steel rounded-lg text-white focus:ring-2 focus:ring-gym-accent focus:border-gym-accent outline-none transition"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-gym-accent text-white rounded-lg hover:bg-gym-accent-dim flex items-center justify-center gap-2 font-medium text-sm transition-colors"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </form>
      </div>

      {recentLogs.length > 0 && (
        <div className="bg-gym-charcoal rounded-xl p-5 border border-gym-steel">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Recent Entries</h3>
          <div className="space-y-2">
            {recentLogs.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2.5 border-b border-gym-steel last:border-0"
              >
                <div>
                  <span className="font-medium text-white">
                    {parseFloat(entry.weight).toFixed(1)} kg
                  </span>
                  <span className="text-gym-zinc text-xs ml-3">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {idx === 0 && trend !== null && (
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    trend < 0 ? 'text-gym-success' : trend > 0 ? 'text-red-400' : 'text-gym-zinc'
                  }`}>
                    {trend < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                    {Math.abs(trend).toFixed(1)} kg
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {weightLog.length > 0 && (
        <div className="bg-gym-charcoal rounded-xl p-5 border border-gym-steel">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Weight Progress</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weightLog.map(w => ({
              date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              weight: parseFloat(w.weight)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717a' }} stroke="#404040" />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} stroke="#404040" domain={['dataMin - 0.5', 'dataMax + 0.5']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '8px' }}
                labelStyle={{ color: '#a1a1aa' }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4, fill: '#f97316' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {weightLog.length === 0 && (
        <div className="bg-gym-charcoal rounded-xl p-8 text-center border border-gym-steel">
          <div className="text-gym-zinc mb-3 opacity-50">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-white font-medium mb-1">No Weight Data</h3>
          <p className="text-gym-zinc text-sm">Log your first entry above to see your progress graph.</p>
        </div>
      )}
    </div>
  );
}

export default WeightTracker;
