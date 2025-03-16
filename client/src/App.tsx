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

const App = () => {
    return (
        <ErrorBoundary>
            <Router>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        {/* Routes without Layout */}
                        <Route path={paths.auth.login} element={<Login />} />
                        <Route path={paths.home} element={<Landing />} />
                        
                        {/* Routes with Layout */}
                        <Route path={paths.dashboard} element={<Layout><Dashboard /></Layout>} />
                        <Route path={paths.organizations.root} element={<Layout><Organizations /></Layout>} />
                        <Route path={paths.organizations.details()} element={<Layout><OrganizationDetails /></Layout>} />
                        <Route path={paths.users.root} element={<Layout><UserDetails /></Layout>} />
                        <Route path={paths.employees.details()} element={<Layout><EmployeeDetails /></Layout>} />
                        <Route path={paths.validation} element={<Layout><ValidationPage /></Layout>} />
                        <Route path={paths.account} element={<Layout><Account /></Layout>} />
                        
                        {/* Not Found */}
                        <Route path="*" element={<Layout><NotFound /></Layout>} />
                    </Routes>
                </Suspense>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
