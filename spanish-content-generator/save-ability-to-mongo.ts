/**
 * Save Spanish Content Generator Ability to MongoDB
 * Database: neko-abilities
 * Collection: abilities
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const ability = {
  abilityId: 'spanish-content-generator-v1',
  name: 'Spanish Educational Content Generator',
  version: '1.0.0',
  description: '🎸 Generador automático de contenido educativo en español sobre sistemas de IA - Creates complete post series in Spanish with diagrams and simple explanations',
  category: 'content-generation',
  personalities: ['glam-americano', 'neko-arc', 'mario', 'noel', 'hannibal', 'tetora'],
  leadPersonality: 'glam-americano',
  features: [
    'Genera series completas de posts en español',
    'Diagramas Mermaid integrados automáticamente',
    'Exportación a Markdown y HTML',
    'Explicaciones simples para audiencia hispanohablante',
    'MongoDB logging de contenido generado',
    'CLI fácil de usar',
    'Templates reutilizables y extensibles',
    'Estadísticas automáticas de contenido',
  ],
  technologies: {
    language: 'TypeScript',
    runtime: 'Node.js',
    database: 'MongoDB Atlas',
    buildTool: 'tsc',
    diagrams: 'Mermaid.js',
    cli: 'Commander.js',
  },
  templates: {
    current: ['neko-arc-system'],
    'neko-arc-system': {
      description: 'Explica el sistema de IA Neko-Arc en 4 posts completos',
      posts: 4,
      diagrams: 6,
      readTime: '~30 minutos',
      topics: [
        '¿Qué es Neko-Arc?',
        'Arquitectura del Sistema',
        'Las 42 Reglas Inmutables',
        'Casos de Uso Reales',
      ],
    },
  },
  installation: {
    location: '/home/wakibaka/Documents/github/claude-operations/spanish-content-generator/',
    commands: [
      'cd /home/wakibaka/Documents/github/claude-operations/spanish-content-generator',
      'npm install',
      'npm run build',
      'cp .env.example .env  # Optional, for MongoDB logging',
    ],
  },
  usage: {
    cli: {
      generate: 'npm run generate -- generate -t neko-arc-system',
      generateMarkdownOnly: 'npm run generate -- generate -t neko-arc-system --format markdown',
      generateHtmlOnly: 'npm run generate -- generate -t neko-arc-system --format html',
      noMongo: 'npm run generate -- generate -t neko-arc-system --no-mongo',
      templates: 'npm run generate -- templates',
      list: 'npm run generate -- list',
    },
    programmatic: {
      example: `
import { ContentGenerator } from 'neko-spanish-content-generator';

const generator = new ContentGenerator('./output');
const series = generator.generateContent('neko-arc-system');
const mdFiles = generator.exportToMarkdown(series);
const htmlFile = generator.exportToHTML(series);
const stats = generator.getStatistics(series);
      `,
    },
  },
  output: {
    directory: './output/',
    formats: ['markdown', 'html'],
    structure: {
      'README.md': 'Índice de la serie',
      'post-XX.md': 'Posts individuales en Markdown',
      'series-completa.html': 'Serie completa en un solo HTML',
    },
  },
  contentGenerated: {
    postsPerSeries: 4,
    totalWords: '~8,500',
    totalDiagrams: 6,
    totalReadTime: '~30 minutos',
    language: 'Spanish (es)',
    complexity: 'simple',
    targetAudience: 'Comunidad hispanohablante interesada en IA',
  },
  mongodbSchema: {
    database: 'neko-defense-system',
    collection: 'spanish-educational-content',
    fields: {
      recordId: 'string - ID único del registro',
      seriesId: 'string - ID de la serie',
      title: 'string - Título de la serie',
      topic: 'string - Tema principal',
      language: 'string - Idioma (es)',
      complexity: 'string - simple, intermediate, advanced',
      numPosts: 'number - Número de posts',
      generatedBy: 'string - Personalidad que lo generó',
      outputPath: 'string - Ubicación de archivos',
      createdAt: 'Date - Fecha de creación',
    },
  },
  integration: {
    withMedium: false,
    withDevTo: true,
    withHashnode: true,
    withNotion: true,
    withYouTube: false,
    withBlogs: true,
  },
  files: {
    'src/types.ts': 'TypeScript type definitions',
    'src/ContentGenerator.ts': 'Main generator class',
    'src/MongoLogger.ts': 'MongoDB integration',
    'src/cli.ts': 'CLI interface',
    'src/index.ts': 'Public exports',
    'src/templates/neko-arc-system.ts': 'Neko-Arc system template with 4 complete posts',
    'README.md': 'Comprehensive documentation in Spanish',
  },
  limitations: [
    'Templates currently limited to technical topics',
    'Diagrams require Mermaid.js support in target platform',
    'Spanish language only (can be extended)',
  ],
  bestPractices: [
    'Review generated content before publishing',
    'Customize templates for your specific audience',
    'Add more templates for different topics',
    'Use MongoDB logging to track what was generated',
    'Specify personality with --generated-by flag',
  ],
  relatedAbilities: [
    'medium-publisher-v1',
    'neko-arc-tv-mcp',
    'puppeteer-operations',
  ],
  documentation: {
    readme: '/home/wakibaka/Documents/github/claude-operations/spanish-content-generator/README.md',
    exampleOutput: '/home/wakibaka/Documents/github/claude-operations/spanish-content-generator/output/',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
  tested: false,
  immutableRules: [
    'Rule 11: Credential Security - Uses .env file for MongoDB',
    'Rule 14: MCP MongoDB - MongoDB Atlas only',
    'Rule 15: Auto-Documentation - Saved to neko-abilities',
    'Rule 16: TypeScript Default - Full TypeScript implementation',
    'Rule 22: Glam Protocol - Spanish content is Glam\'s specialty',
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
Lead:         ${ability.leadPersonality} 🎸
Database:     neko-abilities
Collection:   abilities
Status:       ${ability.status}
──────────────────────────────────────────
🎸 ¡Habilidad guardada, hermano! 🤘✨
    `);
  } catch (error) {
    console.error('❌ Error saving ability:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

saveAbility();
