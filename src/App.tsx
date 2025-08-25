import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './pages/HomePage';
import { ProcessPage } from './pages/ProcessPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { SchemaPage } from './pages/SchemaPage';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

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
