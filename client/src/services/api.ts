import axios from 'axios';
import { STORAGE_KEYS } from '../constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- API endpoint groups ---

export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  googleAuth: (googleData: { credential: string }) =>
    api.post('/auth/google', googleData),
  verifyToken: () => api.get('/auth/verify'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: Record<string, unknown>) =>
    api.put('/users/profile', userData),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/users/password', { currentPassword, newPassword }),
  deleteAccount: () => api.delete('/users/profile'),
  getWeeklySchedule: () => api.get('/users/weekly-schedule'),
  updateWeeklySchedule: (scheduleData: Record<string, unknown>) =>
    api.put('/users/weekly-schedule', scheduleData),
  getWeightLog: () => api.get('/users/weight-log'),
  addWeight: (weight: number, date: string) =>
    api.post('/users/weight-log', { weight, date }),
  getWorkoutLog: () => api.get('/users/workout-log'),
  logWorkout: (exerciseId: string, completed: boolean) =>
    api.post('/users/workout-log', { exerciseId, completed }),
};

export const workoutAPI = {
  getAll: () => api.get('/workouts'),
  getById: (id: string) => api.get(`/workouts/${id}`),
  create: (workoutData: Record<string, unknown>) =>
    api.post('/workouts', workoutData),
  update: (id: string, workoutData: Record<string, unknown>) =>
    api.put(`/workouts/${id}`, workoutData),
  delete: (id: string) => api.delete(`/workouts/${id}`),
  complete: (id: string) => api.patch(`/workouts/${id}/complete`),
  completeSet: (workoutId: string, exerciseIndex: number, setIndex: number) =>
    api.patch(`/workouts/${workoutId}/exercises/${exerciseIndex}/sets/${setIndex}/complete`),
};

export const exerciseAPI = {
  getAll: () => api.get('/exercises'),
  getByCategory: (category: string) => api.get(`/exercises/category/${category}`),
  getByMuscleGroup: (muscleGroup: string) => api.get(`/exercises/muscle/${muscleGroup}`),
  getByEquipment: (equipment: string) => api.get(`/exercises/equipment/${equipment}`),
  getById: (id: string) => api.get(`/exercises/${id}`),
};

export const equipmentAPI = {
  getAll: (params?: Record<string, string>) => api.get('/equipment', { params }),
  getCategories: () => api.get('/equipment/categories'),
  getById: (id: string) => api.get(`/equipment/${id}`),
};

// --- Exercise cache ---

export interface APIExercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  imageUrl?: string;
}

export interface ExerciseMapEntry {
  name: string;
  equipment: string;
  imageUrl?: string;
}

let exerciseCache: APIExercise[] | null = null;
let exerciseMapCache: Record<string, ExerciseMapEntry> | null = null;

export const getExercises = async (): Promise<APIExercise[]> => {
  if (exerciseCache) return exerciseCache;
  const res = await exerciseAPI.getAll();
  exerciseCache = res.data.exercises || [];
  return exerciseCache;
};

export const getExerciseMap = async (): Promise<Record<string, ExerciseMapEntry>> => {
  if (exerciseMapCache) return exerciseMapCache;
  const exercises = await getExercises();
  const map: Record<string, ExerciseMapEntry> = {};
  exercises.forEach((ex) => {
    map[ex.id] = { name: ex.name, equipment: ex.equipment, imageUrl: ex.imageUrl };
  });
  exerciseMapCache = map;
  return map;
};

export default api;
