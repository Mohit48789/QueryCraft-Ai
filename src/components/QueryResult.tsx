import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, AlertTriangle, Lightbulb, Code, FileText, Eye, Play, Zap } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { QueryResponse, DatabaseSchema } from '../types';
import { QueryVisualizer } from './QueryVisualizer';
import { SQLProcessModal } from './SQLProcessModal';
import { QueryOptimizationPanel } from './QueryOptimizationPanel';

interface QueryResultProps {
  result: QueryResponse | null;
  isLoading: boolean;
  isDarkMode?: boolean;
  schema: DatabaseSchema;
  showButtons?: boolean;
}

export const QueryResult: React.FC<QueryResultProps> = ({ result, isLoading, isDarkMode = true, schema, showButtons = false }) => {
  const [copied, setCopied] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showOptimization, setShowOptimization] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500/20';
    if (confidence >= 60) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-medium">Generating SQL query...</p>
            <p className="text-gray-400 text-sm mt-1">This may take a few seconds</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No query generated yet</p>
            <p className="text-gray-500 text-sm mt-1">Enter a natural language query to get started</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SQL Query Result */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          isDarkMode 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white border-gray-200'
        } backdrop-blur-md rounded-2xl p-6 border space-y-6`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Generated SQL Query
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {result && showButtons && (
              <>
                <button
                  onClick={() => setShowProcessModal(true)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  Show Process
                </button>
                <button
                  onClick={() => setShowOptimization(!showOptimization)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  {showOptimization ? 'Hide' : 'Show'} Analysis
                </button>
                <button
                  onClick={() => setShowVisualizer(!showVisualizer)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  {showVisualizer ? 'Hide' : 'Show'} Schema
                </button>
              </>
            )}
            <div className={`px-3 py-1 rounded-full ${getConfidenceBg(result.confidence)}`}>
              <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                {result.confidence}% confidence
              </span>
            </div>
          </div>
        </div>

      {/* SQL Query */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>SQL Query</h3>
          <button
            onClick={() => copyToClipboard(result.sqlQuery)}
            className={`flex items-center gap-1 px-2 py-1 text-xs transition-colors rounded ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className={`rounded-lg overflow-hidden ${isDarkMode ? '' : 'border border-gray-200'}`}>
          <SyntaxHighlighter
            language="sql"
            style={isDarkMode ? tomorrow : oneLight}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : '#f9fafb',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            }}
          >
            {result.sqlQuery}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Explanation */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FileText className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Explanation</h3>
        </div>
        <p className={`text-sm leading-relaxed p-4 rounded-lg ${
          isDarkMode 
            ? 'text-gray-300 bg-white/5 border border-white/10'
            : 'text-gray-700 bg-gray-50 border border-gray-200'
        }`}>
          {result.explanation}
        </p>
      </div>

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Warnings</h3>
          </div>
          <div className="space-y-2">
            {result.warnings.map((warning, index) => (
              <div key={index} className={`flex items-start gap-2 p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-yellow-500/10 border-yellow-500/20'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Suggestions</h3>
          </div>
          <div className="space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className={`flex items-start gap-2 p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-purple-50 border-purple-200'
              }`}>
                <Lightbulb className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}`}>{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      </motion.div>

      {/* Query Optimization Panel */}
      {result && showButtons && showOptimization && (
        <QueryOptimizationPanel
          sqlQuery={result.sqlQuery}
          naturalLanguageQuery="Show me all users and their orders"
          schema={schema}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Query Visualizer */}
      {result && showButtons && showVisualizer && (
        <QueryVisualizer 
          schema={schema} 
          sqlQuery={result.sqlQuery} 
          isDarkMode={isDarkMode}
        />
      )}

      {/* SQL Process Modal */}
      {result && showButtons && (
        <SQLProcessModal
          isOpen={showProcessModal}
          onClose={() => setShowProcessModal(false)}
          naturalLanguageQuery="Show me all users and their orders"
          sqlQuery={result.sqlQuery}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};
