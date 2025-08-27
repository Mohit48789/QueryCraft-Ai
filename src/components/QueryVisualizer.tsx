/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import { motion } from 'framer-motion';
import { Database, ArrowRight, Table, Key, Link, Search, Filter, SortAsc } from 'lucide-react';
import { DatabaseSchema } from '../types';

interface QueryVisualizerProps {
  schema: DatabaseSchema;
  sqlQuery: string;
  isDarkMode?: boolean;
}

export const QueryVisualizer: React.FC<QueryVisualizerProps> = ({ 
  schema, 
  sqlQuery, 
  isDarkMode = true 
}) => {
  // Parse SQL to identify involved tables and operations
  const parseQuery = (query: string) => {
    const upperQuery = query.toUpperCase();
    const tables: string[] = [];
    const operations: string[] = [];
    
    // Extract tables from FROM and JOIN clauses
    const fromMatch = query.match(/FROM\s+(\w+)/i);
    if (fromMatch) tables.push(fromMatch[1]);
    
    const joinMatches = query.match(/JOIN\s+(\w+)/gi);
    if (joinMatches) {
      joinMatches.forEach(match => {
        const table = match.replace(/JOIN\s+/i, '');
        if (!tables.includes(table)) tables.push(table);
      });
    }
    
    // Identify operations
    if (upperQuery.includes('SELECT')) operations.push('SELECT');
    if (upperQuery.includes('WHERE')) operations.push('WHERE');
    if (upperQuery.includes('JOIN')) operations.push('JOIN');
    if (upperQuery.includes('GROUP BY')) operations.push('GROUP BY');
    if (upperQuery.includes('ORDER BY')) operations.push('ORDER BY');
    if (upperQuery.includes('HAVING')) operations.push('HAVING');
    if (upperQuery.includes('LIMIT')) operations.push('LIMIT');
    
    return { tables, operations };
  };

  const { tables: involvedTables, operations } = parseQuery(sqlQuery);

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'SELECT': return Search;
      case 'WHERE': return Filter;
      case 'JOIN': return Link;
      case 'ORDER BY': return SortAsc;
      case 'GROUP BY': return Database;
      default: return Table;
    }
  };

  const getTableInfo = (tableName: string) => {
    return schema.tables.find(table => 
      table.name.toLowerCase() === tableName.toLowerCase()
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mt-6 p-6 rounded-xl border ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <Database className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Query Analysis & Schema Mapping
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Involved Tables */}
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Table className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Tables Involved
            </h4>
          </div>
          
          <div className="space-y-3">
            {involvedTables.map((tableName, index) => {
              const tableInfo = getTableInfo(tableName);
              return (
                <motion.div
                  key={tableName}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Database className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      {tableName}
                    </span>
                  </div>
                  {tableInfo && (
                    <div className="ml-6 space-y-1">
                      {tableInfo.columns.slice(0, 4).map((column) => (
                        <div key={column.name} className="flex items-center gap-2 text-sm">
                          {column.isPrimaryKey && (
                            <Key className={`w-3 h-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                          )}
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                            {column.name}
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ({column.type})
                          </span>
                        </div>
                      ))}
                      {tableInfo.columns.length > 4 && (
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          +{tableInfo.columns.length - 4} more columns
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* SQL Operations */}
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Search className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Operations Used
            </h4>
          </div>
          
          <div className="space-y-2">
            {operations.map((operation, index) => {
              const IconComponent = getOperationIcon(operation);
              return (
                <motion.div
                  key={operation}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isDarkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                    {operation}
                  </span>
                  {index < operations.length - 1 && (
                    <ArrowRight className={`w-4 h-4 ml-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
