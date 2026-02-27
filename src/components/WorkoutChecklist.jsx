import React from 'react';
import { getTodaysWorkout } from '../data/workoutTypes';
import { CheckCircle, Circle } from 'lucide-react';

function WorkoutChecklist({ schedule, completed, onComplete }) {
  const todaysWorkout = getTodaysWorkout(schedule);

  if (!todaysWorkout || todaysWorkout.exercises.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Rest Day</h3>
        <p className="text-gray-600">No scheduled workout today. Recovery is key!</p>
      </div>
    );
  }

  const todayKey = new Date().toDateString();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{todaysWorkout.name}</h2>
            <p className="text-sm text-gray-500">{todaysWorkout.day}'s Workout</p>
          </div>
          <button
            onClick={onComplete}
            disabled={completed}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              completed
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {completed ? '✓ Completed' : 'Mark Complete'}
          </button>
        </div>

        <div className="space-y-3">
          {todaysWorkout.exercises.map((exercise, idx) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-400">
                  {completed ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <Circle size={24} />
                  )}
                </span>
                <div>
                  <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                  <p className="text-sm text-gray-500">
                    {exercise.sets} sets × {exercise.reps} reps
                  </p>
                </div>
              </div>
              {completed && (
                <span className="text-green-600 text-sm font-medium">Done</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            This schedule ({schedule}) will auto-reset every Monday. Stay consistent!
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h3>
        <p className="text-sm text-blue-800">
          Log your weights in the Weight tab to track PR progression over time.
          Complete your workouts consistently to build streaks on the dashboard.
        </p>
      </div>
    </div>
  );
}

export default WorkoutChecklist;
