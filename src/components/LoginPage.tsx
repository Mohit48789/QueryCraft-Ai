import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';


interface LoginPageProps {
  isDarkMode: boolean;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ isDarkMode, onBack }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
      setMessage('Login successful!');
      setError(null);
      setTimeout(() => onBack(), 500);
    } catch (e: any) {
      setError(e?.message || 'Login failed');
      setMessage(null);
    }
  };

  const handleLogout = () => {
    try {
      logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (e: any) {
      setError(e?.message || 'Logout failed');
    }
  };

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

        {/* Auth0 Login/Logout */}
        <div className="mt-6 space-y-4">
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-900 hover:bg-black text-white'
              }`}
            >
              {isLoading ? 'Loading…' : 'Log In with Auth0'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                You are signed in{user?.name ? ` as ${user.name}` : ''}.
              </div>
              <button
                onClick={handleLogout}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Log Out
              </button>
              {user && (
                <div className={`mt-2 p-4 rounded-lg border ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {user.picture && (
                      <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                    )}
                    <div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};