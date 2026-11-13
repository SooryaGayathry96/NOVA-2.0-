import {
  User,
  DashboardData,
  LearningModule,
  Mission,
  Quiz,
  LeaderboardEntry,
  Achievement,
} from '../types';

const API_BASE = '/api';

const getHeaders = (isJson = true) => {
  const token = localStorage.getItem('nova_token');
  const headers: Record<string, string> = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Mission Control request failed');
  }
  return data;
};

export const api = {
  // Auth
  register: async (payload: { name: string; email: string; password: string; callsign?: string; avatar?: string }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  login: async (payload: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  logout: async () => {
    localStorage.removeItem('nova_token');
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: getHeaders() });
    } catch (e) {
      // ignore
    }
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Profile
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/users/profile`, { headers: getHeaders() });
    return handleResponse(res);
  },

  updateProfile: async (payload: { name?: string; callsign?: string; avatar?: string; bio?: string }) => {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Dashboard
  getDashboard: async (): Promise<{ success: boolean; dashboard: DashboardData }> => {
    const res = await fetch(`${API_BASE}/dashboard`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Learning Modules
  getModules: async (): Promise<{ success: boolean; modules: LearningModule[] }> => {
    const res = await fetch(`${API_BASE}/modules`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getModule: async (id: string): Promise<{ success: boolean; module: LearningModule; status: string; progressPercent: number; linkedQuiz: any }> => {
    const res = await fetch(`${API_BASE}/modules/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  completeModule: async (id: string) => {
    const res = await fetch(`${API_BASE}/modules/${id}/complete`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Missions
  getMissions: async (): Promise<{ success: boolean; missions: Mission[] }> => {
    const res = await fetch(`${API_BASE}/missions`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getMission: async (id: string): Promise<{ success: boolean; mission: Mission; isCompleted: boolean }> => {
    const res = await fetch(`${API_BASE}/missions/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  completeMission: async (id: string, submission: any) => {
    const res = await fetch(`${API_BASE}/missions/${id}/complete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ submission }),
    });
    return handleResponse(res);
  },

  // Quizzes
  getQuizzes: async (): Promise<{ success: boolean; quizzes: Quiz[] }> => {
    const res = await fetch(`${API_BASE}/quizzes`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getQuiz: async (id: string): Promise<{ success: boolean; quiz: Quiz }> => {
    const res = await fetch(`${API_BASE}/quizzes/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  submitQuiz: async (id: string, answers: number[]) => {
    const res = await fetch(`${API_BASE}/quizzes/${id}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ answers }),
    });
    return handleResponse(res);
  },

  // Progress & Achievements
  getProgress: async () => {
    const res = await fetch(`${API_BASE}/progress`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getAchievements: async (): Promise<{ success: boolean; achievements: Achievement[] }> => {
    const res = await fetch(`${API_BASE}/progress/achievements`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Leaderboard
  getLeaderboard: async (page = 1, limit = 20): Promise<{ success: boolean; leaderboard: LeaderboardEntry[]; pagination: any }> => {
    const res = await fetch(`${API_BASE}/leaderboard?page=${page}&limit=${limit}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  // NASA Open APIs
  getNasaApod: async () => {
    const res = await fetch(`${API_BASE}/nasa/apod`);
    return handleResponse(res);
  },

  searchNasaImages: async (query: string) => {
    const res = await fetch(`${API_BASE}/nasa/search?q=${encodeURIComponent(query)}`);
    return handleResponse(res);
  },

  // Admin
  getAdminAnalytics: async () => {
    const res = await fetch(`${API_BASE}/admin/analytics`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getAdminUsers: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: getHeaders() });
    return handleResponse(res);
  },

  createAdminMission: async (payload: any) => {
    const res = await fetch(`${API_BASE}/admin/missions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  createAdminModule: async (payload: any) => {
    const res = await fetch(`${API_BASE}/admin/modules`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};
