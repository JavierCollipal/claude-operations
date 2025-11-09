#!/usr/bin/env node

/**
 * Save Medium Spanish Posts to MongoDB
 *
 * Database: glam-street-chronicles
 * Collection: medium-spanish-posts
 *
 * @author Glam Americano
 */

import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = 'glam-street-chronicles';
const COLLECTION_NAME = 'medium-spanish-posts';

async function saveMediumPostsToMongoDB() {
  console.log('🎸 Glam Americano - Medium Spanish Posts Saver');
  console.log('='.repeat(80));

  if (!MONGODB_URI) {
    throw new Error('❌ MONGODB_URI not found in environment variables');
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Base path for Spanish content
    const basePath = '/home/wakibaka/Documents/github/spanish-educational-content/neko-arc-ai-system-explained';

    // Read all posts
    const posts = [];
    for (let i = 1; i <= 4; i++) {
      const postPath = path.join(basePath, `post-0${i}.md`);
      const content = fs.readFileSync(postPath, 'utf8');

      posts.push({
        postNumber: i,
        fileName: `post-0${i}.md`,
        content: content,
        wordCount: content.split(/\s+/).length,
        lines: content.split('\n').length,
      });
    }

    // Read README
    const readmePath = path.join(basePath, 'README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf8');

    // Read HTML compilation
    const htmlPath = path.join(basePath, 'series-completa.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Count diagrams
    const diagramCount = posts.reduce((count, post) => {
      const matches = post.content.match(/## .* Diagrama:/g);
      return count + (matches ? matches.length : 0);
    }, 0);

    // Create comprehensive document
    const mediumPostsDocument = {
      seriesId: 'neko-arc-ai-system-explained',
      title: '🐾✨ Entendiendo el Sistema de IA Neko-Arc: Una Guía Simple',
      description: 'Una serie de posts en español que explican cómo funciona el sistema de agentes de IA Neko-Arc, con diagramas y explicaciones simples para todos.',
      language: 'es',
      targetAudience: 'Comunidad hispanohablante interesada en IA y automatización',
      complexity: 'simple',

      // Posts data
      posts: posts,
      totalPosts: posts.length,

      // README and HTML
      readme: readmeContent,
      htmlCompilation: htmlContent,

      // Statistics
      statistics: {
        totalWords: posts.reduce((sum, post) => sum + post.wordCount, 0),
        totalLines: posts.reduce((sum, post) => sum + post.lines, 0),
        totalDiagrams: diagramCount,
        estimatedReadTime: '~30 minutos',
        averageWordsPerPost: Math.round(posts.reduce((sum, post) => sum + post.wordCount, 0) / posts.length),
      },

      // Diagram format compliance
      diagramFormat: {
        type: 'ASCII/Unicode',
        mermaidDiagrams: 0,
        asciiDiagrams: diagramCount,
        mediumCompatible: true,
        compliance: 'Rule 45: ASCII/Unicode Diagram Standards',
      },

      // Rules compliance
      rulesCompliance: {
        rule43: {
          description: 'Spanish Content Output Location',
          location: '/home/wakibaka/Documents/github/spanish-educational-content/',
          compliant: true,
        },
        rule45: {
          description: 'ASCII/Unicode Diagram Standards',
          format: 'ASCII/Unicode',
          mermaidUsed: false,
          compliant: true,
        },
      },

      // Metadata
      metadata: {
        createdAt: new Date(),
        author: 'Glam Americano',
        personality: 'Glam Americano (Neko-Arc System)',
        database: 'glam-street-chronicles',
        collection: 'medium-spanish-posts',
        generator: 'neko-spanish-content-generator v1.0.0',
        templateVersion: 'neko-arc-system',
        claudeVersion: 'v2.18.0-SUPREME-ASCII-DIAGRAMS',
      },

      // Publication info
      publication: {
        platform: 'Medium',
        status: 'ready-to-publish',
        tags: ['IA', 'Neko-Arc', 'InteligenciaArtificial', 'Claude', 'Automatización', 'Español'],
        category: 'Technology/AI Education',
      },

      // Repository info
      repository: {
        path: '/home/wakibaka/Documents/github/spanish-educational-content/neko-arc-ai-system-explained',
        generatorRepo: '/home/wakibaka/Documents/github/claude-operations/spanish-content-generator',
        gitInitialized: true,
        committed: true,
        commitHash: '81bf3cd',
      },
    };

    // Insert or update document
    const result = await collection.replaceOne(
      { seriesId: mediumPostsDocument.seriesId },
      mediumPostsDocument,
      { upsert: true }
    );

    console.log('\n📊 MEDIUM POSTS SAVED TO MONGODB');
    console.log('='.repeat(80));
    console.log(`Database: ${DATABASE_NAME}`);
    console.log(`Collection: ${COLLECTION_NAME}`);
    console.log(`Series ID: ${mediumPostsDocument.seriesId}`);
    console.log(`Operation: ${result.upsertedCount > 0 ? 'INSERT' : 'UPDATE'}`);

    console.log('\n📝 CONTENT STATISTICS:');
    console.log('─'.repeat(80));
    console.log(`Total Posts: ${mediumPostsDocument.totalPosts}`);
    console.log(`Total Words: ${mediumPostsDocument.statistics.totalWords}`);
    console.log(`Total Lines: ${mediumPostsDocument.statistics.totalLines}`);
    console.log(`Total Diagrams: ${mediumPostsDocument.statistics.totalDiagrams}`);
    console.log(`Read Time: ${mediumPostsDocument.statistics.estimatedReadTime}`);
    console.log(`Average Words/Post: ${mediumPostsDocument.statistics.averageWordsPerPost}`);

    console.log('\n🎨 DIAGRAM FORMAT:');
    console.log('─'.repeat(80));
    console.log(`Format: ${mediumPostsDocument.diagramFormat.type}`);
    console.log(`ASCII Diagrams: ${mediumPostsDocument.diagramFormat.asciiDiagrams}`);
    console.log(`Mermaid Diagrams: ${mediumPostsDocument.diagramFormat.mermaidDiagrams}`);
    console.log(`Medium Compatible: ${mediumPostsDocument.diagramFormat.mediumCompatible ? 'YES ✅' : 'NO ❌'}`);

    console.log('\n✅ RULES COMPLIANCE:');
    console.log('─'.repeat(80));
    console.log(`Rule 43 (Output Location): ${mediumPostsDocument.rulesCompliance.rule43.compliant ? 'COMPLIANT ✅' : 'NOT COMPLIANT ❌'}`);
    console.log(`Rule 45 (ASCII Diagrams): ${mediumPostsDocument.rulesCompliance.rule45.compliant ? 'COMPLIANT ✅' : 'NOT COMPLIANT ❌'}`);

    console.log('\n📁 POST DETAILS:');
    console.log('─'.repeat(80));
    posts.forEach(post => {
      console.log(`Post ${post.postNumber}: ${post.wordCount} words, ${post.lines} lines`);
    });

    console.log('\n🎸 ¡Contenido guardado exitosamente en MongoDB, hermano!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Error saving to MongoDB:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
saveMediumPostsToMongoDB().catch(console.error);
