import { create } from 'zustand';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userPartial: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'usr_101',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@maharashtra.gov.in',
    role: 'REVENUE_OFFICER',
    department: 'Revenue & Land Records Division',
    district: 'Pune',
    state: 'Maharashtra',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  },
  token: 'mock-jwt-token-sih-2026',
  isAuthenticated: true,

  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (userPartial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userPartial } : null,
    })),
}));
