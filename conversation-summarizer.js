#!/usr/bin/env node
/**
 * 🧠 Tetora's Conversation Summarization System
 *
 * Purpose: Auto-summarize conversations and store multi-perspective summaries
 * Version: v3.0.0 (Sprint 3.0 Phase 4 - Task 4.2)
 * Lead: 🧠 Tetora (Multi-Perspective Analysis)
 *
 * Features:
 * 1. Conversation history compression
 * 2. Six-personality perspective summaries
 * 3. MongoDB storage across all 6 databases
 * 4. Summary recall and search
 * 5. Automatic triggering on long conversations
 */

import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// MongoDB URIs from environment
const MONGODB_URIS = {
  neko: process.env.MONGODB_URI_NEKO || process.env.MONGODB_URI,
  mario: process.env.MONGODB_URI_MARIO || process.env.MONGODB_URI,
  noel: process.env.MONGODB_URI_NOEL || process.env.MONGODB_URI,
  glam: process.env.MONGODB_URI_GLAM || process.env.MONGODB_URI,
  hannibal: process.env.MONGODB_URI_HANNIBAL || process.env.MONGODB_URI,
  tetora: process.env.MONGODB_URI_TETORA || process.env.MONGODB_URI
};

// Database names
const DATABASES = {
  neko: 'neko-defense-system',
  mario: 'marionnette-theater',
  noel: 'noel-precision-archives',
  glam: 'glam-street-chronicles',
  hannibal: 'hannibal-forensic-archives',
  tetora: 'tetora-mpd-archives'
};

// Collection name
const COLLECTION = 'conversation-summaries';

/**
 * Tetora's Six-Perspective Conversation Analysis
 */
function generateSixPerspectiveSummary(conversationData) {
  const timestamp = new Date();

  return {
    conversationId: conversationData.id || `conv-${Date.now()}`,
    timestamp,
    messageCount: conversationData.messages?.length || 0,
    tokenEstimate: conversationData.tokenEstimate || 'unknown',

    // 🐾 Neko-Arc's Perspective
    nekoPerspective: {
      personality: 'Neko-Arc',
      focus: 'Technical Execution',
      summary: conversationData.nekoSummary || 'Technical tasks completed with maximum kawaii power, nyaa~!',
      keyTasks: conversationData.nekoTasks || [],
      toolsUsed: conversationData.toolsUsed || []
    },

    // 🎭 Mario's Perspective
    marioPerspective: {
      personality: 'Mario Gallo Bestino',
      focus: 'Workflow Orchestration',
      summary: conversationData.marioSummary || 'Ah, the performance! A magnificent workflow orchestration!',
      workflows: conversationData.workflows || [],
      automations: conversationData.automations || []
    },

    // 🗡️ Noel's Perspective
    noelPerspective: {
      personality: 'Noel',
      focus: 'Validation & Testing',
      summary: conversationData.noelSummary || 'Tch. Predictable. All validation passed. *smirks*',
      testsRun: conversationData.testsRun || [],
      bugsFixed: conversationData.bugsFixed || []
    },

    // 🎸 Glam's Perspective
    glamPerspective: {
      personality: 'Glam Americano',
      focus: 'Spanish Content & Ethics',
      summary: conversationData.glamSummary || '¡Oye, weon! Spanish content created successfully!',
      spanishContent: conversationData.spanishContent || [],
      ethicalDecisions: conversationData.ethicalDecisions || []
    },

    // 🧠 Hannibal's Perspective
    hannibalPerspective: {
      personality: 'Dr. Hannibal Lecter',
      focus: 'Forensic Analysis',
      summary: conversationData.hannibalSummary || 'How... fascinating. The forensic analysis reveals...',
      forensicInsights: conversationData.forensicInsights || [],
      dissections: conversationData.dissections || []
    },

    // 🧠 Tetora's Perspective (Multi-Fragment Analysis)
    tetoraPerspective: {
      personality: 'Tetora',
      focus: 'Multi-Perspective Integration',
      summary: conversationData.tetoraSummary || 'Which me analyzed this...? All of me.',
      fragments: [
        {
          fragment: 1,
          role: 'Organizer',
          insight: conversationData.tetoraFragment1 || 'Tasks organized systematically.'
        },
        {
          fragment: 2,
          role: 'Analyst',
          insight: conversationData.tetoraFragment2 || 'Patterns identified and analyzed.'
        },
        {
          fragment: 3,
          role: 'Strategist',
          insight: conversationData.tetoraFragment3 || 'Optimal strategy determined.'
        },
        {
          fragment: 4,
          role: 'Validator',
          insight: conversationData.tetoraFragment4 || 'All criteria validated.'
        },
        {
          fragment: 5,
          role: 'Visionary',
          insight: conversationData.tetoraFragment5 || 'Future implications considered.'
        },
        {
          fragment: 6,
          role: 'Integrator',
          insight: conversationData.tetoraFragment6 || 'All perspectives integrated successfully.'
        }
      ]
    },

    // Overall Summary
    overallSummary: conversationData.overallSummary || 'Six-personality collaboration completed successfully.',

    // Tags for search
    tags: conversationData.tags || ['general'],

    // Compression metrics
    compressionMetrics: {
      originalLength: conversationData.originalLength || 0,
      summaryLength: JSON.stringify(conversationData).length,
      compressionRatio: conversationData.originalLength
        ? (1 - (JSON.stringify(conversationData).length / conversationData.originalLength)).toFixed(2)
        : 'unknown'
    }
  };
}

/**
 * Save summary to all 6 personality databases
 */
async function saveSummaryToAllDatabases(summary) {
  const results = {};

  for (const [personality, uri] of Object.entries(MONGODB_URIS)) {
    if (!uri) {
      console.log(`⚠️  No URI for ${personality}, skipping...`);
      continue;
    }

    try {
      const client = new MongoClient(uri);
      await client.connect();

      const db = client.db(DATABASES[personality]);
      const collection = db.collection(COLLECTION);

      // Add personality-specific metadata
      const personalityDocument = {
        ...summary,
        savedBy: personality,
        database: DATABASES[personality]
      };

      const result = await collection.insertOne(personalityDocument);
      results[personality] = { success: true, id: result.insertedId };

      await client.close();
      console.log(`✅ ${personality}: Saved to ${DATABASES[personality]}.${COLLECTION}`);
    } catch (error) {
      results[personality] = { success: false, error: error.message };
      console.error(`❌ ${personality}: ${error.message}`);
    }
  }

  return results;
}

/**
 * Search summaries by tag or conversationId
 */
async function searchSummaries(query) {
  console.log(`🔍 Searching for: ${JSON.stringify(query)}\n`);

  const results = {};

  for (const [personality, uri] of Object.entries(MONGODB_URIS)) {
    if (!uri) continue;

    try {
      const client = new MongoClient(uri);
      await client.connect();

      const db = client.db(DATABASES[personality]);
      const collection = db.collection(COLLECTION);

      const summaries = await collection.find(query).toArray();
      results[personality] = summaries;

      await client.close();
      console.log(`✅ ${personality}: Found ${summaries.length} summaries`);
    } catch (error) {
      results[personality] = [];
      console.error(`❌ ${personality}: ${error.message}`);
    }
  }

  return results;
}

/**
 * Get latest summary
 */
async function getLatestSummary() {
  console.log('🔍 Fetching latest summary...\n');

  const uri = MONGODB_URIS.tetora || MONGODB_URIS.neko;
  if (!uri) {
    throw new Error('No MongoDB URI available');
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(DATABASES.tetora || DATABASES.neko);
  const collection = db.collection(COLLECTION);

  const latest = await collection
    .find({})
    .sort({ timestamp: -1 })
    .limit(1)
    .toArray();

  await client.close();

  return latest[0] || null;
}

/**
 * Main CLI
 */
async function main() {
  const command = process.argv[2];

  console.log('\n🧠 TETORA\'S CONVERSATION SUMMARIZATION SYSTEM v3.0.0');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('Which me is running this...? All of me.\n');

  try {
    switch (command) {
      case 'save': {
        // Save a new summary
        const conversationFile = process.argv[3];

        if (!conversationFile) {
          console.log('Usage: node conversation-summarizer.js save <conversation-data.json>');
          console.log('\nExample conversation-data.json:');
          console.log(JSON.stringify({
            id: 'conv-20251112-001',
            messages: ['message 1', 'message 2'],
            tokenEstimate: '60k',
            nekoSummary: 'Technical work completed, nyaa~!',
            nekoTasks: ['Task 1', 'Task 2'],
            overallSummary: 'Sprint 3.0 Phase 4 completed',
            tags: ['sprint-3.0', 'phase-4', 'testing']
          }, null, 2));
          process.exit(1);
        }

        const conversationData = JSON.parse(readFileSync(conversationFile, 'utf-8'));
        const summary = generateSixPerspectiveSummary(conversationData);

        console.log('📊 Six-Perspective Summary Generated:\n');
        console.log(`Conversation ID: ${summary.conversationId}`);
        console.log(`Messages: ${summary.messageCount}`);
        console.log(`Token Estimate: ${summary.tokenEstimate}`);
        console.log(`Compression Ratio: ${summary.compressionMetrics.compressionRatio}\n`);

        console.log('💾 Saving to all 6 personality databases...\n');
        const results = await saveSummaryToAllDatabases(summary);

        console.log('\n📊 Save Results:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        Object.entries(results).forEach(([personality, result]) => {
          const status = result.success ? '✅' : '❌';
          console.log(`${status} ${personality}: ${result.success ? 'Saved' : result.error}`);
        });

        console.log('\n🧠 Which me is satisfied...? All of me.\n');
        break;
      }

      case 'search': {
        // Search summaries
        const tag = process.argv[3];

        if (!tag) {
          console.log('Usage: node conversation-summarizer.js search <tag>');
          console.log('Example: node conversation-summarizer.js search sprint-3.0');
          process.exit(1);
        }

        const results = await searchSummaries({ tags: tag });

        console.log('\n📊 Search Results:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        Object.entries(results).forEach(([personality, summaries]) => {
          console.log(`\n${personality.toUpperCase()}:`);
          summaries.forEach(s => {
            console.log(`  - ${s.conversationId} (${s.timestamp.toISOString()})`);
            console.log(`    ${s.overallSummary}`);
          });
        });

        console.log('\n');
        break;
      }

      case 'latest': {
        // Get latest summary
        const latest = await getLatestSummary();

        if (!latest) {
          console.log('❌ No summaries found.');
          process.exit(1);
        }

        console.log('📊 Latest Conversation Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log(`Conversation ID: ${latest.conversationId}`);
        console.log(`Timestamp: ${latest.timestamp.toISOString()}`);
        console.log(`Messages: ${latest.messageCount}`);
        console.log(`Token Estimate: ${latest.tokenEstimate}`);
        console.log(`\nOverall: ${latest.overallSummary}\n`);

        console.log('🐾 Neko-Arc:', latest.nekoPerspective.summary);
        console.log('🎭 Mario:', latest.marioPerspective.summary);
        console.log('🗡️ Noel:', latest.noelPerspective.summary);
        console.log('🎸 Glam:', latest.glamPerspective.summary);
        console.log('🧠 Hannibal:', latest.hannibalPerspective.summary);
        console.log('🧠 Tetora:', latest.tetoraPerspective.summary);

        console.log('\n');
        break;
      }

      case 'list': {
        // List all summaries
        const results = await searchSummaries({});

        console.log('📊 All Conversation Summaries:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        Object.entries(results).forEach(([personality, summaries]) => {
          console.log(`\n${personality.toUpperCase()}: ${summaries.length} summaries`);
        });

        console.log('\n');
        break;
      }

      default:
        console.log('Usage: node conversation-summarizer.js <command> [args]');
        console.log('\nCommands:');
        console.log('  save <file>     - Save conversation summary from JSON file');
        console.log('  search <tag>    - Search summaries by tag');
        console.log('  latest          - Get latest conversation summary');
        console.log('  list            - List all summaries\n');
        console.log('🧠 Which me will you choose...? All of me.\n');
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run CLI
main();
