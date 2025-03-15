import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  isAuthenticated?: boolean;
  redirectPath?: string;
}

const PrivateRoute = ({ 
  isAuthenticated = false, 
  redirectPath = '/auth/login' 
}: PrivateRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
