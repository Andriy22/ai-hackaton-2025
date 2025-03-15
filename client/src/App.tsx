import { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Layout from './components/layout/Layout';
import { AuthGuard } from './features/auth/components/AuthGuard';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import { NotFound } from './pages/NotFound';
import { UserDetails } from './features/dashboard/modules/users/components/UserDetails';
import Organizations from './pages/Organizations';
import { paths } from './routes/paths';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import useAuthStore from './features/auth/store/useAuthStore';

const App = () => {
    const { refreshToken } = useAuthStore();

    // Try to refresh token on app load
    useEffect(() => {
        refreshToken();
    }, [refreshToken]);

    return (
        <ErrorBoundary>
            <Router>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        {/* Public routes */}
                        <Route path={paths.auth.login} element={<Login />} />

                        {/* Redirect root to dashboard */}
                        <Route path="/" element={<Navigate to={paths.dashboard} replace />} />

                        {/* Protected routes */}
                        <Route element={
                            <AuthGuard>
                                <Layout>
                                    <Outlet />
                                </Layout>
                            </AuthGuard>
                        }>
                            <Route path={paths.dashboard} element={<Dashboard />} />
                            <Route path={paths.users.root} element={<Dashboard />} />
                            <Route path={paths.users.details()} element={<UserDetails />} />
                            <Route path={paths.organizations.root} element={<Organizations />} />
                            <Route path={paths.account} element={<Account />} />
                        </Route>

                        {/* 404 route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </Router>
        </ErrorBoundary>
    );
};

export default App;
