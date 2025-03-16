import { LoginForm } from '../../features/auth/components/LoginForm';
import { Suspense } from 'react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const Login = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  );
};

export default Login;
