// Predefined workout schedules
export const workoutSchedules = {
  'push-pull-legs': {
    name: 'Push/Pull/Legs',
    description: '3-day split: Push (chest/shoulders/triceps), Pull (back/biceps), Legs',
    weekly: [
      {
        day: 'Monday',
        name: 'Push Day',
        exercises: [
          { id: 'bench', name: 'Bench Press', sets: 4, reps: '8-12' },
          { id: 'ohp', name: 'Overhead Press', sets: 4, reps: '8-12' },
          { id: 'tri', name: 'Tricep Pushdowns', sets: 3, reps: '10-15' },
          { id: 'dips', name: 'Dips', sets: 3, reps: '10-15' },
          { id: 'fly', name: 'Cable Flyes', sets: 3, reps: '12-15' }
        ]
      },
      {
        day: 'Tuesday',
        name: 'Pull Day',
        exercises: [
          { id: 'deadlift', name: 'Deadlifts', sets: 4, reps: '5-8' },
          { id: 'latpulldown', name: 'Lat Pulldown', sets: 4, reps: '8-12' },
          { id: 'bcurls', name: 'Barbell Curls', sets: 3, reps: '8-12' },
          { id: 'rows', name: 'Seated Rows', sets: 3, reps: '10-12' },
          { id: 'facepull', name: 'Face Pulls', sets: 3, reps: '15-20' }
        ]
      },
      {
        day: 'Wednesday',
        name: 'Legs Day',
        exercises: [
          { id: 'squat', name: 'Barbell Squats', sets: 4, reps: '6-10' },
          { id: 'rdl', name: 'Romanian Deadlifts', sets: 4, reps: '8-12' },
          { id: 'legpress', name: 'Leg Press', sets: 3, reps: '10-15' },
          { id: 'calf', name: 'Calf Raises', sets: 4, reps: '15-20' },
          { id: 'extensions', name: 'Leg Extensions', sets: 3, reps: '12-15' }
        ]
      },
      {
        day: 'Thursday',
        name: 'Rest Day',
        exercises: []
      },
      {
        day: 'Friday',
        name: 'Push Day',
        exercises: [
          { id: 'inclinebench', name: 'Incline Bench', sets: 4, reps: '8-12' },
          { id: 'lateral', name: 'Lateral Raises', sets: 4, reps: '10-15' },
          { id: 'pushups', name: 'Push-ups', sets: 3, reps: 'AMRAP' },
          { id: 'skullcrusher', name: 'Skull Crushers', sets: 3, reps: '10-12' },
          { id: 'overheadtri', name: 'Overhead Tricep', sets: 3, reps: '12-15' }
        ]
      },
      {
        day: 'Saturday',
        name: 'Pull Day',
        exercises: [
          { id: 'pullups', name: 'Pull-ups', sets: 4, reps: 'AMRAP' },
          { id: 'barbellrow', name: 'Barbell Row', sets: 4, reps: '8-12' },
          { id: 'hammercurl', name: 'Hammer Curls', sets: 3, reps: '10-12' },
          { id: 'cablecol', name: 'Cable Row', sets: 3, reps: '10-12' },
          { id: 'shrug', name: 'Shoulder Shrugs', sets: 3, reps: '12-15' }
        ]
      },
      {
        day: 'Sunday',
        name: 'Legs Day',
        exercises: [
          { id: 'frontsquat', name: 'Front Squats', sets: 4, reps: '6-10' },
          { id: 'lunges', name: 'Walking Lunges', sets: 3, reps: '10-12' },
          { id: 'legcurl', name: 'Leg Curls', sets: 3, reps: '12-15' },
          { id: 'abmachine', name: 'Ab Machine', sets: 4, reps: '15-20' },
          { id: 'seatedcalf', name: 'Seated Calf', sets: 4, reps: '15-20' }
        ]
      }
    ]
  },
  'full-body': {
    name: 'Full Body',
    description: '3-day full body workouts with compound movements',
    weekly: [
      {
        day: 'Monday',
        name: 'Full Body A',
        exercises: [
          { id: 'squat', name: 'Squats', sets: 4, reps: '6-10' },
          { id: 'bench', name: 'Bench Press', sets: 4, reps: '8-12' },
          { id: 'rows', name: 'Rows', sets: 4, reps: '8-12' },
          { id: 'ohp', name: 'Overhead Press', sets: 3, reps: '8-12' },
          { id: 'plank', name: 'Plank', sets: 3, reps: '60s' }
        ]
      },
      {
        day: 'Wednesday',
        name: 'Full Body B',
        exercises: [
          { id: 'deadlift', name: 'Deadlifts', sets: 3, reps: '5-8' },
          { id: 'inclinebench', name: 'Incline Bench', sets: 4, reps: '8-12' },
          { id: 'pullups', name: 'Pull-ups', sets: 4, reps: 'AMRAP' },
          { id: 'dips', name: 'Dips', sets: 3, reps: 'AMRAP' },
          { id: 'crunches', name: 'Crunches', sets: 3, reps: '20' }
        ]
      },
      {
        day: 'Friday',
        name: 'Full Body C',
        exercises: [
          { id: 'frontsquat', name: 'Front Squats', sets: 4, reps: '6-10' },
          { id: 'ohp', name: 'Overhead Press', sets: 4, reps: '6-10' },
          { id: 'latpulldown', name: 'Lat Pulldown', sets: 4, reps: '8-12' },
          { id: 'legpress', name: 'Leg Press', sets: 3, reps: '10-15' },
          { id: 'russian', name: 'Russian Twists', sets: 3, reps: '20' }
        ]
      },
      {
        day: 'Tuesday',
        name: 'Rest',
        exercises: []
      },
      {
        day: 'Thursday',
        name: 'Rest',
        exercises: []
      },
      {
        day: 'Saturday',
        name: 'Rest',
        exercises: []
      },
      {
        day: 'Sunday',
        name: 'Rest',
        exercises: []
      }
    ]
  }
};

// Get today's workout based on schedule
export const getTodaysWorkout = (scheduleKey) => {
  const schedule = workoutSchedules[scheduleKey];
  if (!schedule) return null;

  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return schedule.weekly.find(day => day.day === dayName) || schedule.weekly[0];
};
