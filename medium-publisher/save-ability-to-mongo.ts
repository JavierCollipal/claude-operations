/**
 * Save Medium Publisher Ability to MongoDB
 * Database: neko-abilities
 * Collection: abilities
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const ability = {
  abilityId: 'medium-publisher-v1',
  name: 'Medium Publisher',
  version: '1.0.0',
  description: 'AI-powered Medium publishing ability with MongoDB logging and TypeScript support',
  category: 'content-publishing',
  personalities: ['neko-arc', 'mario', 'noel', 'glam', 'hannibal', 'tetora'],
  features: [
    'TypeScript Native - Full type safety',
    'Medium API Integration via medium-sdk-ts',
    'MongoDB Atlas logging',
    'CLI interface for easy publishing',
    'Support for Markdown and HTML',
    'Multiple publish statuses (draft, public, unlisted)',
    'Tags, canonical URLs, and license support',
    'AI agent integration ready',
  ],
  technologies: {
    language: 'TypeScript',
    runtime: 'Node.js',
    sdk: 'medium-sdk-ts@0.2.0',
    database: 'MongoDB Atlas',
    buildTool: 'tsc',
  },
  installation: {
    location: '/home/wakibaka/Documents/github/claude-operations/medium-publisher/',
    commands: [
      'cd /home/wakibaka/Documents/github/claude-operations/medium-publisher',
      'npm install',
      'npm run build',
      'cp .env.example .env',
      '# Edit .env with your credentials',
    ],
  },
  credentials: {
    mediumToken: {
      description: 'Medium Integration Token',
      getFrom: 'https://medium.com/me/settings/security',
      envVar: 'MEDIUM_ACCESS_TOKEN',
    },
    mongodbUri: {
      description: 'MongoDB Atlas Connection String',
      getFrom: 'https://cloud.mongodb.com/',
      envVar: 'MONGODB_URI',
      optional: true,
    },
  },
  usage: {
    cli: {
      test: 'npm run publish-article test',
      publish: 'npm run publish-article publish --file ./article.md --title "Title" --status draft --tags "AI,Tech"',
      list: 'npm run publish-article list',
    },
    programmatic: {
      example: `
import { MediumPublisher } from 'neko-medium-publisher';

const publisher = new MediumPublisher({
  accessToken: process.env.MEDIUM_ACCESS_TOKEN!,
  enableMongoLogging: true,
});

await publisher.initialize();
const result = await publisher.publish({
  title: 'My Article',
  content: '# Hello World',
  tags: ['AI', 'Technology'],
  publishStatus: 'draft',
}, 'ai-agent', 'hannibal');

await publisher.cleanup();
      `,
    },
  },
  mongodbSchema: {
    database: 'neko-defense-system',
    collection: 'medium-publications',
    fields: {
      mediumPostId: 'string - Medium post ID',
      title: 'string - Article title',
      url: 'string - Medium URL',
      publishStatus: 'string - public, draft, or unlisted',
      tags: 'array - Article tags',
      publishedAt: 'Date - Publication timestamp',
      generatedBy: 'string - Personality that created it',
      source: 'string - manual, ai-agent, or automated',
      contentFormat: 'string - markdown or html',
      metadata: 'object - Additional metadata',
      createdAt: 'Date - Record creation timestamp',
    },
  },
  integration: {
    withAgents: true,
    withNekoDashboard: false,
    withPuppeteer: false,
    withMCP: false,
  },
  files: {
    'package.json': 'Project dependencies and scripts',
    'tsconfig.json': 'TypeScript configuration',
    '.env.example': 'Environment variable template with links',
    'src/types.ts': 'TypeScript type definitions',
    'src/MediumPublisher.ts': 'Main publisher class',
    'src/MongoLogger.ts': 'MongoDB logging class',
    'src/index.ts': 'Main exports',
    'src/cli.ts': 'Command-line interface',
    'README.md': 'Comprehensive documentation',
  },
  limitations: [
    'Medium API is officially deprecated (but still functional)',
    'No ability to edit published posts via API',
    'Rate limits apply to Medium API',
    'Notify followers feature not supported by API',
  ],
  bestPractices: [
    'Always publish as draft first for review',
    'Use meaningful tags for discoverability',
    'Set canonical URLs for republished content',
    'Enable MongoDB logging for tracking',
    'Specify generatedBy personality for attribution',
  ],
  relatedAbilities: [
    'neko-hunter',
    'puppeteer-operations',
    'neko-arc-tv-mcp',
  ],
  documentation: {
    readme: '/home/wakibaka/Documents/github/claude-operations/medium-publisher/README.md',
    mediumApiDocs: 'https://github.com/Medium/medium-api-docs',
    sdkDocs: 'https://www.npmjs.com/package/medium-sdk-ts',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
  tested: false,
  immutableRules: [
    'Rule 11: Credential Security - Uses .env file, NEVER hardcoded',
    'Rule 14: MCP MongoDB - MongoDB Atlas only',
    'Rule 15: Auto-Documentation - Saved to neko-abilities',
    'Rule 16: TypeScript Default - Full TypeScript implementation',
    'Rule 35: Claude Operations - Located in claude-operations repo',
  ],
};

async function saveAbility() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db('neko-abilities');
    const collection = db.collection('abilities');

    // Upsert the ability
    const result = await collection.updateOne(
      { abilityId: ability.abilityId },
      { $set: ability },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log('✅ Ability inserted into MongoDB');
    } else {
      console.log('✅ Ability updated in MongoDB');
    }

    console.log(`
📊 Ability Saved Successfully!
──────────────────────────────────────────
Ability ID:   ${ability.abilityId}
Name:         ${ability.name}
Version:      ${ability.version}
Database:     neko-abilities
Collection:   abilities
Status:       ${ability.status}
──────────────────────────────────────────
🐾 Nyaa~! Medium Publisher ability mastered, desu~! ✨
    `);
  } catch (error) {
    console.error('❌ Error saving ability:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

saveAbility();
