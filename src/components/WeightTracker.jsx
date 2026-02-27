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

  // Calculate trend
  const getTrend = () => {
    if (weightLog.length < 2) return null;
    const latest = weightLog[weightLog.length - 1].weight;
    const previous = weightLog[weightLog.length - 2].weight;
    return latest - previous;
  };

  const trend = getTrend();

  return (
    <div className="space-y-6">
      {/* Log Entry Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Log Weight</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              placeholder="e.g., 75.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={18} />
              Add Entry
            </button>
          </div>
        </form>
      </div>

      {/* Recent Logs */}
      {recentLogs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
          <div className="space-y-2">
            {recentLogs.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <span className="font-medium text-gray-900">
                    {parseFloat(entry.weight).toFixed(1)} kg
                  </span>
                  <span className="text-gray-500 text-sm ml-3">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {idx === 0 && trend !== null && (
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    trend < 0 ? 'text-green-600' : trend > 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {trend < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                    {Math.abs(trend).toFixed(1)} kg
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weight Chart */}
      {weightLog.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightLog.map(w => ({
              date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              weight: parseFloat(w.weight)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" domain={['dataMin - 0.5', 'dataMax + 0.5']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, fill: '#3b82f6' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {weightLog.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
          <div className="text-gray-400 mb-3">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-gray-900 font-medium mb-1">No Weight Data</h3>
          <p className="text-gray-600 text-sm">Start logging your weight to track progress over time.</p>
        </div>
      )}
    </div>
  );
}

export default WeightTracker;
