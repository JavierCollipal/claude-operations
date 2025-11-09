/**
 * Idea Tracker & Gap Analyzer
 *
 * Analyzes existing Medium posts to identify covered topics
 * and suggests new content ideas based on CLAUDE.md features
 * that haven't been explained yet.
 *
 * @author Glam Americano
 */

import { MongoClient } from 'mongodb';

export interface CoveredTopic {
  keyword: string;
  category: string;
  seriesId: string;
  postNumber: number;
  occurrences: number;
  context: string[];
}

export interface ContentGap {
  topic: string;
  category: string;
  claudeRule?: number;
  priority: 'high' | 'medium' | 'low';
  suggestedTitle: string;
  suggestedOutline: string[];
  relatedTopics: string[];
}

export interface ContentIdea {
  ideaId: string;
  title: string;
  description: string;
  category: string;
  topics: string[];
  targetAudience: string;
  complexity: 'simple' | 'intermediate' | 'advanced';
  estimatedPosts: number;
  status: 'idea' | 'in-progress' | 'completed';
  relatedRules: number[];
  gaps: string[];
  createdAt: Date;
  completedAt?: Date;
}

export class IdeaTracker {
  private mongoUri: string;
  private dbName = 'glam-street-chronicles';
  private postsCollection = 'medium-spanish-posts';
  private ideasCollection = 'content-ideas';

  constructor(mongoUri: string) {
    this.mongoUri = mongoUri;
  }

  /**
   * Analyze existing posts to extract covered topics
   */
  async analyzeCoveredTopics(): Promise<CoveredTopic[]> {
    const client = new MongoClient(this.mongoUri);

    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.postsCollection);

      // Get all series
      const allSeries = await collection.find({}).toArray();

      const coveredTopics: Map<string, CoveredTopic> = new Map();

      // Keywords to track (CLAUDE.md concepts)
      const keywords = [
        // Core concepts
        'reglas inmutables', 'rule 0', 'personalidades', 'mongodb', 'typescript',
        'puppeteer', 'automation', 'git', 'github', 'mcp',

        // Specific features
        'neko-arc', 'mario', 'noel', 'glam', 'hannibal', 'tetora',
        'threat hunting', 'honeypot', 'security audit', 'video creation',

        // Technical
        'ascii diagrams', 'mermaid', 'prompt engineering', 'sprint methodology',
        'feature branch', 'rag system', 'chilean law',

        // Advanced
        'android emulator', 'white hat', 'network security', 'cypress',
        'jest', 'testing', 'validation', 'microservices'
      ];

      for (const series of allSeries) {
        const posts = series.posts || [];

        for (const post of posts) {
          const content = (post.content || '').toLowerCase();

          for (const keyword of keywords) {
            const regex = new RegExp(keyword.toLowerCase(), 'gi');
            const matches = content.match(regex);

            if (matches) {
              const key = keyword.toLowerCase();

              if (!coveredTopics.has(key)) {
                coveredTopics.set(key, {
                  keyword: keyword,
                  category: this.categorizeKeyword(keyword),
                  seriesId: series.seriesId,
                  postNumber: post.postNumber,
                  occurrences: matches.length,
                  context: []
                });
              } else {
                const existing = coveredTopics.get(key)!;
                existing.occurrences += matches.length;
              }
            }
          }
        }
      }

      return Array.from(coveredTopics.values());

    } finally {
      await client.close();
    }
  }

  /**
   * Identify gaps - topics from CLAUDE.md not yet covered
   */
  async identifyContentGaps(): Promise<ContentGap[]> {
    const coveredTopics = await this.analyzeCoveredTopics();
    const coveredKeywords = new Set(coveredTopics.map(t => t.keyword.toLowerCase()));

    // All CLAUDE.md topics/rules that could be explained
    const allTopics = [
      // Rules
      { topic: 'GitHub Repository Location', rule: 1, category: 'Ubicación', priority: 'high' },
      { topic: 'Threat Actor Exposure', rule: 2, category: 'Seguridad', priority: 'high' },
      { topic: 'Video Tools & /makevideo', rule: 3, category: 'Multimedia', priority: 'medium' },
      { topic: 'MongoDB Atlas Integration', rule: 4, category: 'Bases de Datos', priority: 'high' },
      { topic: 'Microservices Architecture', rule: 5, category: 'Arquitectura', priority: 'medium' },
      { topic: 'SPLIT Security', rule: 6, category: 'Seguridad', priority: 'high' },
      { topic: 'Cypress Cloud Testing', rule: 7, category: 'Testing', priority: 'medium' },
      { topic: 'Development Standards', rule: 8, category: 'Desarrollo', priority: 'medium' },
      { topic: 'Credential Security (.env)', rule: 11, category: 'Seguridad', priority: 'high' },
      { topic: 'GitHub Privacy', rule: 12, category: 'Seguridad', priority: 'high' },
      { topic: 'JavaScript Validation', rule: 13, category: 'Desarrollo', priority: 'low' },
      { topic: 'MCP MongoDB', rule: 14, category: 'MCP', priority: 'high' },
      { topic: 'Auto-Documentation', rule: 15, category: 'Automatización', priority: 'medium' },
      { topic: 'TypeScript Default', rule: 16, category: 'Desarrollo', priority: 'medium' },
      { topic: 'Chilean Law RAG System', rule: 32, category: 'RAG', priority: 'high' },
      { topic: 'RAG Testing Protocol', rule: 33, category: 'Testing', priority: 'medium' },
      { topic: 'Network Security Audit', rule: 36, category: 'Seguridad', priority: 'high' },
      { topic: 'Android Emulator Research', rule: 37, category: 'Seguridad', priority: 'medium' },
      { topic: 'Sprint Methodology', rule: 38, category: 'Desarrollo', priority: 'high' },
      { topic: 'MCP Repository Privacy', rule: 40, category: 'MCP', priority: 'medium' },
      { topic: 'Feature Branch Workflow', rule: 41, category: 'Git', priority: 'high' },
      { topic: 'Spanish Content Output', rule: 43, category: 'Contenido', priority: 'low' },
      { topic: 'Video Frame Format Standards', rule: 44, category: 'Multimedia', priority: 'medium' },
      { topic: 'ASCII/Unicode Diagrams', rule: 45, category: 'Contenido', priority: 'low' },

      // Personalities (detailed)
      { topic: 'Mario Gallo Bestino - Puppeteer Expert', category: 'Personalidades', priority: 'high' },
      { topic: 'Noel - Debugging Master', category: 'Personalidades', priority: 'high' },
      { topic: 'Dr. Hannibal Lecter - Forensic Analysis', category: 'Personalidades', priority: 'high' },
      { topic: 'Tetora - MPD & Task Fragmentation', category: 'Personalidades', priority: 'medium' },

      // Advanced Features
      { topic: 'Honeypot System', category: 'Seguridad', priority: 'high' },
      { topic: 'Threat Intelligence Context Loader', category: 'Seguridad', priority: 'high' },
      { topic: 'Case Patterns Database', category: 'Bases de Datos', priority: 'medium' },
      { topic: 'MCP Servers Creation', category: 'MCP', priority: 'high' },
      { topic: 'Neko-Arc TV System', category: 'Multimedia', priority: 'medium' },
      { topic: 'Geographic Threat Maps', category: 'Visualización', priority: 'medium' },
      { topic: 'DINA Database System', category: 'Bases de Datos', priority: 'medium' },
      { topic: 'Video Frame Generation with Python', category: 'Multimedia', priority: 'medium' },
    ];

    const gaps: ContentGap[] = [];

    for (const topic of allTopics) {
      const topicKey = topic.topic.toLowerCase();
      const isCovered = Array.from(coveredKeywords).some(keyword =>
        topicKey.includes(keyword) || keyword.includes(topicKey.split(' ')[0])
      );

      if (!isCovered) {
        gaps.push({
          topic: topic.topic,
          category: topic.category,
          claudeRule: 'rule' in topic ? topic.rule : undefined,
          priority: topic.priority as 'high' | 'medium' | 'low',
          suggestedTitle: this.generateTitle(topic.topic),
          suggestedOutline: this.generateOutline(topic.topic, topic.category),
          relatedTopics: this.findRelatedTopics(topic.topic, allTopics.map(t => t.topic))
        });
      }
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    gaps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return gaps;
  }

  /**
   * Save a new content idea
   */
  async saveContentIdea(idea: Omit<ContentIdea, 'ideaId' | 'createdAt'>): Promise<string> {
    const client = new MongoClient(this.mongoUri);

    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.ideasCollection);

      const ideaId = `idea-${Date.now()}`;
      const fullIdea: ContentIdea = {
        ...idea,
        ideaId,
        createdAt: new Date()
      };

      await collection.insertOne(fullIdea);
      return ideaId;

    } finally {
      await client.close();
    }
  }

  /**
   * Check if an idea already exists
   */
  async ideaExists(topics: string[]): Promise<boolean> {
    const client = new MongoClient(this.mongoUri);

    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.ideasCollection);

      // Check if any idea has similar topics
      const existing = await collection.findOne({
        topics: { $in: topics }
      });

      return existing !== null;

    } finally {
      await client.close();
    }
  }

  /**
   * Get all content ideas
   */
  async getAllIdeas(): Promise<ContentIdea[]> {
    const client = new MongoClient(this.mongoUri);

    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.ideasCollection);

      const results = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return results as unknown as ContentIdea[];

    } finally {
      await client.close();
    }
  }

  /**
   * Generate a series idea from a gap
   */
  async generateSeriesFromGap(gap: ContentGap): Promise<ContentIdea> {
    const topics = [gap.topic, ...gap.relatedTopics];
    const exists = await this.ideaExists(topics);

    if (exists) {
      throw new Error(`Idea already exists for topics: ${topics.join(', ')}`);
    }

    return {
      ideaId: '', // Will be set when saved
      title: gap.suggestedTitle,
      description: `Serie educativa sobre ${gap.topic} del sistema Neko-Arc`,
      category: gap.category,
      topics: topics,
      targetAudience: 'Comunidad hispanohablante interesada en IA y automatización',
      complexity: gap.priority === 'high' ? 'intermediate' : 'simple',
      estimatedPosts: gap.suggestedOutline.length,
      status: 'idea',
      relatedRules: gap.claudeRule ? [gap.claudeRule] : [],
      gaps: [gap.topic],
      createdAt: new Date()
    };
  }

  // Helper methods
  private categorizeKeyword(keyword: string): string {
    if (keyword.includes('regla') || keyword.includes('rule')) return 'Reglas';
    if (keyword.includes('neko') || keyword.includes('mario') || keyword.includes('noel')) return 'Personalidades';
    if (keyword.includes('security') || keyword.includes('seguridad')) return 'Seguridad';
    if (keyword.includes('test') || keyword.includes('cypress')) return 'Testing';
    if (keyword.includes('video') || keyword.includes('frame')) return 'Multimedia';
    if (keyword.includes('mongo') || keyword.includes('database')) return 'Bases de Datos';
    if (keyword.includes('git') || keyword.includes('github')) return 'Git';
    return 'General';
  }

  private generateTitle(topic: string): string {
    return `🎸 ${topic}: Explicación Detallada del Sistema Neko-Arc`;
  }

  private generateOutline(topic: string, category: string): string[] {
    return [
      `¿Qué es ${topic}?`,
      `¿Por qué es importante en Neko-Arc?`,
      `Implementación técnica`,
      `Casos de uso prácticos`,
      `Mejores prácticas`
    ];
  }

  private findRelatedTopics(topic: string, allTopics: string[]): string[] {
    const related: string[] = [];
    const topicWords = topic.toLowerCase().split(' ');

    for (const other of allTopics) {
      if (other === topic) continue;

      const otherWords = other.toLowerCase().split(' ');
      const commonWords = topicWords.filter(word => otherWords.includes(word));

      if (commonWords.length > 0) {
        related.push(other);
      }
    }

    return related.slice(0, 3); // Max 3 related
  }
}
