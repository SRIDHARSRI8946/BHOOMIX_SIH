export type UserRole = 'ADMIN' | 'REVENUE_OFFICER' | 'SURVEYOR' | 'CITIZEN';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
  designation?: string;
  officer_code?: string;
  address?: string;
  district?: string;
  state?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
