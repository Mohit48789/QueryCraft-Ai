import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Zap, Eye, Share2, Sun, Moon, Maximize2, Minimize2 } from 'lucide-react';
import { QueryInput } from '../components/QueryInput';
import { QueryResult } from '../components/QueryResult';
import { AboutSection } from '../components/AboutSection';
import { QueryResponse, DatabaseSchema } from '../types';
import { AIService } from '../services/aiService';

interface HomePageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onLoginClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ isDarkMode, toggleDarkMode, onLoginClick }) => {
  const navigate = useNavigate();
  const [queryResult, setQueryResult] = useState<QueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>('');
  const queryResultRef = useRef<HTMLDivElement>(null);

  // Sample database schema
  const schema: DatabaseSchema = {
    id: 'sample_db',
    name: 'Sample Database',
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false },
          { name: 'name', type: 'VARCHAR(100)', isPrimaryKey: false, isForeignKey: false },
          { name: 'email', type: 'VARCHAR(255)', isPrimaryKey: false, isForeignKey: false },
          { name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, isForeignKey: false }
        ]
      },
      {
        name: 'orders',
        columns: [
          { name: 'id', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false },
          { name: 'user_id', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true },
          { name: 'product_name', type: 'VARCHAR(200)', isPrimaryKey: false, isForeignKey: false },
          { name: 'amount', type: 'DECIMAL(10,2)', isPrimaryKey: false, isForeignKey: false },
          { name: 'order_date', type: 'TIMESTAMP', isPrimaryKey: false, isForeignKey: false }
        ]
      }
    ]
  };

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      // Check for environment API key first
      const envApiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;
      if (envApiKey) {
        console.log('Environment API key found, length:', envApiKey.length);
        setApiKey(envApiKey);
        setHasApiKey(true);
      } else {
        // Fall back to localStorage
        const storedApiKey = localStorage.getItem('apiKey');
        if (storedApiKey) {
          setApiKey(storedApiKey);
          setHasApiKey(true);
        }
      }

      const storedResult = localStorage.getItem('queryResult');
      const storedNLQ = localStorage.getItem('naturalLanguageQuery');

      if (storedResult) {
        setQueryResult(JSON.parse(storedResult));
      }
      if (storedNLQ) {
        setNaturalLanguageQuery(storedNLQ);
      }
      
      // Store schema if not already stored
      const storedSchema = localStorage.getItem('schema');
      if (!storedSchema) {
        localStorage.setItem('schema', JSON.stringify(schema));
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Persist queryResult changes
  useEffect(() => {
    try {
      if (queryResult) {
        localStorage.setItem('queryResult', JSON.stringify(queryResult));
      }
    } catch (e) {}
  }, [queryResult]);

  const handleNavigateToProcess = () => {
    if (queryResult) {
      navigate('/process', { 
        state: { 
          sqlQuery: queryResult.sqlQuery, 
          naturalLanguageQuery,
          isDarkMode 
        } 
      });
    }
  };

  const handleNavigateToAnalysis = () => {
    if (queryResult) {
      navigate('/analysis', { 
        state: { 
          sqlQuery: queryResult.sqlQuery, 
          naturalLanguageQuery,
          schema,
          isDarkMode 
        } 
      });
    }
  };

  const handleNavigateToSchema = () => {
    if (queryResult) {
      navigate('/schema', { 
        state: { 
          sqlQuery: queryResult.sqlQuery, 
          schema,
          isDarkMode 
        } 
      });
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const scrollToQueryResult = () => {
    if (queryResultRef.current) {
      queryResultRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-black text-white' 
        : 'bg-white text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 pt-8"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            QueryCraft AI
          </h1>
          <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Transform natural language into optimized SQL queries with advanced AI analysis
          </p>
        </motion.div>

        {/* Query Input Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <QueryInput 
            onSubmit={async (query: string, databaseType: string) => {
              setIsLoading(true);
              setNaturalLanguageQuery(query);
              try {
                localStorage.setItem('naturalLanguageQuery', query);
                localStorage.setItem('schema', JSON.stringify(schema));
              } catch (e) {}

              try {
                console.log('Using API key:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'Missing');
                console.log('API key length:', apiKey?.length || 0);
                
                if (!apiKey) {
                  throw new Error('No API key found. Please add your Gemini API key in Settings.');
                }
                
                const service = new AIService(apiKey, 'gemini');
                const response = await service.generateSQLQuery({
                  naturalLanguageQuery: query,
                  schema,
                  databaseType: databaseType as any
                });
                setQueryResult(response);
                scrollToQueryResult(); // Scroll to results after successful generation
              } catch (err: any) {
                console.error('Query generation error:', err);
                setQueryResult({
                  sqlQuery: '',
                  explanation: err?.message || 'Failed to generate SQL query.',
                  confidence: 0,
                  warnings: [],
                  suggestions: []
                });
              } finally {
                setIsLoading(false);
              }
            }}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
            hasApiKey={hasApiKey}
            onApiKeyChange={(key: string) => {
              // Only update state if no environment key exists
              const envApiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;
              if (!envApiKey) {
                setApiKey(key);
                setHasApiKey(!!key);
              }
            }}
          />
        </div>

        {/* Generated SQL Query Section */}
        {queryResult && (
          <div className="max-w-4xl mx-auto mb-8" ref={queryResultRef}>
            <QueryResult 
              result={queryResult}
              isLoading={isLoading}
              isDarkMode={isDarkMode}
              schema={schema}
              showButtons={false} // Hide the toggle buttons on home page
            />
            
            {/* Enhanced Advanced Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`mt-6 rounded-xl border transition-all duration-300 ${
                isFullScreen 
                  ? 'fixed inset-0 z-50 m-0 rounded-none overflow-y-auto' 
                  : 'relative'
              } ${
                isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Header with Full Screen Toggle Only */}
              <div className={`sticky top-0 z-10 p-6 border-b ${
                isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-50/80 border-gray-200'
              } backdrop-blur-sm`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    🚀 Explore Advanced Features
                  </h3>
                  <div className="flex items-center gap-3">
                    {/* Full Screen Toggle Only */}
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

              {/* Content */}
              <div className="p-6">
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${
                  isFullScreen ? 'max-w-6xl mx-auto' : ''
                }`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNavigateToProcess}
                    className={`group flex items-start gap-4 p-6 rounded-xl transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-300 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 hover:border-green-400/50'
                        : 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200 border border-green-200 hover:border-green-300'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-green-500/30' : 'bg-green-500/20'
                    }`}>
                      <Play className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-lg mb-2">Show Process</div>
                      <div className="text-sm opacity-80 leading-relaxed">
                        Step-by-step SQL creation process with detailed explanations of each transformation
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNavigateToAnalysis}
                    className={`group flex items-start gap-4 p-6 rounded-xl transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 text-yellow-300 hover:from-yellow-500/30 hover:to-amber-500/30 border border-yellow-500/30 hover:border-yellow-400/50'
                        : 'bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-700 hover:from-yellow-200 hover:to-amber-200 border border-yellow-200 hover:border-yellow-300'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-yellow-500/30' : 'bg-yellow-500/20'
                    }`}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-lg mb-2">Show Analysis</div>
                      <div className="text-sm opacity-80 leading-relaxed">
                        Performance optimization analysis with execution plans and improvement suggestions
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNavigateToSchema}
                    className={`group flex items-start gap-4 p-6 rounded-xl transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-300 hover:from-blue-500/30 hover:to-indigo-500/30 border border-blue-500/30 hover:border-blue-400/50'
                        : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 border border-blue-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-blue-500/30' : 'bg-blue-500/20'
                    }`}>
                      <Eye className="w-6 h-6" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-lg mb-2">Show Schema</div>
                      <div className="text-sm opacity-80 leading-relaxed">
                        Interactive database schema visualization with table relationships and metadata
                      </div>
                    </div>
                  </motion.button>
                </div>

                {/* Additional Info in Full Screen */}
                {isFullScreen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-8 p-6 rounded-xl ${
                      isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100/50 border-gray-300'
                    } border`}
                  >
                    <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      💡 Pro Tips
                    </h4>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <div>
                        <strong>Process View:</strong> Understand how your natural language gets converted to SQL step by step
                      </div>
                      <div>
                        <strong>Analysis View:</strong> Get performance insights and optimization recommendations
                      </div>
                      <div>
                        <strong>Schema View:</strong> Visualize your database structure and relationships
                      </div>
                      <div>
                        <strong>Dark Mode:</strong> Toggle between light and dark themes for better viewing experience
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* About Section */}
        <div className="max-w-4xl mx-auto">
          <AboutSection isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};
