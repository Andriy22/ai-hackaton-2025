import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Tokens } from '../api/types';
import { authApi } from '../api/auth';

interface AuthState {
  // Auth state
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authApi.login({ email, password });
          set({
            user: response.user,
            tokens: response.tokens,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to login',
          });
          throw error;
        }
      },
      
      logout: () => {
        // Clear auth state
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        });
      },
      
      refreshToken: async () => {
        const { tokens } = get();
        
        if (!tokens?.refreshToken) {
          return false;
        }
        
        try {
          const newTokens = await authApi.refreshToken();
          set({ tokens: newTokens });
          return true;
        } catch (error) {
          // If refresh fails, log the user out
          get().logout();
          return false;
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // Name for the localStorage key
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
