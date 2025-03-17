import { paths } from '@/routes/paths';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EN');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to={paths.home} className="flex items-center">
              <span className="text-teal-500 font-bold text-2xl tracking-tighter"> LUMINA SECURE</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              
            </div>
          </div>

          {/* Right Side Items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}

            {/* Contact Button */}
            <Link
              to={paths.auth.login}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              tabIndex={0}
              aria-label="Contact us"
            >
              LOG IN
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMenu}
              tabIndex={0}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
         
          
          {/* Language options for mobile */}
        
          
          {/* Mobile Contact Button */}
          <div className="mt-3 px-3">
          <Link
              to={paths.auth.login}
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              onClick={() => setIsMenuOpen(false)}
              tabIndex={0}
              aria-label="Contact us"
            >
          LOG IN
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
