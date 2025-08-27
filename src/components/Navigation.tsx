import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sun, Moon, User, Play, LogOut } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import ReactDOM from 'react-dom';

interface NavigationProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onLoginClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isDarkMode, toggleDarkMode, onLoginClick }) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isDarkMode 
          ? 'bg-black/90 border-gray-800' 
          : 'bg-white/90 border-gray-200'
      } backdrop-blur-lg border-b transition-colors duration-300`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500'
            }`}>
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              QueryCraft AI
            </span>
          </div>

          {/* Navigation Links */}
          <div className="nav-links hidden md:flex items-center gap-8">
            <a
              href="#projects"
              className={`font-medium transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Projects
            </a>
            <a
              href="#about"
              className={`font-medium transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={() => { logout({ logoutParams: { returnTo: window.location.origin } }); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button 
                onClick={() => loginWithRedirect()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <User className="w-4 h-4" />
                Login
              </button>
            )}

            {/* Try for Free Button */}
            <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all transform hover:scale-105">
              <Play className="w-4 h-4" />
              Try for Free
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
