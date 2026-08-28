import api from '../../lib/axios';
import { AuthResponse } from '../../types/auth';

export const loginApi = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  // Mock response for quick demo testing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'mock-sih-jwt-token-2026',
        user: {
          id: 'usr_101',
          name: 'Rajesh Sharma',
          email: credentials.email,
          role: 'REVENUE_OFFICER',
          department: 'Revenue & Land Records Division',
          district: 'Pune',
          state: 'Maharashtra',
        },
      });
    }, 600);
  });
};
