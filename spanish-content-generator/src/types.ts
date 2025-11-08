/**
 * Spanish Educational Content Generator - Type Definitions
 *
 * @author Glam Americano & Neko-Arc System
 */

export type DiagramType = 'architecture' | 'workflow' | 'sequence' | 'mindmap' | 'flowchart';
export type ContentComplexity = 'simple' | 'intermediate' | 'advanced';
export type ContentFormat = 'markdown' | 'html';

/**
 * Post in a series
 */
export interface Post {
  number: number;
  title: string;
  content: string;
  diagrams?: Diagram[];
  keywords: string[];
  estimatedReadTime: number; // minutes
}

/**
 * Diagram definition
 */
export interface Diagram {
  type: DiagramType;
  title: string;
  mermaidCode: string;
  description: string;
}

/**
 * Post series
 */
export interface PostSeries {
  seriesId: string;
  title: string;
  description: string;
  targetAudience: string;
  complexity: ContentComplexity;
  posts: Post[];
  createdAt: Date;
  language: string;
}

/**
 * Content generation request
 */
export interface ContentRequest {
  topic: string;
  complexity: ContentComplexity;
  numPosts: number;
  includeDiagrams: boolean;
  language: string;
  targetAudience?: string;
}

/**
 * MongoDB record for generated content
 */
export interface ContentRecord {
  recordId: string;
  seriesId: string;
  title: string;
  topic: string;
  language: string;
  complexity: ContentComplexity;
  numPosts: number;
  generatedBy: string;
  outputPath: string;
  createdAt: Date;
}

/**
 * Configuration
 */
export interface SpanishContentGeneratorConfig {
  mongoUri?: string;
  mongoDatabase?: string;
  mongoCollection?: string;
  enableMongoLogging?: boolean;
  outputDir?: string;
  defaultLanguage?: string;
  defaultComplexity?: ContentComplexity;
}

/**
 * Content statistics
 */
export interface ContentStatistics {
  seriesId: string;
  title: string;
  totalPosts: number;
  totalWords: number;
  totalDiagrams: number;
  totalReadTime: string;
  language: string;
  complexity: ContentComplexity;
  createdAt: Date;
}
