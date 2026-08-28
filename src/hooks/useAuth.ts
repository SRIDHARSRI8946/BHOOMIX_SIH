import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();
  
  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasRole,
  };
};
