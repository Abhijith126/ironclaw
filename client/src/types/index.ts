export type WeightUnit = 'kg' | 'lbs';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  weightUnit: WeightUnit;
  weeklySchedule?: WeeklySchedule;
}

export interface Exercise {
  id: string;
  name?: string;
  imageUrl?: string;
  sets: number;
  reps: number | string;
  pr: { weight: number; reps: number } | null;
}

export interface WeightLog {
  id: string;
  weight: number;
  date: string;
}

export interface WorkoutLog {
  id: string;
  exerciseId: string;
  date: string;
  completed: boolean;
}

export interface Equipment {
  id: string;
  machineName: string;
  category: string;
  difficultyLevel: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  videoUrl: string | null;
  notes: string | null;
  movementPattern: string | null;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type WeeklySchedule = Record<DayOfWeek, Exercise[]>;

export interface Alert {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
}

export interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  showInTab: boolean;
}
