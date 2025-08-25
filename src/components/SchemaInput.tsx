import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Database, Table as TableIcon } from 'lucide-react';
import { DatabaseSchema, Table, Column } from '../types';

interface SchemaInputProps {
  schema: DatabaseSchema;
  onSchemaChange: (schema: DatabaseSchema) => void;
  isDarkMode?: boolean;
}

export const SchemaInput: React.FC<SchemaInputProps> = ({ schema, onSchemaChange, isDarkMode = true }) => {
  const [activeTable, setActiveTable] = useState<string | null>(null);

  const addTable = () => {
    const newTable: Table = {
      name: `table_${schema.tables.length + 1}`,
      columns: [
        { name: 'id', type: 'INT', isPrimaryKey: true, isNullable: false }
      ]
    };

    onSchemaChange({
      ...schema,
      tables: [...schema.tables, newTable]
    });
  };

  const removeTable = (index: number) => {
    onSchemaChange({
      ...schema,
      tables: schema.tables.filter((_, i) => i !== index)
    });
  };

  const updateTable = (index: number, updatedTable: Table) => {
    const newTables = [...schema.tables];
    newTables[index] = updatedTable;
    onSchemaChange({
      ...schema,
      tables: newTables
    });
  };

  const addColumn = (tableIndex: number) => {
    const newColumn: Column = {
      name: 'new_column',
      type: 'VARCHAR(255)',
      isNullable: true
    };

    const updatedTable = {
      ...schema.tables[tableIndex],
      columns: [...schema.tables[tableIndex].columns, newColumn]
    };

    updateTable(tableIndex, updatedTable);
  };

  const removeColumn = (tableIndex: number, columnIndex: number) => {
    const updatedTable = {
      ...schema.tables[tableIndex],
      columns: schema.tables[tableIndex].columns.filter((_, i) => i !== columnIndex)
    };

    updateTable(tableIndex, updatedTable);
  };

  const updateColumn = (tableIndex: number, columnIndex: number, updatedColumn: Column) => {
    const updatedTable = {
      ...schema.tables[tableIndex],
      columns: schema.tables[tableIndex].columns.map((col, i) => 
        i === columnIndex ? updatedColumn : col
      )
    };

    updateTable(tableIndex, updatedTable);
  };

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
        <Database className="w-6 h-6 text-blue-400" />
        <h2 className={`text-xl font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Database Schema</h2>
      </div>

      <div className="space-y-4">
        {schema.tables.map((table, tableIndex) => (
          <motion.div
            key={tableIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-green-400" />
                <input
                  type="text"
                  value={table.name}
                  onChange={(e) => updateTable(tableIndex, { ...table, name: e.target.value })}
                  className="bg-transparent text-white font-medium text-lg border-none outline-none focus:bg-white/10 rounded px-2 py-1"
                />
              </div>
              <button
                onClick={() => removeTable(tableIndex)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {table.columns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <input
                    type="text"
                    value={column.name}
                    onChange={(e) => updateColumn(tableIndex, columnIndex, { ...column, name: e.target.value })}
                    className="flex-1 bg-transparent text-white border-none outline-none focus:bg-white/10 rounded px-2 py-1"
                    placeholder="Column name"
                  />
                  <select
                    value={column.type}
                    onChange={(e) => updateColumn(tableIndex, columnIndex, { ...column, type: e.target.value })}
                    className="bg-white/10 text-white border border-white/20 rounded px-3 py-1 focus:outline-none focus:border-blue-400"
                  >
                    <option value="INT">INT</option>
                    <option value="VARCHAR(255)">VARCHAR(255)</option>
                    <option value="TEXT">TEXT</option>
                    <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                    <option value="DATE">DATE</option>
                    <option value="DATETIME">DATETIME</option>
                    <option value="BOOLEAN">BOOLEAN</option>
                  </select>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={column.isPrimaryKey || false}
                        onChange={(e) => updateColumn(tableIndex, columnIndex, { ...column, isPrimaryKey: e.target.checked })}
                        className="rounded"
                      />
                      PK
                    </label>
                    <label className="flex items-center gap-1 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={!column.isNullable}
                        onChange={(e) => updateColumn(tableIndex, columnIndex, { ...column, isNullable: !e.target.checked })}
                        className="rounded"
                      />
                      NOT NULL
                    </label>
                  </div>
                  <button
                    onClick={() => removeColumn(tableIndex, columnIndex)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => addColumn(tableIndex)}
              className="mt-3 flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Column
            </button>
          </motion.div>
        ))}
      </div>

      <button
        onClick={addTable}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Table
      </button>
    </motion.div>
  );
};
