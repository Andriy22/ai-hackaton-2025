import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Landing from './pages/Landing';
import { NotFound } from './pages/NotFound';
import { UserDetails } from './features/dashboard/modules/users/components/UserDetails';
import { OrganizationDetails } from './features/dashboard/modules/organizations/components/OrganizationDetails';
import { EmployeeDetails } from './features/dashboard/modules/employees';
import Organizations from './pages/Organizations';
import ValidationPage from './pages/Validation';
import { paths } from './routes/paths';
import ErrorBoundary from './components/layout/ErrorBoundary';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { UserRole } from './features/dashboard/modules/users/types/types';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';

const App = () => {
    return (
        <ErrorBoundary>
            <Router>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        {/* Public Routes - accessible to all users */}
                        <Route 
                            path={paths.auth.login} 
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            } 
                        />
                        <Route 
                            path={paths.home} 
                            element={
                                <PublicRoute>
                                    <Landing />
                                </PublicRoute>
                            } 
                        />
                        
                        {/* Account Route - accessible to all authenticated users */}
                        <Route 
                            path={paths.account} 
                            element={
                                <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VALIDATOR]}>
                                    <Layout><Account /></Layout>
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Validator Routes */}
                        <Route 
                            path={paths.validation} 
                            element={
                                <ProtectedRoute allowedRoles={[UserRole.VALIDATOR]}>
                                    <Layout><ValidationPage /></Layout>
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Organization Admin Routes */}
                        <Route 
                            path={paths.organizations.details()} 
                            element={
                                <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                                    <Layout><OrganizationDetails /></Layout>
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Super Admin Routes */}
                        <Route 
                            path={paths.dashboard} 
                            element={
                                <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                                    <Layout><Dashboard /></Layout>
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path={paths.organizations.root} 
                            element={
                                <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                                    <Layout><Organizations /></Layout>
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path={paths.users.root} 
                            element={
                                <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                                    <Layout><UserDetails /></Layout>
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path={paths.users.details()} 
                            element={
                                <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                                    <Layout><UserDetails /></Layout>
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path={paths.employees.details()} 
                            element={
                                <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                                    <Layout><EmployeeDetails /></Layout>
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Not Found */}
                        <Route path="*" element={<Layout><NotFound /></Layout>} />
                    </Routes>
                </Suspense>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
