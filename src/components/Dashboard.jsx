import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Calendar, Flame } from 'lucide-react';

function Dashboard({ data }) {
  // Calculate stats
  const totalWorkouts = data.weightLog ? data.weightLog.length : 0;
  const totalDays = data.weightLog ? data.weightLog.length : 0;

  // Weight chart data
  const weightData = data.weightLog
    ? data.weightLog.map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: parseFloat(entry.weight)
      }))
    : [];

  // Weekly completion rate (placeholder - would need historical data)
  const weeklyStats = [
    { week: 'Week 1', completed: 3, total: 3 },
    { week: 'Week 2', completed: 2, total: 3 },
    { week: 'Week 3', completed: 3, total: 3 },
    { week: 'Week 4', completed: 1, total: 3 }
  ];

  const currentStreak = data.completed ? 1 : 0; // Simplified - would need history

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-3xl font-bold text-gray-900">{currentStreak} days</p>
            </div>
            <Flame className="text-orange-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weight Logged</p>
              <p className="text-3xl font-bold text-gray-900">{totalWorkouts}</p>
              <p className="text-xs text-gray-500">entries</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-3xl font-bold text-gray-900">
                {data.completed ? '1' : '0'}/3
              </p>
              <p className="text-xs text-gray-500">workouts done</p>
            </div>
            <Calendar className="text-blue-500" size={32} />
          </div>
        </div>
      </div>

      {/* Weight Trend Chart */}
      {weightData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip />
              <Area type="monotone" dataKey="weight" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weekly Completion Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="completed" fill="#10b981" name="Completed" />
            <Bar dataKey="total" fill="#e5e7eb" name="Scheduled" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Track your weekly completion rate to stay on target
        </p>
      </div>

      {weightData.length === 0 && (
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h3 className="font-medium text-yellow-900 mb-2">📊 Get Started</h3>
          <p className="text-sm text-yellow-800">
            No weight data yet. Go to the Weight tab to log your first entry.
            Start tracking to see your progress graph here.
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
