import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
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
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logoutUser, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
