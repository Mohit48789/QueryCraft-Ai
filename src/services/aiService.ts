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
    // Simulate query analysis - in real app, this would connect to actual database
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

    // Check for common performance issues
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

    // Generate execution plan
    const executionPlan = this.generateExecutionPlan(sqlQuery);
    
    // Generate alternative queries
    const alternatives = this.generateAlternativeQueries(sqlQuery);
    
    // Generate plain English explanation
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
    // Simulate execution plan generation
    const upperQuery = sqlQuery.toUpperCase();
    const plan: ExecutionPlanNode[] = [];

    // Base scan operation
    const scanNode: ExecutionPlanNode = {
      id: '1',
      operation: 'Seq Scan',
      table: this.extractTableName(sqlQuery),
      cost: 100.0,
      rows: 1000,
      children: [],
      details: 'Sequential scan on table'
    };

    if (upperQuery.includes('SELECT')) {
      plan.push(scanNode);
    }

    if (upperQuery.includes('JOIN')) {
      const joinNode: ExecutionPlanNode = {
        id: '2',
        operation: 'Hash Join',
        cost: 250.0,
        rows: 500,
        children: [scanNode], // Only reference scanNode, not the entire plan
        details: 'Hash join between tables'
      };
      plan.push(joinNode);
    }

    if (upperQuery.includes('ORDER BY')) {
      const sortNode: ExecutionPlanNode = {
        id: '3',
        operation: 'Sort',
        cost: 150.0,
        rows: 500,
        children: [], // No children to avoid recursion
        details: 'Sort operation for ORDER BY clause'
      };
      plan.push(sortNode);
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

    // Suggest index-optimized version
    if (upperQuery.includes('WHERE')) {
      alternatives.push(sqlQuery.replace(/SELECT \*/g, 'SELECT id, name') + ' -- Optimized: specific columns');
    }

    // Suggest LIMIT version
    if (!upperQuery.includes('LIMIT')) {
      alternatives.push(sqlQuery + ' LIMIT 100 -- Added limit for performance');
    }

    // Suggest EXISTS instead of IN for subqueries
    if (upperQuery.includes(' IN (SELECT')) {
      alternatives.push(sqlQuery.replace(/ IN \(SELECT/g, ' EXISTS (SELECT 1 FROM') + ' -- Using EXISTS for better performance');
    }

    return alternatives;
  }

  private static generatePlainEnglishExplanation(sqlQuery: string): string {
    const upperQuery = sqlQuery.toUpperCase();
    let explanation = 'This query ';

    if (upperQuery.includes('SELECT')) {
      if (upperQuery.includes('SELECT *')) {
        explanation += 'retrieves all columns ';
      } else {
        explanation += 'retrieves specific columns ';
      }
    }

    if (upperQuery.includes('FROM')) {
      const tableMatch = sqlQuery.match(/FROM\s+(\w+)/i);
      if (tableMatch) {
        explanation += `from the ${tableMatch[1]} table `;
      }
    }

    if (upperQuery.includes('WHERE')) {
      explanation += 'with filtering conditions ';
    }

    if (upperQuery.includes('JOIN')) {
      explanation += 'by joining multiple tables ';
    }

    if (upperQuery.includes('ORDER BY')) {
      explanation += 'and sorts the results ';
    }

    if (upperQuery.includes('GROUP BY')) {
      explanation += 'and groups the data ';
    }

    if (upperQuery.includes('LIMIT')) {
      const limitMatch = sqlQuery.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        explanation += `limiting results to ${limitMatch[1]} rows`;
      }
    } else {
      explanation += 'returning all matching rows';
    }

    return explanation + '.';
  }
}

export class AIService {
  private apiKey: string;
  private baseURL: string;
  private model: string;

  constructor(apiKey: string, provider: 'gemini' | 'openai' = 'gemini') {
    this.apiKey = apiKey;
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
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate SQL query. Please check your API key and try again.');
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
