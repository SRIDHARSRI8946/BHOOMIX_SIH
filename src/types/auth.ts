export type UserRole = 'ADMIN' | 'REVENUE_OFFICER' | 'SURVEYOR' | 'CITIZEN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  district?: string;
  state?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
