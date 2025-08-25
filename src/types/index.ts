export interface DatabaseSchema {
  id: string;
  name: string;
  tables: Table[];
}

export interface Table {
  name: string;
  columns: Column[];
  relationships?: Relationship[];
}

export interface Column {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isNullable?: boolean;
  description?: string;
}

export interface Relationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  targetTable: string;
  foreignKey: string;
  targetKey: string;
}

export interface QueryRequest {
  naturalLanguageQuery: string;
  schema: DatabaseSchema;
  databaseType: 'mysql' | 'postgresql' | 'sqlite' | 'mssql';
}

export interface QueryResponse {
  sqlQuery: string;
  explanation: string;
  confidence: number;
  warnings?: string[];
  suggestions?: string[];
}

export interface QueryHistory {
  id: string;
  timestamp: Date;
  naturalLanguage: string;
  sqlQuery: string;
  databaseType: string;
  success: boolean;
}

export interface AIProvider {
  name: string;
  apiKey: string;
  model: string;
}

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  verificationCode?: string;
  createdAt: number;
  displayName?: string;
}
