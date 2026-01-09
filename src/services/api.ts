// API Service for PHP Backend
// Base URL will be relative for same-origin deployment

const API_BASE = '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper to get auth token
const getToken = () => localStorage.getItem('fittrack-auth-token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// Auth endpoints
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> => {
    const response = await fetch(`${API_BASE}/auth.php?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (email: string, password: string, name: string): Promise<ApiResponse<{ token: string; user: any }>> => {
    const response = await fetch(`${API_BASE}/auth.php?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/auth.php?action=logout`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return response.json();
  },

  verify: async (): Promise<ApiResponse<{ user: any }>> => {
    const response = await fetch(`${API_BASE}/auth.php?action=verify`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  resetPassword: async (email: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/auth.php?action=reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  updateProfile: async (data: { name?: string; email?: string }): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/auth.php?action=update-profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/auth.php?action=change-password`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return response.json();
  },
};

// Sync endpoints
export const syncApi = {
  push: async (data: any): Promise<ApiResponse<{ syncedAt: string }>> => {
    const response = await fetch(`${API_BASE}/sync.php?action=push`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  pull: async (lastSync?: string): Promise<ApiResponse<any>> => {
    const url = lastSync 
      ? `${API_BASE}/sync.php?action=pull&since=${encodeURIComponent(lastSync)}`
      : `${API_BASE}/sync.php?action=pull`;
    const response = await fetch(url, {
      headers: authHeaders(),
    });
    return response.json();
  },

  fullSync: async (data: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/sync.php?action=full`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Exercise endpoints
export const exercisesApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/exercises.php`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/exercises.php?id=${id}`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  create: async (exercise: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/exercises.php`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(exercise),
    });
    return response.json();
  },

  update: async (id: string, exercise: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/exercises.php?id=${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(exercise),
    });
    return response.json();
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/exercises.php?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return response.json();
  },

  getHistory: async (exerciseId: string): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/exercises.php?action=history&id=${exerciseId}`, {
      headers: authHeaders(),
    });
    return response.json();
  },
};

// Category endpoints
export const categoriesApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/categories.php`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  create: async (category: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/categories.php`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(category),
    });
    return response.json();
  },

  update: async (id: string, category: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/categories.php?id=${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(category),
    });
    return response.json();
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/categories.php?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return response.json();
  },

  reorder: async (categoryIds: string[]): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/categories.php?action=reorder`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ categoryIds }),
    });
    return response.json();
  },
};

// Workout endpoints
export const workoutsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/workouts.php`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/workouts.php?id=${id}`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  create: async (workout: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/workouts.php`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(workout),
    });
    return response.json();
  },

  update: async (id: string, workout: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/workouts.php?id=${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(workout),
    });
    return response.json();
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/workouts.php?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return response.json();
  },

  copy: async (id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/workouts.php?action=copy&id=${id}`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return response.json();
  },

  move: async (id: string, newDate: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/workouts.php?action=move&id=${id}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ newDate }),
    });
    return response.json();
  },
};

// Routines endpoints
export const routinesApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/routines.php`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/routines.php?id=${id}`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  create: async (routine: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/routines.php`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(routine),
    });
    return response.json();
  },

  update: async (id: string, routine: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/routines.php?id=${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(routine),
    });
    return response.json();
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/routines.php?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return response.json();
  },
};

// Goals endpoints
export const goalsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/goals.php`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  create: async (goal: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/goals.php`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(goal),
    });
    return response.json();
  },

  update: async (id: string, goal: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/goals.php?id=${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(goal),
    });
    return response.json();
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/goals.php?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return response.json();
  },

  markComplete: async (id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/goals.php?action=complete&id=${id}`, {
      method: 'POST',
      headers: authHeaders(),
    });
    return response.json();
  },
};

// Personal Records endpoints
export const personalRecordsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/records.php`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  getByExercise: async (exerciseId: string): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/records.php?exerciseId=${exerciseId}`, {
      headers: authHeaders(),
    });
    return response.json();
  },
};

// Body Measurements endpoints
export const measurementsApi = {
  getTypes: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/measurements.php?action=types`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  updateTypes: async (measurements: any[]): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/measurements.php?action=types`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ measurements }),
    });
    return response.json();
  },

  getEntries: async (measurementId?: string): Promise<ApiResponse<any[]>> => {
    const url = measurementId 
      ? `${API_BASE}/measurements.php?measurementId=${measurementId}`
      : `${API_BASE}/measurements.php`;
    const response = await fetch(url, {
      headers: authHeaders(),
    });
    return response.json();
  },

  addEntry: async (entry: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/measurements.php`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(entry),
    });
    return response.json();
  },

  updateEntry: async (id: string, entry: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/measurements.php?id=${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(entry),
    });
    return response.json();
  },

  deleteEntry: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/measurements.php?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return response.json();
  },
};

// Progression Plans endpoints
export const progressionApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/progression.php`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/progression.php?id=${id}`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  create: async (plan: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/progression.php`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(plan),
    });
    return response.json();
  },

  update: async (id: string, plan: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/progression.php?id=${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(plan),
    });
    return response.json();
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/progression.php?id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return response.json();
  },

  markSessionComplete: async (planId: string, sessionIndex: number): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/progression.php?action=complete-session&id=${planId}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ sessionIndex }),
    });
    return response.json();
  },
};

// Statistics endpoints
export const statisticsApi = {
  getOverview: async (): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/statistics.php?action=overview`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  getExerciseStats: async (exerciseId: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/statistics.php?action=exercise&id=${exerciseId}`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  getWeeklyVolume: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/statistics.php?action=weekly-volume`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  getMuscleDistribution: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${API_BASE}/statistics.php?action=muscle-distribution`, {
      headers: authHeaders(),
    });
    return response.json();
  },
};

// Settings endpoints
export const settingsApi = {
  get: async (): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/settings.php`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  update: async (settings: any): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/settings.php`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(settings),
    });
    return response.json();
  },

  exportData: async (): Promise<ApiResponse<any>> => {
    const response = await fetch(`${API_BASE}/settings.php?action=export`, {
      headers: authHeaders(),
    });
    return response.json();
  },

  importData: async (data: any): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/settings.php?action=import`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteAccount: async (): Promise<ApiResponse<null>> => {
    const response = await fetch(`${API_BASE}/settings.php?action=delete-account`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return response.json();
  },
};
