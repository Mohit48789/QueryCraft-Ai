import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Settings, ChevronDown } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string, databaseType: string) => void;
  isLoading: boolean;
  onApiKeyChange: (apiKey: string) => void;
  hasApiKey: boolean;
  isDarkMode?: boolean;
}

export const QueryInput: React.FC<QueryInputProps> = ({ 
  onSubmit, 
  isLoading, 
  onApiKeyChange, 
  hasApiKey,
  isDarkMode = true
}) => {
  const [query, setQuery] = useState('');
  const [databaseType, setDatabaseType] = useState('mysql');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Rehydrate persisted inputs on mount
  useEffect(() => {
    try {
      const storedQuery = localStorage.getItem('naturalLanguageQuery');
      if (storedQuery) setQuery(storedQuery);

      const storedApiKey = localStorage.getItem('apiKey');
      if (storedApiKey) {
        setApiKey(storedApiKey);
        onApiKeyChange(storedApiKey);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [onApiKeyChange]);

  // Persist query as user types so it survives navigation/refresh
  useEffect(() => {
    try {
      localStorage.setItem('naturalLanguageQuery', query);
    } catch (e) {}
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && hasApiKey) {
      onSubmit(query.trim(), databaseType);
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      onApiKeyChange(apiKey.trim());
      try {
        localStorage.setItem('apiKey', apiKey.trim());
      } catch (e) {}
      setShowSettings(false);
    }
  };

  const sampleQueries = [
    "Show me all users who registered in the last 30 days",
    "Find the top 5 products by sales revenue",
    "Get customers with more than 10 orders",
    "List employees with their department names",
    "Show monthly revenue trends for this year"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`backdrop-blur-md rounded-2xl p-6 border transition-colors ${
        isDarkMode 
          ? 'bg-white/10 border-white/20' 
          : 'bg-white/80 border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>AI Query Generator</h2>
      </div>

      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`mb-6 p-4 rounded-xl border ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>API Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Google Gemini API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className={`flex-1 px-4 py-2 rounded-lg focus:outline-none ${
                    isDarkMode
                      ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400'
                      : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  }`}
                />
                <button
                  onClick={handleApiKeySubmit}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  Save
                </button>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your API key is stored locally and never sent to our servers. Get your free API key from Google AI Studio.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Database Type
          </label>
          <div className="relative">
            <select
              value={databaseType}
              onChange={(e) => setDatabaseType(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none appearance-none pr-10 ${
                isDarkMode
                  ? 'bg-white/10 border border-white/20 text-white focus:border-blue-400'
                  : 'bg-white border border-gray-300 text-gray-900 focus:border-blue-500'
              }`}
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="sqlite">SQLite</option>
              <option value="mssql">Microsoft SQL Server</option>
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`} />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Describe what you want to query
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Show me all customers who made purchases in the last month with their total spending..."
            rows={4}
            className={`w-full px-4 py-3 rounded-lg focus:outline-none resize-none ${
              isDarkMode
                ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-blue-400'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={!query.trim() || !hasApiKey || isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg transition-all font-medium disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Generate SQL Query
            </>
          )}
        </button>
      </form>


      <div className="mt-6">
        <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sample Queries</h3>
        <div className="space-y-2">
          {sampleQueries.map((sample, index) => (
            <button
              key={index}
              onClick={() => setQuery(sample)}
              className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200'
              }`}
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
