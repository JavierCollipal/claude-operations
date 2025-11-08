/**
 * Neko-Arc Medium Publisher - MongoDB Logger
 *
 * Handles MongoDB connection and logging of published articles
 */

import { MongoClient, Db, Collection } from 'mongodb';
import type { PublicationRecord, PublishResult, Article } from './types';

export class MongoLogger {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private collection: Collection<PublicationRecord> | null = null;
  private connected: boolean = false;

  constructor(
    private mongoUri: string,
    private database: string = 'neko-defense-system',
    private collectionName: string = 'medium-publications'
  ) {}

  /**
   * Connect to MongoDB Atlas
   */
  async connect(): Promise<void> {
    if (this.connected) {
      return;
    }

    try {
      this.client = new MongoClient(this.mongoUri);
      await this.client.connect();
      this.db = this.client.db(this.database);
      this.collection = this.db.collection<PublicationRecord>(this.collectionName);
      this.connected = true;
      console.log(`✅ Connected to MongoDB: ${this.database}.${this.collectionName}`);
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * Log publication to MongoDB
   */
  async logPublication(
    article: Article,
    result: PublishResult,
    source: 'manual' | 'ai-agent' | 'automated' = 'manual',
    generatedBy: string = 'neko-arc'
  ): Promise<void> {
    if (!this.connected || !this.collection) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }

    const record: PublicationRecord = {
      mediumPostId: result.id,
      title: result.title,
      url: result.url,
      publishStatus: result.publishStatus,
      tags: result.tags,
      publishedAt: result.publishedAt ? new Date(result.publishedAt) : new Date(),
      generatedBy,
      source,
      contentFormat: article.contentFormat || 'markdown',
      metadata: {
        canonicalUrl: result.canonicalUrl,
        license: result.license,
      },
      createdAt: new Date(),
    };

    try {
      await this.collection.insertOne(record);
      console.log(`✅ Publication logged to MongoDB: ${result.id}`);
    } catch (error) {
      console.error('❌ MongoDB logging error:', error);
      throw error;
    }
  }

  /**
   * Get all publications
   */
  async getAllPublications(): Promise<PublicationRecord[]> {
    if (!this.connected || !this.collection) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }

    return await this.collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
  }

  /**
   * Get publications by status
   */
  async getPublicationsByStatus(status: 'public' | 'draft' | 'unlisted'): Promise<PublicationRecord[]> {
    if (!this.connected || !this.collection) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }

    return await this.collection
      .find({ publishStatus: status })
      .sort({ createdAt: -1 })
      .toArray();
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.connected = false;
      console.log('✅ Disconnected from MongoDB');
    }
  }
}
