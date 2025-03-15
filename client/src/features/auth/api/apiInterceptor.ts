import useAuthStore from '../store/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://[::1]:3000';

/**
 * Creates a fetch function that automatically adds authentication headers
 * and handles token refresh when needed
 */
export const createAuthenticatedFetch = () => {
  // Custom fetch function that adds auth headers
  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Get the current auth state
    const state = useAuthStore.getState();
    
    // If we don't have tokens and we're not trying to login, return unauthorized
    if (!state.tokens && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
      throw new Error('No authentication token available');
    }
    
    // Prepare headers with auth token if available
    const headers = new Headers(options.headers);
    
    if (state.tokens?.accessToken && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${state.tokens.accessToken}`);
    }
    
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Make the request
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    let response = await fetch(fullUrl, {
      ...options,
      headers,
    });
    
    // If we get a 401 Unauthorized error, try to refresh the token
    if (response.status === 401 && state.tokens?.refreshToken) {
      try {
        // Try to refresh the token
        const refreshed = await state.refreshToken();
        
        // If refresh was successful, retry the original request with the new token
        if (refreshed) {
          // Get the updated state with new tokens
          const updatedState = useAuthStore.getState();
          
          // Update authorization header with new access token
          headers.set('Authorization', `Bearer ${updatedState.tokens?.accessToken}`);
          
          // Retry the original request
          response = await fetch(fullUrl, {
            ...options,
            headers,
          });
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, logout and throw error
        state.logout();
        throw new Error('Authentication failed. Please login again.');
      }
    }
    
    return response;
  };
  
  return authenticatedFetch;
};

// Create a singleton instance of the authenticated fetch
export const api = createAuthenticatedFetch();
