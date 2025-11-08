/**
 * Spanish Educational Content Generator - MongoDB Logger
 *
 * @author Glam Americano & Neko-Arc System
 */

import { MongoClient, Db, Collection } from 'mongodb';
import type { ContentRecord, PostSeries } from './types';

export class MongoLogger {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private collection: Collection<ContentRecord> | null = null;
  private connected: boolean = false;

  constructor(
    private mongoUri: string,
    private database: string = 'neko-defense-system',
    private collectionName: string = 'spanish-educational-content'
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
      this.collection = this.db.collection<ContentRecord>(this.collectionName);
      this.connected = true;
      console.log(`✅ Connected to MongoDB: ${this.database}.${this.collectionName}`);
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * Log generated content to MongoDB
   */
  async logContent(
    series: PostSeries,
    outputPath: string,
    generatedBy: string = 'glam-americano'
  ): Promise<void> {
    if (!this.connected || !this.collection) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }

    const record: ContentRecord = {
      recordId: `${series.seriesId}-${Date.now()}`,
      seriesId: series.seriesId,
      title: series.title,
      topic: series.title,
      language: series.language,
      complexity: series.complexity,
      numPosts: series.posts.length,
      generatedBy,
      outputPath,
      createdAt: new Date(),
    };

    try {
      await this.collection.insertOne(record);
      console.log(`✅ Content logged to MongoDB: ${record.recordId}`);
    } catch (error) {
      console.error('❌ MongoDB logging error:', error);
      throw error;
    }
  }

  /**
   * Get all content records
   */
  async getAllRecords(): Promise<ContentRecord[]> {
    if (!this.connected || !this.collection) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }

    return await this.collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
  }

  /**
   * Get records by language
   */
  async getRecordsByLanguage(language: string): Promise<ContentRecord[]> {
    if (!this.connected || !this.collection) {
      throw new Error('MongoDB not connected. Call connect() first.');
    }

    return await this.collection
      .find({ language })
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
