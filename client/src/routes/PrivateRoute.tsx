import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../features/auth/store/useAuthStore';
import { UserRole } from '../features/dashboard/modules/users/types/types';

interface PrivateRouteProps {
  allowedRoles?: UserRole[];
  allowedPaths?: string[];
  redirectPath?: string;
}

const PrivateRoute = ({ 
  allowedRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VALIDATOR],
  allowedPaths = [],
  redirectPath = '/auth/login' 
}: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const currentPath = location.pathname;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  // Check if user has the required role
  const hasRequiredRole = user && allowedRoles.includes(user.role as UserRole);
  
  // Check if current path is allowed
  const isPathAllowed = allowedPaths.some(path => 
    currentPath === path || 
    currentPath.startsWith(path) ||
    // Handle dynamic paths with parameters
    (path.includes(':') && currentPath.match(new RegExp(path.replace(/:\w+/g, '[^/]+'))))
  );
  
  // If user has the required role but the path is not allowed, or user doesn't have the required role
  if ((hasRequiredRole && !isPathAllowed) || !hasRequiredRole) {
    // Redirect to first allowed path or the specified redirect path
    const redirectTo = allowedPaths.length > 0 ? allowedPaths[0] : redirectPath;
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
