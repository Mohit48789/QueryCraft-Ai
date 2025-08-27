import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './pages/HomePage';
import { ProcessPage } from './pages/ProcessPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { SchemaPage } from './pages/SchemaPage';
import { useDarkMode } from './hooks/useDarkMode';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isAuthenticated, isLoading } = useAuth0();
  const [showLogin, setShowLogin] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string>('');

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  // Show success banner after Auth0 redirects back
  useEffect(() => {
    if (isLoading) return;
    try {
      const pending = localStorage.getItem('authAction');
      if (pending === 'login' && isAuthenticated) {
        setFlashMessage('Signed in successfully');
        localStorage.removeItem('authAction');
      }
      if (pending === 'logout' && !isAuthenticated) {
        setFlashMessage('Signed out successfully');
        localStorage.removeItem('authAction');
      }
    } catch (e) {}
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (!flashMessage) return;
    const t = setTimeout(() => setFlashMessage(''), 3000);
    return () => clearTimeout(t);
  }, [flashMessage]);

  if (showLogin) {
    return <LoginPage onBack={() => setShowLogin(false)} isDarkMode={isDarkMode} />;
  }

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black text-white' 
          : 'bg-white text-gray-900'
      }`}>
        {flashMessage && (
          <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
          }`}>
            {flashMessage}
          </div>
        )}
        <Navigation isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} onLoginClick={handleLoginClick} />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                isDarkMode={isDarkMode} 
                toggleDarkMode={toggleDarkMode} 
                onLoginClick={handleLoginClick} 
              />
            } 
          />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/schema" element={<SchemaPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
