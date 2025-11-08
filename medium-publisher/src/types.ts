/**
 * Neko-Arc Medium Publisher - Type Definitions
 *
 * TypeScript interfaces and types for Medium publishing
 */

import { PostLicense } from 'medium-sdk-ts';

export type PublishStatus = 'public' | 'draft' | 'unlisted';
export type ContentFormat = 'markdown' | 'html';
export type License = PostLicense;

/**
 * Article to be published to Medium
 */
export interface Article {
  title: string;
  content: string;
  tags?: string[];
  canonicalUrl?: string;
  publishStatus?: PublishStatus;
  contentFormat?: ContentFormat;
  license?: License;
}

/**
 * Result from Medium API after publishing
 */
export interface PublishResult {
  id: string;
  title: string;
  authorId: string;
  url: string;
  canonicalUrl?: string;
  publishStatus: PublishStatus;
  publishedAt?: number;
  license: License;
  licenseUrl: string;
  tags: string[];
}

/**
 * Medium user information
 */
export interface MediumUser {
  id: string;
  username: string;
  name: string;
  url: string;
  imageUrl: string;
}

/**
 * MongoDB publication record
 */
export interface PublicationRecord {
  mediumPostId: string;
  title: string;
  url: string;
  publishStatus: PublishStatus;
  tags: string[];
  publishedAt: Date;
  generatedBy: string;
  source: 'manual' | 'ai-agent' | 'automated';
  contentFormat: ContentFormat;
  metadata?: {
    canonicalUrl?: string;
    license?: License;
  };
  createdAt: Date;
}

/**
 * Configuration for Medium Publisher
 */
export interface MediumPublisherConfig {
  accessToken: string;
  mongoUri?: string;
  mongoDatabase?: string;
  mongoCollection?: string;
  enableMongoLogging?: boolean;
}
