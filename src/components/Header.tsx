import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, Play, Bell, Home, List, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NineAnimeSearch } from './NineAnimeSearch';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-dark-950/95 backdrop-blur-md border-b border-primary-900/20 safe-area-inset-top">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors flex-shrink-0"
              aria-label="AniStream Home"
            >
              <Play className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-lg sm:text-xl font-bold">AniStream</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8" role="navigation">
              <Link 
                to="/" 
                className="text-white hover:text-primary-400 transition-colors text-sm xl:text-base"
                aria-label="Home"
              >
                Home
              </Link>
              <Link 
                to="/search" 
                className="text-white hover:text-primary-400 transition-colors text-sm xl:text-base"
                aria-label="Browse Anime"
              >
                Browse
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-primary-400 transition-colors text-sm xl:text-base"
                  aria-label="My Watchlist"
                >
                  My List
                </Link>
              )}
            </nav>

            {/* Search Button - 9anime Style */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <button
                onClick={openSearch}
                className="flex items-center bg-dark-800 hover:bg-dark-700 rounded-lg px-3 py-2 w-full max-w-sm text-left transition-colors group"
              >
                <Search className="h-4 w-4 text-gray-400 mr-2 group-hover:text-primary-400 transition-colors flex-shrink-0" />
                <span className="text-gray-400 group-hover:text-white transition-colors text-sm truncate">Search anime...</span>
                <div className="ml-auto text-xs text-gray-500 bg-dark-700 px-2 py-1 rounded hidden lg:block">
                  Ctrl+K
                </div>
              </button>
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <button 
                    className="relative text-white hover:text-primary-400 transition-colors p-2"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      2
                    </span>
                  </button>
                  
                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-2 text-white hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-dark-800"
                      aria-label={`Profile: ${user?.username}`}
                    >
                      <User className="h-4 w-4 lg:h-5 lg:w-5" />
                      <span className="max-w-20 truncate text-sm lg:text-base hidden lg:block">{user?.username}</span>
                      <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg border border-dark-700 py-2 z-50">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-white hover:bg-dark-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 inline mr-2" />
                          Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-white hover:bg-dark-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <List className="h-4 w-4 inline mr-2" />
                          My List
                        </Link>
                        <hr className="border-dark-700 my-2" />
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 transition-colors"
                        >
                          <LogOut className="h-4 w-4 inline mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <Link 
                    to="/login" 
                    className="text-white hover:text-primary-400 transition-colors text-sm lg:text-base px-3 py-2"
                    aria-label="Login"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base"
                    aria-label="Sign Up"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-primary-400 transition-colors p-2"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-primary-900/20 animate-slide-up bg-dark-950/95 backdrop-blur-md rounded-lg mx-2">
              <div className="flex flex-col space-y-4">
                {/* Mobile Search */}
                <button
                  onClick={openSearch}
                  className="flex items-center bg-dark-800 rounded-lg px-4 py-3 text-left mx-2"
                >
                  <Search className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-400">Search anime...</span>
                </button>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2" role="navigation">
                  <Link 
                    to="/" 
                    className="text-white hover:text-primary-400 transition-colors py-3 px-4 rounded-lg hover:bg-dark-800 flex items-center space-x-3 mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link 
                    to="/search" 
                    className="text-white hover:text-primary-400 transition-colors py-3 px-4 rounded-lg hover:bg-dark-800 flex items-center space-x-3 mx-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Search className="h-5 w-5" />
                    <span>Browse</span>
                  </Link>
                  {isAuthenticated && (
                    <Link 
                      to="/dashboard" 
                      className="text-white hover:text-primary-400 transition-colors py-3 px-4 rounded-lg hover:bg-dark-800 flex items-center space-x-3 mx-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <List className="h-5 w-5" />
                      <span>My List</span>
                    </Link>
                  )}
                </nav>

                {/* Mobile User Menu */}
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-primary-900/20 mx-2">
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-3 text-white hover:text-primary-400 transition-colors py-3 px-4 rounded-lg hover:bg-dark-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>{user?.username}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 text-white hover:text-red-400 transition-colors py-3 px-4 rounded-lg hover:bg-dark-800 text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-primary-900/20 mx-2">
                    <Link 
                      to="/login" 
                      className="text-white hover:text-primary-400 transition-colors py-3 px-4 rounded-lg hover:bg-dark-800 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <NineAnimeSearch isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
};