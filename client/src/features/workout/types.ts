export interface ScheduleExercise {
  id: string;
  name?: string;
  imageUrl?: string;
  sets: number;
  reps: number | string;
  pr?: { weight: number; reps: number } | null;
}
