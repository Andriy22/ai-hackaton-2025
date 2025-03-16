import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import useAuthStore from '@/features/auth/store/useAuthStore';
import { paths } from '@/routes/paths';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/features/dashboard/modules/users/types/types';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(paths.auth.login);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Check if user is a validator
  const isValidator = user?.role === UserRole.VALIDATOR;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    return () => setIsMenuOpen(false);
  }, [navigate]);

  return (
    <nav className="bg-white shadow relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to={isValidator ? paths.validation : paths.dashboard} className="text-xl font-bold text-gray-800">
                LUMINA SECURE
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {!isValidator && (
                <Link
                  to={paths.dashboard}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative flex items-center space-x-4">
              <Link
                to={paths.account}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                {user?.email}
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setIsMenuOpen(!isMenuOpen);
                }
              }}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        ref={menuRef}
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } sm:hidden fixed top-16 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200`} 
        id="mobile-menu"
        aria-label="Mobile menu"
      >
        <div className="pt-2 pb-3 space-y-1 px-2">
          {!isValidator && (
            <Link
              to={paths.dashboard}
              className="text-gray-500 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <Link
            to={paths.account}
            className="text-gray-500 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Account
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            className="w-full text-left text-gray-500 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
