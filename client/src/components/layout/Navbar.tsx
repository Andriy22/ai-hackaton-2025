import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import useAuthStore from '@/features/auth/store/useAuthStore';
import { paths } from '@/routes/paths';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, LayoutDashboard, Shield, Scan, Building } from 'lucide-react';
import { UserRole } from '@/features/dashboard/modules/users/types/types';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(paths.auth.login);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close menu when clicking outside or changing routes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      if (menu && !menu.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }

      if (
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target as Node) && 
        isProfileOpen
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, isProfileOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Determine if a nav link is active
  const isActive = (path: string) => location.pathname === path;

  // Check user roles
  const isValidator = user?.role === UserRole.VALIDATOR;
  const isOrgAdmin = user?.role === UserRole.ADMIN;
  
  // Get the organization path for ORG_ADMIN users
  const getOrgAdminPath = () => {
    if (user?.organizationId) {
      return paths.organizations.details(user.organizationId);
    }
    return paths.organizations.root;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link 
              to={isValidator ? paths.validation : isOrgAdmin ? getOrgAdminPath() : paths.dashboard} 
              className="flex items-center gap-2 text-primary font-bold text-xl transition-colors hover:text-primary/90"
              aria-label={isValidator ? "Go to validation" : isOrgAdmin ? "Go to organization" : "Go to dashboard"}
            >
              <Shield className="h-6 w-6" />
              <span>Lumina Secure</span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {isValidator ? (
                <Link
                  to={paths.validation}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(paths.validation) 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                  aria-current={isActive(paths.validation) ? "page" : undefined}
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Validation
                </Link>
              ) : isOrgAdmin ? (
                <Link
                  to={getOrgAdminPath()}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname.includes(paths.organizations.root) 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                  aria-current={location.pathname.includes(paths.organizations.root) ? "page" : undefined}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Organization
                </Link>
              ) : (
                <>
                  <Link
                    to={paths.dashboard}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(paths.dashboard) 
                        ? "bg-primary/10 text-primary" 
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                    aria-current={isActive(paths.dashboard) ? "page" : undefined}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to={paths.organizations.root}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname.includes(paths.organizations.root) 
                        ? "bg-primary/10 text-primary" 
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                    aria-current={location.pathname.includes(paths.organizations.root) ? "page" : undefined}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Organizations
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User profile/actions - desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4 relative">
            <div ref={profileMenuRef}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 text-gray-600 hover:text-primary"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <User className="h-4 w-4" />
                <span className="max-w-[150px] truncate">{user?.email}</span>
              </Button>
              
              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1 border border-gray-200 rounded-md">
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
                      My Account
                    </div>
                    <Link 
                      to={paths.account}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setIsProfileOpen(false)}
                      tabIndex={0}
                      aria-label="Go to profile"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      tabIndex={0}
                      aria-label="Logout"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`} 
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
          {isValidator ? (
            <Link
              to={paths.validation}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive(paths.validation) 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}
              aria-current={isActive(paths.validation) ? "page" : undefined}
            >
              <Scan className="h-5 w-5 mr-2" />
              Validation
            </Link>
          ) : isOrgAdmin ? (
            <Link
              to={getOrgAdminPath()}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                location.pathname.includes(paths.organizations.root) 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}
              aria-current={location.pathname.includes(paths.organizations.root) ? "page" : undefined}
            >
              <Building className="h-5 w-5 mr-2" />
              Organization
            </Link>
          ) : (
            <>
              <Link
                to={paths.dashboard}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(paths.dashboard) 
                    ? "bg-primary/10 text-primary" 
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
                aria-current={isActive(paths.dashboard) ? "page" : undefined}
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
              <Link
                to={paths.organizations.root}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname.includes(paths.organizations.root) 
                    ? "bg-primary/10 text-primary" 
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
                aria-current={location.pathname.includes(paths.organizations.root) ? "page" : undefined}
              >
                <Shield className="h-5 w-5 mr-2" />
                Organizations
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile profile menu */}
        <div className="pt-4 pb-3 border-t border-gray-100 bg-white">
          <div className="px-4 flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{user?.email}</div>
            </div>
          </div>
          <div className="mt-3 px-2 space-y-1">
            <Link
              to={paths.account}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
            >
              <User className="h-5 w-5 mr-2" />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
