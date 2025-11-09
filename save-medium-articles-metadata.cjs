#!/usr/bin/env node

/**
 * Save Medium Articles Metadata to MongoDB
 *
 * Saves article metadata for creator monetization series to MongoDB
 * Database: glam-street-chronicles
 * Collection: medium-english-articles
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI not found in environment');
  process.exit(1);
}

const DATABASE_NAME = 'glam-street-chronicles';
const COLLECTION_NAME = 'medium-english-articles';

// Article metadata
const ARTICLES = [
  {
    articleId: 'kofi-setup-guide-2025',
    title: 'The Complete Ko-fi Setup Guide for Content Creators in 2025',
    subtitle: 'How to Start Accepting Support in Under 1 Hour (With 0-5% Fees!)',
    filename: 'kofi-setup-guide-for-content-creators-2025.md',
    filePath: '/home/wakibaka/Documents/github/medium-articles/kofi-setup-guide-for-content-creators-2025.md',
    series: 'creator-monetization-2025',
    seriesPosition: 1,
    tags: [
      'content-creation',
      'monetization',
      'kofi',
      'creator-economy',
      'passive-income',
      'side-hustle',
      'tech-education',
      '2025'
    ],
    category: 'Creator Economy',
    subcategory: 'Monetization',
    difficulty: 'Beginner',
    readingTime: '15 minutes',
    wordCount: 4500,
    format: 'step-by-step-guide',
    targetAudience: [
      'Content creators',
      'Developers',
      'Educators',
      'Writers',
      'Tech professionals'
    ],
    keyTopics: [
      'Ko-fi setup process',
      'Membership tiers strategy',
      'Platform integration',
      'Revenue projections',
      'Fee comparisons'
    ],
    valueProp: 'Complete walkthrough to set up Ko-fi in under 1 hour with lowest fees (0-5%)',
    status: 'ready-to-publish',
    publishedTo: null,
    mediumUrl: null,
    created: new Date('2025-11-09'),
    lastModified: new Date('2025-11-09'),
    generatedBy: 'neko-arc',
    researchHours: 12,
    personalities: {
      neko: 'Setup execution and integration templates',
      mario: 'Workflow optimization',
      glam: 'Creator monetization insights',
      noel: 'Platform comparison analysis',
      hannibal: 'Fee structure dissection',
      tetora: 'Multi-tier strategy'
    }
  },
  {
    articleId: 'platform-diversification-2025',
    title: 'Platform Diversification: The Creator Survival Strategy for 2025',
    subtitle: 'Why Relying on One Platform is Career Suicide (And How to Fix It)',
    filename: 'platform-diversification-strategy-creators-2025.md',
    filePath: '/home/wakibaka/Documents/github/medium-articles/platform-diversification-strategy-creators-2025.md',
    series: 'creator-monetization-2025',
    seriesPosition: 2,
    tags: [
      'platform-diversification',
      'creator-economy',
      'content-strategy',
      'algorithm-proof',
      'creator-business',
      'monetization',
      'multiple-income-streams',
      '2025'
    ],
    category: 'Creator Economy',
    subcategory: 'Strategy',
    difficulty: 'Intermediate',
    readingTime: '12 minutes',
    wordCount: 3800,
    format: 'strategy-framework',
    targetAudience: [
      'Content creators',
      'Platform-dependent creators',
      'Multi-platform strategists',
      'Creator business builders'
    ],
    keyTopics: [
      'Platform dependency risks',
      'Three-layer protection framework',
      'Algorithm change survival',
      'Diversification scorecard',
      '90-day implementation plan'
    ],
    valueProp: 'Protect your creator business from algorithm changes with proven diversification framework',
    caseStudies: [
      'Developer educator: YouTube crash to multi-platform success',
      'Tech writer: Medium dependency to diversified income'
    ],
    status: 'ready-to-publish',
    publishedTo: null,
    mediumUrl: null,
    created: new Date('2025-11-09'),
    lastModified: new Date('2025-11-09'),
    generatedBy: 'noel',
    researchHours: 15,
    personalities: {
      neko: 'Technical platform analysis',
      mario: 'Cross-platform automation',
      glam: 'Platform evolution insights',
      noel: 'Critical analysis of platform risks',
      hannibal: 'Case study dissection',
      tetora: 'Multi-platform identity management'
    }
  },
  {
    articleId: 'complete-monetization-guide-2025',
    title: 'The Complete Content Creator Monetization Guide for 2025',
    subtitle: '14 Platforms Analyzed, 5 Strategies Revealed, 1 Framework to Rule Them All',
    filename: 'content-creator-monetization-complete-guide-2025.md',
    filePath: '/home/wakibaka/Documents/github/medium-articles/content-creator-monetization-complete-guide-2025.md',
    series: 'creator-monetization-2025',
    seriesPosition: 3,
    tags: [
      'creator-economy',
      'monetization',
      'content-creation',
      'platform-comparison',
      'passive-income',
      'side-hustle',
      'kofi',
      'substack',
      'patreon',
      '2025-guide'
    ],
    category: 'Creator Economy',
    subcategory: 'Comprehensive Guide',
    difficulty: 'Beginner to Intermediate',
    readingTime: '18 minutes',
    wordCount: 5200,
    format: 'comprehensive-analysis',
    targetAudience: [
      'Beginning content creators',
      'Creators seeking to diversify income',
      'Platform researchers',
      'Creator business strategists'
    ],
    keyTopics: [
      '14 platform detailed analysis',
      'Fee comparison tables',
      '5 critical monetization strategies',
      'Platform rejection reasons',
      'Complete implementation roadmap'
    ],
    platformsAnalyzed: [
      'Ko-fi',
      'Buy Me a Coffee',
      'Patreon',
      'Substack',
      'Gumroad',
      'Kajabi',
      'LinkedIn',
      'Dev.to',
      'TikTok',
      'Instagram Reels',
      'Discord',
      'Uscreen',
      'Mighty Networks',
      'Newsbreak'
    ],
    platformsRecommended: [
      'Ko-fi (best fees)',
      'Substack (email ownership)',
      'LinkedIn (B2B)',
      'Dev.to (developers)',
      'Discord (community)'
    ],
    platformsRejected: [
      'Kajabi (too expensive)',
      'Uscreen (YouTube is free)',
      'Mighty Networks (Discord is free)',
      'Newsbreak (wrong audience)'
    ],
    strategies: [
      'Platform Diversification',
      'Direct Audience Ownership',
      'Collaborative Marketing',
      'Long-Form + Entertainment Balance',
      'Spanish Tech Education Niche'
    ],
    valueProp: 'Complete monetization landscape analysis with actionable implementation roadmap',
    status: 'ready-to-publish',
    publishedTo: null,
    mediumUrl: null,
    created: new Date('2025-11-09'),
    lastModified: new Date('2025-11-09'),
    generatedBy: 'hannibal',
    researchHours: 40,
    personalities: {
      neko: 'Technical platform capabilities',
      mario: 'Automation and integration',
      glam: 'Spanish market opportunities',
      noel: 'Platform weaknesses and risks',
      hannibal: 'Comprehensive analysis and dissection',
      tetora: 'Multi-strategy integration'
    }
  }
];

// Series metadata
const SERIES_METADATA = {
  seriesId: 'creator-monetization-2025',
  seriesName: 'Creator Monetization Series 2025',
  description: 'Comprehensive guide to content creator monetization strategies and platforms in 2025',
  totalArticles: 3,
  totalWordCount: 13500,
  totalResearchHours: 67,
  platformsAnalyzed: 14,
  strategiesRevealed: 5,
  created: new Date('2025-11-09'),
  status: 'complete',
  repository: '/home/wakibaka/Documents/github/medium-articles/',
  githubUrl: 'https://github.com/JavierCollipal/medium-articles',
  relatedDatabases: ['dina-agent-diffusion'],
  relatedCollections: ['diffusion-platforms', 'diffusion-strategies'],
  targetAudience: 'Content creators, developers, educators, tech professionals',
  language: 'English',
  bilingualInsights: true
};

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('🐾✨ Connected to MongoDB Atlas, nyaa~!\n');

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Clear existing series data
    await collection.deleteMany({ series: 'creator-monetization-2025' });
    console.log('🧹 Cleared existing series data, desu~!\n');

    // Insert articles
    const result = await collection.insertMany(ARTICLES);
    console.log(`✅ Saved ${result.insertedCount} articles to database!\n`);

    // Save series metadata
    const seriesCollection = db.collection('medium-article-series');
    await seriesCollection.deleteOne({ seriesId: 'creator-monetization-2025' });
    await seriesCollection.insertOne(SERIES_METADATA);
    console.log('✅ Saved series metadata!\n');

    // Create indexes
    await collection.createIndex({ series: 1, seriesPosition: 1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ tags: 1 });
    await collection.createIndex({ created: -1 });
    console.log('📊 Created indexes!\n');

    // Summary
    console.log('🎯 Medium Articles Metadata Summary:');
    console.log('='.repeat(50));
    console.log(`Database: ${DATABASE_NAME}`);
    console.log(`Collection: ${COLLECTION_NAME}`);
    console.log(`\n📝 Articles Saved:`);

    for (const article of ARTICLES) {
      console.log(`\n   ${article.seriesPosition}. ${article.title}`);
      console.log(`      Reading Time: ${article.readingTime}`);
      console.log(`      Word Count: ${article.wordCount}`);
      console.log(`      Difficulty: ${article.difficulty}`);
      console.log(`      Research Hours: ${article.researchHours}`);
      console.log(`      File: ${article.filename}`);
    }

    console.log(`\n📊 Series Statistics:`);
    console.log(`   Total Articles: ${SERIES_METADATA.totalArticles}`);
    console.log(`   Total Words: ${SERIES_METADATA.totalWordCount.toLocaleString()}`);
    console.log(`   Total Research: ${SERIES_METADATA.totalResearchHours}+ hours`);
    console.log(`   Platforms Analyzed: ${SERIES_METADATA.platformsAnalyzed}`);
    console.log(`   Strategies Revealed: ${SERIES_METADATA.strategiesRevealed}`);

    console.log(`\n🔗 Repository:`);
    console.log(`   Local: ${SERIES_METADATA.repository}`);
    console.log(`   GitHub: ${SERIES_METADATA.githubUrl}`);

    console.log('\n💾 MongoDB Queries:');
    console.log('\n   // Get all articles in series (ordered)');
    console.log('   db.getCollection("medium-english-articles").find({');
    console.log('     series: "creator-monetization-2025"');
    console.log('   }).sort({ seriesPosition: 1 })');

    console.log('\n   // Get series metadata');
    console.log('   db.getCollection("medium-article-series").findOne({');
    console.log('     seriesId: "creator-monetization-2025"');
    console.log('   })');

    console.log('\n✨ All metadata saved successfully, desu~!');
    console.log('🎸 ¡Glam dice: Listo pa\' publicar en Medium, weon!');

  } catch (error) {
    console.error('❌ Error saving metadata:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
