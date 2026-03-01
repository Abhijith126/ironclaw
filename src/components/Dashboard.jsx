import React from 'react';
import {
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
  const totalWorkouts = data.weightLog ? data.weightLog.length : 0;
  const weightData = data.weightLog
    ? data.weightLog.map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: parseFloat(entry.weight)
      }))
    : [];

  const weeklyStats = [
    { week: 'W1', completed: 3, total: 3 },
    { week: 'W2', completed: 2, total: 3 },
    { week: 'W3', completed: 3, total: 3 },
    { week: 'W4', completed: 1, total: 3 }
  ];

  const currentStreak = data.completed ? 1 : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gym-charcoal rounded-xl p-5 border border-gym-steel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gym-zinc uppercase tracking-wider">Streak</p>
              <p className="text-2xl font-bold text-white mt-1">{currentStreak} days</p>
            </div>
            <Flame className="text-gym-accent" size={28} />
          </div>
        </div>

        <div className="bg-gym-charcoal rounded-xl p-5 border border-gym-steel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gym-zinc uppercase tracking-wider">Weight Logged</p>
              <p className="text-2xl font-bold text-white mt-1">{totalWorkouts}</p>
              <p className="text-xs text-gym-zinc">entries</p>
            </div>
            <TrendingUp className="text-gym-success" size={28} />
          </div>
        </div>

        <div className="bg-gym-charcoal rounded-xl p-5 border border-gym-steel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gym-zinc uppercase tracking-wider">This Week</p>
              <p className="text-2xl font-bold text-white mt-1">
                {data.completed ? '1' : '0'}/3
              </p>
              <p className="text-xs text-gym-zinc">workouts done</p>
            </div>
            <Calendar className="text-gym-accent" size={28} />
          </div>
        </div>
      </div>

      {weightData.length > 0 && (
        <div className="bg-gym-charcoal rounded-xl p-5 border border-gym-steel">
          <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Weight Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717a' }} stroke="#404040" />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} stroke="#404040" domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '8px' }}
                labelStyle={{ color: '#a1a1aa' }}
              />
              <Area type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-gym-charcoal rounded-xl p-5 border border-gym-steel">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weeklyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#71717a' }} stroke="#404040" />
            <YAxis tick={{ fontSize: 11, fill: '#71717a' }} stroke="#404040" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2d2d2d', borderRadius: '8px' }}
            />
            <Bar dataKey="completed" fill="#f97316" name="Completed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="total" fill="#27272a" name="Scheduled" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gym-zinc mt-4 text-center">
          Track your weekly completion rate
        </p>
      </div>

      {weightData.length === 0 && (
        <div className="bg-gym-muted rounded-xl p-5 border border-gym-steel">
          <h3 className="font-medium text-gym-accent mb-2">Get Started</h3>
          <p className="text-sm text-gym-silver">
            No weight data yet. Go to the Weight tab to log your first entry and see your progress graph here.
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
