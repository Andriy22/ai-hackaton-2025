import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/routes/paths';

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
              <Link 
                to="#products" 
                className="text-gray-700 hover:text-teal-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
                tabIndex={0}
              >
                PRODUCTS
              </Link>
              <Link 
                to="#solutions" 
                className="text-gray-700 hover:text-teal-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
                tabIndex={0}
              >
                SOLUTIONS
              </Link>
              <Link 
                to="#case-study" 
                className="text-gray-700 hover:text-teal-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
                tabIndex={0}
              >
                CASE STUDY
              </Link>
              <Link 
                to="#support" 
                className="text-gray-700 hover:text-teal-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
                tabIndex={0}
              >
                SUPPORT
              </Link>
              <Link 
                to="#news" 
                className="text-gray-700 hover:text-teal-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
                tabIndex={0}
              >
                NEWS
              </Link>
              <Link 
                to="#about" 
                className="text-gray-700 hover:text-teal-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
                tabIndex={0}
              >
                ABOUT
              </Link>
            </div>
          </div>

          {/* Right Side Items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button 
                className="flex items-center text-gray-700 hover:text-teal-500 px-3 py-2 text-sm font-medium transition-colors duration-200"
                aria-label="Select language"
                tabIndex={0}
              >
                LANGUAGE <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => handleLanguageChange('EN')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    tabIndex={0}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('UA')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    tabIndex={0}
                  >
                    Ukrainian
                  </button>
                </div>
              </div>
            </div>

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
          <Link
            to="#products"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-500 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
            tabIndex={0}
          >
            PRODUCTS
          </Link>
          <Link
            to="#solutions"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-500 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
            tabIndex={0}
          >
            SOLUTIONS
          </Link>
          <Link
            to="#case-study"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-500 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
            tabIndex={0}
          >
            CASE STUDY
          </Link>
          <Link
            to="#support"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-500 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
            tabIndex={0}
          >
            SUPPORT
          </Link>
          <Link
            to="#news"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-500 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
            tabIndex={0}
          >
            NEWS
          </Link>
          <Link
            to="#about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-500 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
            tabIndex={0}
          >
            ABOUT
          </Link>
          
          {/* Language options for mobile */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-3">
              <p className="text-xs font-medium text-gray-500 uppercase">Language</p>
            </div>
            <div className="mt-1">
              <button
                onClick={() => handleLanguageChange('EN')}
                className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${language === 'EN' ? 'text-teal-500' : 'text-gray-700 hover:text-teal-500 hover:bg-gray-50'}`}
                tabIndex={0}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('UA')}
                className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${language === 'UA' ? 'text-teal-500' : 'text-gray-700 hover:text-teal-500 hover:bg-gray-50'}`}
                tabIndex={0}
              >
                Ukrainian
              </button>
            </div>
          </div>
          
          {/* Mobile Contact Button */}
          <div className="mt-3 px-3">
            <a
              href="#contact"
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              onClick={() => setIsMenuOpen(false)}
              tabIndex={0}
              aria-label="Contact us"
            >
              CONTACT
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
