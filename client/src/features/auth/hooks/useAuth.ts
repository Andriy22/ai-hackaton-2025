import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import type { LoginCredentials } from '../api/types';

interface UseAuthReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const { 
    isLoading, 
    isAuthenticated, 
    error, 
    login: storeLogin, 
    logout: storeLogout
  } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    try {
      await storeLogin(credentials.email, credentials.password);
      navigate('/dashboard');
    } catch (err) {
      // Error is already set in the store
    }
  };

  const logout = () => {
    storeLogout();
    navigate('/auth/login');
  };

  return {
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
  };
};
