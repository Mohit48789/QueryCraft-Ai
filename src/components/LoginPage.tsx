import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { AuthService } from '../services/authService';
import { User } from 'firebase/auth';

interface LoginPageProps {
  isDarkMode: boolean;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ isDarkMode, onBack }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if Firebase is properly configured
  const isFirebaseConfigured = AuthService.isFirebaseConfigured();

  const handleGoogle = async () => {
    setMessage(null);
    setError(null);
    setIsLoading(true);
    
    try { 
      if (!isFirebaseConfigured) {
        throw new Error('Firebase is not properly configured. Please check your environment variables.');
      }
      
      await AuthService.loginWithGoogle(); 
    } catch (e: any) {
        setError(e?.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHub = async () => {
    setMessage(null); 
        setError(null);
    setIsLoading(true);
    
    try { 
      if (!isFirebaseConfigured) {
        throw new Error('Firebase is not properly configured. Please check your environment variables.');
      }
      
      await AuthService.loginWithGitHub(); 
    } catch (e: any) {
      setError(e?.message || 'GitHub login failed');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const unsub = AuthService.onAuthState((user) => setCurrentUser(user));
    return () => { if (typeof unsub === 'function') unsub(); };
  }, []);

  // Auto-close after successful login
  React.useEffect(() => {
    if (currentUser) {
      const t = setTimeout(() => onBack(), 300);
      return () => clearTimeout(t);
    }
  }, [currentUser, onBack]);

  // Show configuration warning if Firebase is not configured
  if (!isFirebaseConfigured) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-black via-gray-900 to-black' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative w-full max-w-md p-8 rounded-2xl backdrop-blur-md border ${
            isDarkMode 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/80 border-gray-200'
          }`}
        >
          <button
            onClick={onBack}
            className={`mb-6 flex items-center gap-2 text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="text-center">
            <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? 'text-red-400' : 'text-red-500'
            }`} />
            <h1 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Configuration Required
            </h1>
            <p className={`mb-6 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Firebase authentication is not properly configured. Please add the following environment variables to your <code className="bg-gray-200 px-2 py-1 rounded">.env</code> file:
            </p>
            <div className={`text-left p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <code className="text-sm">
                REACT_APP_FIREBASE_API_KEY=your-api-key<br/>
                REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com<br/>
                REACT_APP_FIREBASE_PROJECT_ID=your-project-id<br/>
                REACT_APP_FIREBASE_APP_ID=your-app-id<br/>
                REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com<br/>
                REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
              </code>
            </div>
            <p className={`mt-4 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              After updating the .env file, restart your development server.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-black via-gray-900 to-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          isDarkMode ? 'bg-purple-500/20' : 'bg-purple-300/30'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
          isDarkMode ? 'bg-blue-500/20' : 'bg-blue-300/30'
        }`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative w-full max-w-md p-8 rounded-2xl backdrop-blur-md border ${
          isDarkMode 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/80 border-gray-200'
        }`}
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`mb-6 flex items-center gap-2 text-sm font-medium transition-colors ${
            isDarkMode 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Back
          </h1>
          <p className={`${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mt-4 text-sm p-3 rounded-lg ${isDarkMode ? 'bg-green-500/10 text-green-300' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}
        {error && (
          <div className={`mt-4 text-sm p-3 rounded-lg ${isDarkMode ? 'bg-red-500/10 text-red-300' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        )}

        {/* Social Login */}
        <div className="mt-6">
          <div className={`relative text-center text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span className={`px-3 ${
              isDarkMode ? 'bg-gray-900' : 'bg-white'
            }`}>
              Sign in with
            </span>
            <div className={`absolute inset-0 flex items-center ${
              isDarkMode ? 'border-gray-700' : 'border-gray-300'
            }`}>
              <div className="w-full border-t"></div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <button 
              onClick={handleGoogle} 
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-6 py-3 border rounded-lg font-medium transition-colors ${
              isDarkMode 
                ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
            
            <button 
              onClick={handleGitHub} 
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-6 py-3 border rounded-lg font-medium transition-colors ${
              isDarkMode 
                ? 'border-white/20 text-gray-300 hover:bg-white/10' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Signing in...' : 'Continue with GitHub'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
