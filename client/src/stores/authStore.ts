import { create } from 'zustand';
import { User } from '../types/auth';
import api from '../lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userPartial: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

// Read saved session ONLY if already logged in previously
const storedToken = localStorage.getItem('token');
let initialUser: User | null = null;
if (storedToken) {
  try {
    const userJson = localStorage.getItem('user_profile');
    if (userJson) {
      initialUser = JSON.parse(userJson);
    }
  } catch (e) {
    // Ignore invalid json
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: storedToken,
  isAuthenticated: Boolean(storedToken && initialUser),

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user_profile', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_profile');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userPartial) =>
    set((state) => {
      if (!state.user) return { user: null };
      const updated = { ...state.user, ...userPartial };
      localStorage.setItem('user_profile', JSON.stringify(updated));
      return { user: updated };
    }),

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }
    try {
      const res = await api.get('/auth/me');
      if (res.data) {
        localStorage.setItem('user_profile', JSON.stringify(res.data));
        set({ user: res.data, isAuthenticated: true });
      }
    } catch (e) {
      // If token expired/invalid, log out
      localStorage.removeItem('token');
      localStorage.removeItem('user_profile');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
