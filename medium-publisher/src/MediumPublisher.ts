/**
 * Neko-Arc Medium Publisher - Main Publisher Class
 *
 * Handles Medium API integration and article publishing
 */

import { MediumClient, PostContentFormat, PostPublishStatus } from 'medium-sdk-ts';
import type { Article, PublishResult, MediumUser, MediumPublisherConfig } from './types';
import { MongoLogger } from './MongoLogger';

export class MediumPublisher {
  private client: MediumClient;
  private mongoLogger: MongoLogger | null = null;
  private enableMongoLogging: boolean;
  private cachedUser: MediumUser | null = null;

  constructor(config: MediumPublisherConfig) {
    this.client = new MediumClient(config.accessToken);
    this.enableMongoLogging = config.enableMongoLogging ?? false;

    if (this.enableMongoLogging && config.mongoUri) {
      this.mongoLogger = new MongoLogger(
        config.mongoUri,
        config.mongoDatabase || 'neko-defense-system',
        config.mongoCollection || 'medium-publications'
      );
    }
  }

  /**
   * Initialize the publisher (connect to MongoDB if enabled)
   */
  async initialize(): Promise<void> {
    if (this.enableMongoLogging && this.mongoLogger) {
      await this.mongoLogger.connect();
    }
  }

  /**
   * Get authenticated Medium user information
   */
  async getUser(): Promise<MediumUser> {
    if (this.cachedUser) {
      return this.cachedUser;
    }

    try {
      const user = await this.client.getUser();
      this.cachedUser = user as MediumUser;
      return this.cachedUser;
    } catch (error) {
      console.error('❌ Failed to get Medium user:', error);
      throw new Error('Failed to authenticate with Medium API. Check your access token.');
    }
  }

  /**
   * Publish article to Medium
   */
  async publish(
    article: Article,
    source: 'manual' | 'ai-agent' | 'automated' = 'manual',
    generatedBy: string = 'neko-arc'
  ): Promise<PublishResult> {
    try {
      // Get user ID if not cached
      const user = await this.getUser();

      // Map content format
      const contentFormat = article.contentFormat === 'html'
        ? PostContentFormat.HTML
        : PostContentFormat.MARKDOWN;

      // Map publish status
      let publishStatus: PostPublishStatus;
      switch (article.publishStatus) {
        case 'public':
          publishStatus = PostPublishStatus.PUBLIC;
          break;
        case 'unlisted':
          publishStatus = PostPublishStatus.UNLISTED;
          break;
        case 'draft':
        default:
          publishStatus = PostPublishStatus.DRAFT;
      }

      // Create post
      console.log(`📝 Publishing "${article.title}" to Medium...`);
      const result = await this.client.createPost({
        userId: user.id,
        title: article.title,
        content: article.content,
        contentFormat,
        publishStatus,
        tags: article.tags,
        canonicalUrl: article.canonicalUrl,
        license: article.license,
      });

      console.log(`✅ Published successfully: ${result.url}`);
      console.log(`   Status: ${result.publishStatus}`);
      console.log(`   Tags: ${result.tags.join(', ')}`);

      // Log to MongoDB if enabled
      if (this.enableMongoLogging && this.mongoLogger) {
        await this.mongoLogger.logPublication(
          article,
          result as PublishResult,
          source,
          generatedBy
        );
      }

      return result as PublishResult;
    } catch (error) {
      console.error('❌ Failed to publish article:', error);
      throw error;
    }
  }

  /**
   * Get all publications from MongoDB
   */
  async getPublications() {
    if (!this.mongoLogger) {
      throw new Error('MongoDB logging is not enabled');
    }
    return await this.mongoLogger.getAllPublications();
  }

  /**
   * Get publications by status from MongoDB
   */
  async getPublicationsByStatus(status: 'public' | 'draft' | 'unlisted') {
    if (!this.mongoLogger) {
      throw new Error('MongoDB logging is not enabled');
    }
    return await this.mongoLogger.getPublicationsByStatus(status);
  }

  /**
   * Cleanup and disconnect
   */
  async cleanup(): Promise<void> {
    if (this.mongoLogger) {
      await this.mongoLogger.disconnect();
    }
  }
}
