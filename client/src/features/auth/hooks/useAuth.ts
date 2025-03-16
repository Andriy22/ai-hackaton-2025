import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import type { LoginCredentials } from '../api/types';
import { UserRole } from '@/features/dashboard/modules/users/types/types';
import { paths } from '@/routes/paths';

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
      
      // Get the latest user data after login
      const currentUser = useAuthStore.getState().user;
      
      // Redirect based on user role and organizationId
      if (currentUser?.role === UserRole.ADMIN && currentUser?.organizationId) {
        navigate(paths.organizations.details(currentUser.organizationId));
      } else if (currentUser?.role === UserRole.VALIDATOR) {
        // Redirect VALIDATOR users to the validation page
        navigate(paths.validation);
      } else {
        navigate(paths.dashboard);
      }
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
