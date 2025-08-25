import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sun, Moon, Maximize2, Minimize2 } from 'lucide-react';
import { SQLProcessModal } from '../components/SQLProcessModal';

interface ProcessPageProps {
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

export const ProcessPage: React.FC<ProcessPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { isDarkMode: initialDarkMode } = location.state || {};
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode || false);
  
  // Prefer state; fall back to localStorage so refresh doesn't lose data
  const sqlQuery = (location.state && (location.state as any).sqlQuery) || (typeof window !== 'undefined' ? localStorage.getItem('queryResult') && JSON.parse(localStorage.getItem('queryResult') as string).sqlQuery : undefined);
  const naturalLanguageQuery = (location.state && (location.state as any).naturalLanguageQuery) || (typeof window !== 'undefined' ? localStorage.getItem('naturalLanguageQuery') || undefined : undefined);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (!sqlQuery) {
    navigate('/');
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isFullScreen 
        ? 'fixed inset-0 z-50 overflow-y-auto' 
        : 'relative'
    } ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Enhanced Header with Dark Mode Toggle and Full Screen */}
      <div className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
        isDarkMode ? 'bg-black/90 border-gray-700' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                SQL Query Creation Process
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Full Screen Toggle */}
              <button
                onClick={toggleFullScreen}
                className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
                title={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
              >
                {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Process Content */}
      <div className={`container mx-auto px-4 py-8 ${
        isFullScreen ? 'max-w-6xl' : ''
      }`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className={`text-center mb-8 ${isFullScreen ? 'mb-12' : ''}`}>
            <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              SQL Query Creation Process
            </h1>
            <p className={`text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Watch how your natural language query transforms into optimized SQL code step by step.
            </p>
          </div>
          
          <SQLProcessModal
            isOpen={true}
            onClose={() => navigate('/')}
            naturalLanguageQuery={naturalLanguageQuery || "Show me all users and their orders"}
            sqlQuery={sqlQuery}
            isDarkMode={isDarkMode}
          />
        </motion.div>
      </div>
    </div>
  );
};
