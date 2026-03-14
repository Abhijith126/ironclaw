import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) => api.post('/auth/register', userData),
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
  googleAuth: (googleData: { credential: string }) => api.post('/auth/google', googleData),
  verifyToken: () => api.get('/auth/verify'),
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: Record<string, unknown>) => api.put('/users/profile', userData),
  changePassword: (currentPassword: string, newPassword: string) => api.put('/users/password', { currentPassword, newPassword }),
  deleteAccount: () => api.delete('/users/profile'),
  getWeeklySchedule: () => api.get('/users/weekly-schedule'),
  updateWeeklySchedule: (scheduleData: Record<string, unknown>) => api.put('/users/weekly-schedule', scheduleData),
  getWeightLog: () => api.get('/users/weight-log'),
  addWeight: (weight: number, date: string) => api.post('/users/weight-log', { weight, date }),
  getWorkoutLog: () => api.get('/users/workout-log'),
  logWorkout: (exerciseId: string, completed: boolean) => api.post('/users/workout-log', { exerciseId, completed }),
};

// Workout endpoints
export const workoutAPI = {
  getAll: () => api.get('/workouts'),
  getById: (id: string) => api.get(`/workouts/${id}`),
  create: (workoutData: Record<string, unknown>) => api.post('/workouts', workoutData),
  update: (id: string, workoutData: Record<string, unknown>) => api.put(`/workouts/${id}`, workoutData),
  delete: (id: string) => api.delete(`/workouts/${id}`),
  complete: (id: string) => api.patch(`/workouts/${id}/complete`),
  completeSet: (workoutId: string, exerciseIndex: number, setIndex: number) =>
    api.patch(`/workouts/${workoutId}/exercises/${exerciseIndex}/sets/${setIndex}/complete`),
};

// Exercise endpoints
export const exerciseAPI = {
  getAll: () => api.get('/exercises'),
  getByCategory: (category: string) => api.get(`/exercises/category/${category}`),
  getByMuscleGroup: (muscleGroup: string) => api.get(`/exercises/muscle/${muscleGroup}`),
  getByEquipment: (equipment: string) => api.get(`/exercises/equipment/${equipment}`),
  getById: (id: string) => api.get(`/exercises/${id}`),
  create: (exerciseData: Record<string, unknown>) => api.post('/exercises', exerciseData),
  update: (id: string, exerciseData: Record<string, unknown>) => api.put(`/exercises/${id}`, exerciseData),
  delete: (id: string) => api.delete(`/exercises/${id}`),
};

// Equipment endpoints
export const equipmentAPI = {
  getAll: (params?: Record<string, string>) => api.get('/equipment', { params }),
  getCategories: () => api.get('/equipment/categories'),
  getById: (id: string) => api.get(`/equipment/${id}`),
};

// Shared exercise cache
let exerciseCache: APIExercise[] | null = null;
let exerciseMapCache: Record<string, ExerciseMapEntry> | null = null;
let exerciseNameMapCache: Record<string, ExerciseNameMapEntry> | null = null;

export const getExercises = async (): Promise<APIExercise[]> => {
  if (exerciseCache) return exerciseCache;
  const res = await exerciseAPI.getAll();
  exerciseCache = res.data.exercises || res.data || [];
  return exerciseCache!;
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

export const getExerciseNameMap = async (): Promise<Record<string, ExerciseNameMapEntry>> => {
  if (exerciseNameMapCache) return exerciseNameMapCache;
  const exercises = await getExercises();
  const map: Record<string, ExerciseNameMapEntry> = {};
  (exercises || []).forEach((ex) => {
    map[ex.name.toLowerCase()] = { id: ex.id, name: ex.name, equipment: ex.equipment };
  });
  exerciseNameMapCache = map;
  return map;
};

// Helper to transform API response to component format
export const transformExercisesForPicker = async (): Promise<Record<string, CategoryEntry>> => {
  const exercises = await getExercises();
  const categories: Record<string, CategoryEntry> = {};
  exercises.forEach((ex) => {
    if (!categories[ex.category]) {
      categories[ex.category] = {
        name: ex.category.charAt(0).toUpperCase() + ex.category.slice(1),
        exercises: [],
      };
    }
    categories[ex.category].exercises.push({
      id: ex.id,
      name: ex.name,
      equipment: ex.equipment,
    });
  });
  return categories;
};

export default api;
