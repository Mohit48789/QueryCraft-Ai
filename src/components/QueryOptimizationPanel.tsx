import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Copy, 
  Check, 
  Share2,
  MessageSquare,
  BarChart3,
  Code2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { QueryOptimizationService, QueryOptimization, ExecutionPlanNode, QuerySharingService } from '../services/aiService';

interface QueryOptimizationPanelProps {
  sqlQuery: string;
  naturalLanguageQuery: string;
  schema: any;
  isDarkMode?: boolean;
}

export const QueryOptimizationPanel: React.FC<QueryOptimizationPanelProps> = ({
  sqlQuery,
  naturalLanguageQuery,
  schema,
  isDarkMode = true
}) => {
  const [optimization, setOptimization] = useState<QueryOptimization | null>(null);
  const [activeTab, setActiveTab] = useState<'optimization' | 'execution' | 'alternatives' | 'explanation'>('optimization');
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (sqlQuery) {
      const analysis = QueryOptimizationService.analyzeQuery(sqlQuery, schema);
      setOptimization(analysis);
    }
  }, [sqlQuery, schema]);

  const handleCopyQuery = async (query: string) => {
    try {
      await navigator.clipboard.writeText(query);
      setCopiedQuery(query);
      setTimeout(() => setCopiedQuery(null), 2000);
    } catch (err) {
      console.error('Failed to copy query:', err);
    }
  };

  const handleShareQuery = () => {
    const shareId = QuerySharingService.shareQuery(naturalLanguageQuery, sqlQuery, schema);
    const url = QuerySharingService.getShareableUrl(shareId);
    setShareUrl(url);
    navigator.clipboard.writeText(url);
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderExecutionPlanNode = (node: ExecutionPlanNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`ml-${depth * 4} mb-2`}
      >
        <div
          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50' 
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          }`}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasChildren && (
                isExpanded ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
              )}
              <div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {node.operation}
                  {node.table && <span className="text-blue-400 ml-2">({node.table})</span>}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {node.details}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                Cost: {node.cost}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Rows: {node.rows}
              </div>
            </div>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2"
          >
            {node.children.map(child => renderExecutionPlanNode(child, depth + 1))}
          </motion.div>
        )}
      </motion.div>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return isDarkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 60) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    return isDarkMode ? 'text-red-400' : 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return isDarkMode ? 'bg-green-500/20' : 'bg-green-100';
    if (score >= 60) return isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100';
    return isDarkMode ? 'bg-red-500/20' : 'bg-red-100';
  };

  if (!optimization) {
    return (
      <div className={`mt-6 p-6 rounded-xl border ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="animate-pulse">
          <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-1/4 mb-4`}></div>
          <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-full mb-2`}></div>
          <div className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4`}></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mt-6 rounded-xl border ${
        isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Query Analysis & Optimization
            </h3>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Performance Score */}
            <div className={`px-4 py-2 rounded-lg ${getScoreBg(optimization.performanceScore)}`}>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${getScoreColor(optimization.performanceScore)}`} />
                <span className={`font-medium ${getScoreColor(optimization.performanceScore)}`}>
                  {optimization.performanceScore}/100
                </span>
              </div>
            </div>
            
            {/* Share Button */}
            <button
              onClick={handleShareQuery}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {shareUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}
          >
            <div className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
              ✓ Share URL copied to clipboard!
            </div>
          </motion.div>
        )}
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {[
          { id: 'optimization', label: 'Optimization', icon: Zap },
          { id: 'execution', label: 'Execution Plan', icon: BarChart3 },
          { id: 'alternatives', label: 'Alternatives', icon: Code2 },
          { id: 'explanation', label: 'Plain English', icon: MessageSquare }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === tab.id
                ? isDarkMode 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-blue-600 border-b-2 border-blue-600'
                : isDarkMode 
                  ? 'text-gray-400 hover:text-gray-300' 
                  : 'text-gray-600 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'optimization' && (
          <div className="space-y-6">
            {/* Optimization Hints */}
            {optimization.optimizationHints.length > 0 && (
              <div>
                <h4 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Optimization Hints
                </h4>
                <div className="space-y-2">
                  {optimization.optimizationHints.map((hint, index) => (
                    <div 
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        isDarkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                        {hint}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Recommendations */}
            {optimization.performanceRecommendations.length > 0 && (
              <div>
                <h4 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Performance Recommendations
                </h4>
                <div className="space-y-2">
                  {optimization.performanceRecommendations.map((rec, index) => (
                    <div 
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <Lightbulb className={`w-4 h-4 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                        {rec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'execution' && (
          <div>
            <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Execution Plan
            </h4>
            <div className="space-y-2">
              {optimization.executionPlan.map(node => renderExecutionPlanNode(node))}
            </div>
          </div>
        )}

        {activeTab === 'alternatives' && (
          <div>
            <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Alternative Query Suggestions
            </h4>
            <div className="space-y-4">
              {optimization.alternativeQueries.map((query, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Alternative {index + 1}
                    </span>
                    <button
                      onClick={() => handleCopyQuery(query)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                        copiedQuery === query
                          ? isDarkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                          : isDarkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {copiedQuery === query ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedQuery === query ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className={`text-sm overflow-x-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {query}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'explanation' && (
          <div>
            <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Plain English Explanation
            </h4>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
              <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {optimization.plainEnglishExplanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
