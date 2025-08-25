import axios from 'axios';
import { QueryRequest, QueryResponse, UserAccount } from '../types';

// Query sharing service
export interface SharedQuery {
  id: string;
  naturalLanguageQuery: string;
  sqlQuery: string;
  timestamp: number;
  schema: any;
}

export class QuerySharingService {
  private static queries: Map<string, SharedQuery> = new Map();

  static generateShareId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  static shareQuery(naturalLanguageQuery: string, sqlQuery: string, schema: any): string {
    const id = this.generateShareId();
    const sharedQuery: SharedQuery = {
      id,
      naturalLanguageQuery,
      sqlQuery,
      timestamp: Date.now(),
      schema
    };
    
    this.queries.set(id, sharedQuery);
    return id;
  }

  static getSharedQuery(id: string): SharedQuery | null {
    return this.queries.get(id) || null;
  }

  static getShareableUrl(id: string): string {
    return `${window.location.origin}${window.location.pathname}?shared=${id}`;
  }
}

// Query optimization and analysis service
export interface QueryOptimization {
  performanceScore: number;
  optimizationHints: string[];
  executionPlan: ExecutionPlanNode[];
  alternativeQueries: string[];
  performanceRecommendations: string[];
  plainEnglishExplanation: string;
}

export interface ExecutionPlanNode {
  id: string;
  operation: string;
  table?: string;
  cost: number;
  rows: number;
  children: ExecutionPlanNode[];
  details: string;
}

export class QueryOptimizationService {
  static analyzeQuery(sqlQuery: string, schema: any): QueryOptimization {
    // Analyze the actual SQL query for real insights
    const analysis = this.performStaticAnalysis(sqlQuery, schema);
    
    return {
      performanceScore: analysis.score,
      optimizationHints: analysis.hints,
      executionPlan: analysis.executionPlan,
      alternativeQueries: analysis.alternatives,
      performanceRecommendations: analysis.recommendations,
      plainEnglishExplanation: analysis.explanation
    };
  }

  private static performStaticAnalysis(sqlQuery: string, schema: any) {
    const upperQuery = sqlQuery.toUpperCase();
    const hints: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check for common performance issues based on actual query
    if (upperQuery.includes('SELECT *')) {
      hints.push('Avoid SELECT * - specify only needed columns');
      recommendations.push('Replace SELECT * with specific column names to reduce data transfer');
      score -= 15;
    }

    if (!upperQuery.includes('LIMIT') && upperQuery.includes('SELECT')) {
      hints.push('Consider adding LIMIT clause for large datasets');
      recommendations.push('Add LIMIT clause to prevent returning excessive rows');
      score -= 10;
    }

    if (upperQuery.includes('WHERE') && !upperQuery.includes('INDEX')) {
      hints.push('Ensure WHERE clause columns are indexed');
      recommendations.push('Create indexes on frequently queried columns');
      score -= 20;
    }

    if (upperQuery.includes('ORDER BY') && !upperQuery.includes('LIMIT')) {
      hints.push('ORDER BY without LIMIT can be expensive');
      recommendations.push('Consider adding LIMIT when using ORDER BY');
      score -= 15;
    }

    // Check for JOIN optimizations
    if (upperQuery.includes('JOIN')) {
      const joinCount = (upperQuery.match(/JOIN/g) || []).length;
      if (joinCount > 2) {
        hints.push(`Multiple JOINs (${joinCount}) may impact performance`);
        recommendations.push('Consider if all JOINs are necessary or if subqueries would be more efficient');
        score -= 25;
      }
    }

    // Check for subquery usage
    if (upperQuery.includes('SELECT') && upperQuery.includes('(') && upperQuery.includes(')')) {
      hints.push('Subqueries detected - consider JOINs for better performance');
      recommendations.push('Rewrite subqueries as JOINs when possible');
      score -= 20;
    }

    // Check for aggregation without GROUP BY
    if ((upperQuery.includes('COUNT') || upperQuery.includes('SUM') || upperQuery.includes('AVG')) && !upperQuery.includes('GROUP BY')) {
      hints.push('Aggregate functions without GROUP BY may return unexpected results');
      recommendations.push('Add GROUP BY clause if you need grouped results');
      score -= 10;
    }

    // Generate execution plan based on actual query
    const executionPlan = this.generateExecutionPlan(sqlQuery);
    
    // Generate alternative queries based on actual query
    const alternatives = this.generateAlternativeQueries(sqlQuery);
    
    // Generate plain English explanation based on actual query
    const explanation = this.generatePlainEnglishExplanation(sqlQuery);

    return {
      score: Math.max(score, 0),
      hints,
      recommendations,
      executionPlan,
      alternatives,
      explanation
    };
  }

  private static generateExecutionPlan(sqlQuery: string): ExecutionPlanNode[] {
    // Generate execution plan based on actual query structure
    const upperQuery = sqlQuery.toUpperCase();
    const plan: ExecutionPlanNode[] = [];

    // Parse the query to understand its structure
    const hasSelect = upperQuery.includes('SELECT');
    const hasFrom = upperQuery.includes('FROM');
    const hasWhere = upperQuery.includes('WHERE');
    const hasJoin = upperQuery.includes('JOIN');
    const hasOrderBy = upperQuery.includes('ORDER BY');
    const hasGroupBy = upperQuery.includes('GROUP BY');
    const hasLimit = upperQuery.includes('LIMIT');

    // Base scan operation
    if (hasFrom) {
      const tableName = this.extractTableName(sqlQuery);
      const scanNode: ExecutionPlanNode = {
        id: '1',
        operation: hasJoin ? 'Index Scan' : 'Seq Scan',
        table: tableName,
        cost: hasJoin ? 50.0 : 100.0,
        rows: hasWhere ? 500 : 1000,
        children: [],
        details: hasJoin ? 'Index scan on table' : 'Sequential scan on table'
      };
      plan.push(scanNode);
    }

    // JOIN operations
    if (hasJoin) {
      const joinCount = (upperQuery.match(/JOIN/g) || []).length;
      const joinNode: ExecutionPlanNode = {
        id: '2',
        operation: 'Hash Join',
        cost: 250.0 + (joinCount * 100),
        rows: 500,
        children: [],
        details: `Hash join between ${joinCount + 1} tables`
      };
      plan.push(joinNode);
    }

    // WHERE clause filtering
    if (hasWhere) {
      const filterNode: ExecutionPlanNode = {
        id: '3',
        operation: 'Filter',
        cost: 75.0,
        rows: 250,
        children: [],
        details: 'Apply WHERE clause conditions'
      };
      plan.push(filterNode);
    }

    // GROUP BY operation
    if (hasGroupBy) {
      const groupNode: ExecutionPlanNode = {
        id: '4',
        operation: 'HashAggregate',
        cost: 150.0,
        rows: 100,
        children: [],
        details: 'Group data by specified columns'
      };
      plan.push(groupNode);
    }

    // ORDER BY operation
    if (hasOrderBy) {
      const sortNode: ExecutionPlanNode = {
        id: '5',
        operation: 'Sort',
        cost: 150.0,
        rows: hasLimit ? 100 : 250,
        children: [],
        details: 'Sort operation for ORDER BY clause'
      };
      plan.push(sortNode);
    }

    // LIMIT operation
    if (hasLimit) {
      const limitMatch = sqlQuery.match(/LIMIT\s+(\d+)/i);
      const limitValue = limitMatch ? parseInt(limitMatch[1]) : 100;
      const limitNode: ExecutionPlanNode = {
        id: '6',
        operation: 'Limit',
        cost: 25.0,
        rows: limitValue,
        children: [],
        details: `Limit results to ${limitValue} rows`
      };
      plan.push(limitNode);
    }

    return plan;
  }

  private static extractTableName(sqlQuery: string): string {
    const match = sqlQuery.match(/FROM\s+(\w+)/i);
    return match ? match[1] : 'unknown_table';
  }

  private static generateAlternativeQueries(sqlQuery: string): string[] {
    const alternatives: string[] = [];
    const upperQuery = sqlQuery.toUpperCase();

    // Suggest index-optimized version if WHERE clause exists
    if (upperQuery.includes('WHERE')) {
      const optimizedQuery = sqlQuery.replace(/SELECT \*/g, 'SELECT id, name, email');
      if (optimizedQuery !== sqlQuery) {
        alternatives.push(optimizedQuery + ' -- Optimized: specific columns instead of SELECT *');
      }
    }

    // Suggest LIMIT version if no LIMIT exists
    if (!upperQuery.includes('LIMIT') && upperQuery.includes('SELECT')) {
      alternatives.push(sqlQuery + ' LIMIT 100 -- Added limit for performance');
    }

    // Suggest EXISTS instead of IN for subqueries
    if (upperQuery.includes(' IN (SELECT')) {
      const existsQuery = sqlQuery.replace(/ IN \(SELECT/g, ' EXISTS (SELECT 1 FROM');
      alternatives.push(existsQuery + ' -- Using EXISTS for better performance');
    }

    // Suggest JOIN instead of subquery
    if (upperQuery.includes('SELECT') && upperQuery.includes('(') && upperQuery.includes(')') && !upperQuery.includes('JOIN')) {
      alternatives.push(sqlQuery.replace(/\(SELECT.*?\)/g, 'JOIN (SELECT ...)') + ' -- Consider rewriting as JOIN');
    }

    // Suggest adding indexes hint
    if (upperQuery.includes('WHERE')) {
      const tableName = this.extractTableName(sqlQuery);
      alternatives.push(`-- Consider adding index: CREATE INDEX idx_${tableName}_columns ON ${tableName}(column_name)`);
    }

    // Suggest pagination for large result sets
    if (upperQuery.includes('ORDER BY') && !upperQuery.includes('LIMIT')) {
      alternatives.push(sqlQuery + ' LIMIT 20 OFFSET 0 -- Add pagination for large datasets');
    }

    // Suggest using CTEs for complex queries
    if (upperQuery.includes('SELECT') && upperQuery.includes('(') && upperQuery.includes(')')) {
      alternatives.push(`WITH subquery AS (${sqlQuery.match(/\(SELECT.*?\)/)?.[0] || 'SELECT ...'})\nSELECT * FROM subquery -- Consider using CTE for readability`);
    }

    return alternatives;
  }

  private static generatePlainEnglishExplanation(sqlQuery: string): string {
    const upperQuery = sqlQuery.toUpperCase();
    let explanation = 'This query ';

    // Analyze SELECT clause
    if (upperQuery.includes('SELECT')) {
      if (upperQuery.includes('SELECT *')) {
        explanation += 'retrieves all columns ';
      } else {
        const selectMatch = sqlQuery.match(/SELECT\s+(.*?)\s+FROM/i);
        if (selectMatch) {
          const columns = selectMatch[1].split(',').map(col => col.trim()).join(', ');
          explanation += `retrieves the columns: ${columns} `;
        } else {
          explanation += 'retrieves specific columns ';
        }
      }
    }

    // Analyze FROM clause
    if (upperQuery.includes('FROM')) {
      const tableMatch = sqlQuery.match(/FROM\s+(\w+)/i);
      if (tableMatch) {
        explanation += `from the ${tableMatch[1]} table `;
      }
    }

    // Analyze JOINs
    if (upperQuery.includes('JOIN')) {
      const joinCount = (upperQuery.match(/JOIN/g) || []).length;
      explanation += `by joining ${joinCount + 1} tables `;
    }

    // Analyze WHERE clause
    if (upperQuery.includes('WHERE')) {
      explanation += 'with filtering conditions ';
    }

    // Analyze GROUP BY
    if (upperQuery.includes('GROUP BY')) {
      explanation += 'and groups the data ';
    }

    // Analyze ORDER BY
    if (upperQuery.includes('ORDER BY')) {
      explanation += 'and sorts the results ';
    }

    // Analyze LIMIT
    if (upperQuery.includes('LIMIT')) {
      const limitMatch = sqlQuery.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        explanation += `limiting results to ${limitMatch[1]} rows`;
      }
    } else {
      explanation += 'returning all matching rows';
    }

    // Add performance context
    if (upperQuery.includes('SELECT *')) {
      explanation += '. Note: Using SELECT * may impact performance on large tables.';
    } else if (upperQuery.includes('JOIN') && !upperQuery.includes('WHERE')) {
      explanation += '. Consider adding WHERE clauses to reduce the join result set.';
    } else if (upperQuery.includes('ORDER BY') && !upperQuery.includes('LIMIT')) {
      explanation += '. Adding LIMIT can improve performance for large result sets.';
    } else {
      explanation += '.';
    }

    return explanation;
  }
}

export class AIService {
  private apiKey: string;
  private baseURL: string;
  private model: string;

  constructor(apiKey: string, provider: 'gemini' | 'openai' = 'gemini') {
    // Prefer explicit key; otherwise attempt to rehydrate from localStorage
    let resolvedKey = apiKey;
    if (!resolvedKey && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('apiKey');
        if (stored) resolvedKey = stored;
      } catch (e) {}
    }
    this.apiKey = resolvedKey;
    this.model = provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4';
    this.baseURL = provider === 'gemini' 
      ? `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`
      : 'https://api.openai.com/v1/chat/completions';
  }

  async generateSQLQuery(request: QueryRequest): Promise<QueryResponse> {
    try {
      const prompt = this.buildPrompt(request);
      
      const requestBody = this.model.startsWith('gemini') ? {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000
        }
      } : {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert SQL developer. Generate accurate, optimized SQL queries based on natural language descriptions and database schemas. Always provide explanations and highlight potential issues.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      };

      if (!this.apiKey) {
        throw new Error('Missing API key. Please open Settings and add your API key.');
      }

      const headers = this.model.startsWith('gemini') ? {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.apiKey
      } : {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(this.baseURL, requestBody, { headers });

      return this.parseResponse(response.data);
    } catch (error) {
      const err = error as any;
      // Extract useful error message from Axios/Gemini/OpenAI
      const message = err?.response?.data?.error?.message
        || err?.response?.data?.error
        || err?.response?.data
        || err?.message
        || 'Unknown error';
      console.error('AI Service Error:', message);
      throw new Error(`Failed to generate SQL query: ${message}`);
    }
  }

  private buildPrompt(request: QueryRequest): string {
    const { naturalLanguageQuery, schema, databaseType } = request;
    
    const schemaDescription = schema.tables.map(table => {
      const columns = table.columns.map(col => 
        `${col.name} (${col.type}${col.isPrimaryKey ? ', PRIMARY KEY' : ''}${col.isForeignKey ? ', FOREIGN KEY' : ''})`
      ).join(', ');
      
      return `Table: ${table.name}\nColumns: ${columns}`;
    }).join('\n\n');

    return `You are an expert SQL developer. Generate accurate, optimized SQL queries based on natural language descriptions and database schemas.

Database Type: ${databaseType.toUpperCase()}

Schema:
${schemaDescription}

Natural Language Query: "${naturalLanguageQuery}"

Please generate:
1. An optimized SQL query
2. A clear explanation of what the query does
3. A confidence score (0-100)
4. Any warnings or potential issues
5. Suggestions for improvement if applicable

Format your response as JSON:
{
  "sqlQuery": "SELECT ...",
  "explanation": "This query...",
  "confidence": 95,
  "warnings": ["Warning 1", "Warning 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}`;
  }

  private parseResponse(data: any): QueryResponse {
    try {
      // Handle Gemini API response format
      const content = this.model.startsWith('gemini') 
        ? data.candidates[0].content.parts[0].text
        : data.choices[0].message.content;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          sqlQuery: parsed.sqlQuery || '',
          explanation: parsed.explanation || '',
          confidence: parsed.confidence || 0,
          warnings: parsed.warnings || [],
          suggestions: parsed.suggestions || []
        };
      }
      
      // Fallback parsing if JSON format is not found
      return {
        sqlQuery: this.extractSQLFromText(content),
        explanation: content,
        confidence: 70,
        warnings: [],
        suggestions: []
      };
    } catch (error) {
      throw new Error('Failed to parse AI response');
    }
  }

  private extractSQLFromText(text: string): string {
    const sqlMatch = text.match(/```sql\n([\s\S]*?)\n```/) || 
                     text.match(/SELECT[\s\S]*?;/) ||
                     text.match(/INSERT[\s\S]*?;/) ||
                     text.match(/UPDATE[\s\S]*?;/) ||
                     text.match(/DELETE[\s\S]*?;/);
    
    return sqlMatch ? sqlMatch[0].replace(/```sql\n?|\n?```/g, '').trim() : '';
  }
}
