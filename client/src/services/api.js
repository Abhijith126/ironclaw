import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

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
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  googleAuth: (googleData) => api.post('/auth/google', googleData),
  verifyToken: () => api.get('/auth/verify'),
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  deleteAccount: () => api.delete('/users/profile'),
  getWeeklySchedule: () => api.get('/users/weekly-schedule'),
  updateWeeklySchedule: (scheduleData) => api.put('/users/weekly-schedule', scheduleData),
  getWeightLog: () => api.get('/users/weight-log'),
  addWeight: (weight, date) => api.post('/users/weight-log', { weight, date }),
  getWorkoutLog: () => api.get('/users/workout-log'),
  logWorkout: (exerciseId, completed) => api.post('/users/workout-log', { exerciseId, completed }),
};

// Workout endpoints
export const workoutAPI = {
  getAll: () => api.get('/workouts'),
  getById: (id) => api.get(`/workouts/${id}`),
  create: (workoutData) => api.post('/workouts', workoutData),
  update: (id, workoutData) => api.put(`/workouts/${id}`, workoutData),
  delete: (id) => api.delete(`/workouts/${id}`),
  complete: (id) => api.patch(`/workouts/${id}/complete`),
  completeSet: (workoutId, exerciseIndex, setIndex) =>
    api.patch(`/workouts/${workoutId}/exercises/${exerciseIndex}/sets/${setIndex}/complete`),
};

// Exercise endpoints
export const exerciseAPI = {
  getAll: () => api.get('/exercises'),
  getByCategory: (category) => api.get(`/exercises/category/${category}`),
  getByMuscleGroup: (muscleGroup) => api.get(`/exercises/muscle/${muscleGroup}`),
  getByEquipment: (equipment) => api.get(`/exercises/equipment/${equipment}`),
  getById: (id) => api.get(`/exercises/${id}`),
  create: (exerciseData) => api.post('/exercises', exerciseData),
  update: (id, exerciseData) => api.put(`/exercises/${id}`, exerciseData),
  delete: (id) => api.delete(`/exercises/${id}`),
};

// Equipment endpoints
export const equipmentAPI = {
  getAll: (params) => api.get('/equipment', { params }),
  getCategories: () => api.get('/equipment/categories'),
  getById: (id) => api.get(`/equipment/${id}`),
};

// Shared exercise cache
let exerciseCache = null;
let exerciseMapCache = null;
let exerciseNameMapCache = null;

export const getExercises = async () => {
  if (exerciseCache) return exerciseCache;
  const res = await exerciseAPI.getAll();
  exerciseCache = res.data.exercises;
  return exerciseCache;
};

export const getExerciseMap = async () => {
  if (exerciseMapCache) return exerciseMapCache;
  const exercises = await getExercises();
  const map = {};
  exercises.forEach((ex) => {
    map[ex._id] = { name: ex.name, equipment: ex.equipment };
  });
  exerciseMapCache = map;
  return map;
};

export const getExerciseNameMap = async () => {
  if (exerciseNameMapCache) return exerciseNameMapCache;
  const exercises = await getExercises();
  const map = {};
  exercises.forEach((ex) => {
    map[ex.name.toLowerCase()] = { id: ex._id, name: ex.name, equipment: ex.equipment };
  });
  exerciseNameMapCache = map;
  return map;
};

// Helper to transform API response to component format
export const transformExercisesForPicker = async () => {
  const exercises = await getExercises();
  const categories = {};
  exercises.forEach((ex) => {
    if (!categories[ex.category]) {
      categories[ex.category] = {
        name: ex.category.charAt(0).toUpperCase() + ex.category.slice(1),
        exercises: [],
      };
    }
    categories[ex.category].exercises.push({
      id: ex._id,
      name: ex.name,
      equipment: ex.equipment,
    });
  });
  return categories;
};

export default api;
