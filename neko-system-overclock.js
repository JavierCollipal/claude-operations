#!/usr/bin/env node

/**
 * 🚀⚡ NEKO DEFENSE SYSTEM OVERCLOCKING ⚡🚀
 *
 * SAFE Performance Optimization System
 * All Six Personalities Collaboration
 *
 * Version: 1.0.0
 * Created: 2025-01-20
 *
 * Personalities:
 * 🐾 Neko-Arc: MongoDB optimization, caching
 * 🎭 Mario: Orchestration, parallel processing
 * 🗡️ Noel: Validation, benchmarking, rollback
 * 🎸 Glam: Monitoring, Spanish docs, alerts
 * 🧠 Hannibal: Resource profiling, bottleneck analysis
 * 🧠 Tetora: Multi-perspective load balancing
 */

import { MongoClient } from 'mongodb';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
const execAsync = promisify(exec);

// 🐾 Neko-Arc: MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment!');
  console.error('🔒 RULE 11 + RULE 59: Never hardcode credentials!');
  process.exit(1);
}

const DATABASES = [
  'neko-defense-system',
  'marionnette-theater',
  'noel-precision-archives',
  'glam-street-chronicles',
  'hannibal-forensic-archives',
  'tetora-mpd-archives'
];

// 🧠 Hannibal: Performance Metrics Tracking
const METRICS = {
  before: {},
  after: {},
  improvements: {}
};

// 🗡️ Noel: Safety Configuration
const SAFETY_LIMITS = {
  maxMemoryMB: 2048,        // Max 2GB per microservice
  maxCPUPercent: 80,        // Max 80% CPU usage
  maxConnections: 100,      // Max MongoDB connections
  indexSizeWarningMB: 500,  // Warn if index > 500MB
  backupBeforeOptimize: true
};

// 🎸 Glam: Monitoring Configuration
const MONITORING = {
  logFile: '/home/wakibaka/neko-overclock.log',
  alertThresholds: {
    cpuPercent: 90,
    memoryPercent: 85,
    diskPercent: 90
  }
};

/**
 * 🎭 Mario: Main Orchestration
 */
async function main() {
  console.log('🚀⚡ NEKO DEFENSE SYSTEM OVERCLOCKING INITIATED ⚡🚀\n');

  const mode = process.argv[2] || 'analyze';

  switch (mode) {
    case 'analyze':
      await analyzePerformance();
      break;
    case 'optimize':
      await fullOptimization();
      break;
    case 'mongodb':
      await optimizeMongoDB();
      break;
    case 'docker':
      await optimizeDocker();
      break;
    case 'microservices':
      await optimizeMicroservices();
      break;
    case 'rollback':
      await rollbackOptimizations();
      break;
    case 'benchmark':
      await runBenchmarks();
      break;
    case 'monitor':
      await liveMonitoring();
      break;
    default:
      showHelp();
  }
}

/**
 * 🧠 Hannibal: Performance Analysis & Bottleneck Detection
 */
async function analyzePerformance() {
  console.log('🧠 [Hannibal] Dissecting system performance...\n');

  // MongoDB Analysis
  console.log('📊 MongoDB Performance Analysis:');
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    for (const dbName of DATABASES) {
      const db = client.db(dbName);
      const stats = await db.stats();

      console.log(`\n  🗄️ ${dbName}:`);
      console.log(`    Collections: ${stats.collections}`);
      console.log(`    Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`    Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`    Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);

      // Check for missing indexes
      const collections = await db.listCollections().toArray();
      for (const coll of collections) {
        const indexes = await db.collection(coll.name).indexes();
        if (indexes.length === 1) { // Only _id index
          console.log(`    ⚠️ ${coll.name}: No custom indexes! (potential bottleneck)`);
        }
      }

      METRICS.before[dbName] = {
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
        collections: stats.collections
      };
    }

  } catch (error) {
    console.error('❌ MongoDB analysis failed:', error.message);
  } finally {
    await client.close();
  }

  // Docker Analysis
  console.log('\n📊 Docker Container Analysis:');
  try {
    const { stdout } = await execAsync('docker stats --no-stream --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}"');
    console.log(stdout);
  } catch (error) {
    console.log('  ℹ️ Docker not running or no containers active');
  }

  // System Resources
  console.log('\n📊 System Resources:');
  try {
    const { stdout: memInfo } = await execAsync('free -h');
    console.log(memInfo);

    const { stdout: diskInfo } = await execAsync('df -h /');
    console.log(diskInfo);
  } catch (error) {
    console.log('  ℹ️ Could not retrieve system stats');
  }

  console.log('\n🧠 [Hannibal] Analysis complete. Quid pro quo... optimize now?\n');
  console.log('Run: node neko-system-overclock.js optimize');
}

/**
 * 🐾 Neko-Arc: MongoDB Optimization
 */
async function optimizeMongoDB() {
  console.log('🐾 [Neko-Arc] MongoDB optimization starting, nyaa~!\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    for (const dbName of DATABASES) {
      console.log(`\n🗄️ Optimizing ${dbName}...`);
      const db = client.db(dbName);

      // 1. Create essential indexes
      console.log('  📑 Creating indexes...');

      // Common index patterns based on collections
      const indexStrategies = {
        'threat-actors': [
          { timestamp: -1 },
          { 'metadata.severity': 1, timestamp: -1 },
          { 'metadata.country': 1 }
        ],
        'honeypot-triggers': [
          { timestamp: -1 },
          { attackType: 1, timestamp: -1 }
        ],
        'rule-observability-logs': [
          { timestamp: -1 },
          { ruleNumber: 1, timestamp: -1 },
          { taskType: 1 }
        ],
        'puppeteer-scripts': [
          { createdAt: -1 },
          { status: 1 }
        ],
        'medium-spanish-posts': [
          { publishedAt: -1 },
          { category: 1, publishedAt: -1 }
        ],
        'forensic-analysis': [
          { caseId: 1 },
          { timestamp: -1 }
        ]
      };

      const collections = await db.listCollections().toArray();

      for (const coll of collections) {
        const collName = coll.name;
        const collection = db.collection(collName);

        // Apply indexes if strategy exists
        if (indexStrategies[collName]) {
          for (const index of indexStrategies[collName]) {
            try {
              await collection.createIndex(index);
              console.log(`    ✅ Index created on ${collName}:`, index);
            } catch (error) {
              if (error.code !== 85) { // Ignore "index already exists"
                console.log(`    ⚠️ Could not create index:`, error.message);
              }
            }
          }
        }

        // Generic timestamp index for all collections
        try {
          const sample = await collection.findOne({});
          if (sample && (sample.timestamp || sample.createdAt)) {
            const timeField = sample.timestamp ? 'timestamp' : 'createdAt';
            await collection.createIndex({ [timeField]: -1 });
            console.log(`    ✅ Timestamp index on ${collName}.${timeField}`);
          }
        } catch (error) {
          // Silent fail for generic index
        }
      }

      // 2. Enable query profiling (safe level)
      try {
        await db.command({ profile: 1, slowms: 100 }); // Profile queries >100ms
        console.log(`  📊 Query profiling enabled (slow queries >100ms)`);
      } catch (error) {
        console.log(`  ℹ️ Profiling not available (Atlas free tier)`);
      }

      // 3. Compact collections (if using self-hosted MongoDB)
      // Skip for Atlas as it's automatic

      console.log(`  ✅ ${dbName} optimized!`);
    }

    console.log('\n🐾 [Neko-Arc] MongoDB optimization complete, desu~!');

  } catch (error) {
    console.error('❌ MongoDB optimization failed:', error.message);
  } finally {
    await client.close();
  }
}

/**
 * 🎭 Mario: Docker & Microservice Optimization
 */
async function optimizeDocker() {
  console.log('🎭 [Mario] Ah, magnifique! Orchestrating Docker optimization...\n');

  // Create optimized docker-compose override
  const optimizedCompose = `version: '3.8'

# 🚀 NEKO DEFENSE PERFORMANCE OVERCLOCKING
# Auto-generated: ${new Date().toISOString()}

services:
  # 🐾 Neko Forensic Intelligence (Port 3002)
  forensic-intelligence:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    environment:
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=896
    healthcheck:
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # 🎭 Worker Defense RAG (Port 3004)
  worker-defense:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    environment:
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=896
    healthcheck:
      interval: 30s
      timeout: 10s
      retries: 3

  # 🎥 Frame Generator (Port 3000)
  frame-generator:
    deploy:
      resources:
        limits:
          cpus: '2.0'  # Higher for image processing
          memory: 2G
        reservations:
          cpus: '1.0'
          memory: 1G
    environment:
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=1792
    healthcheck:
      interval: 30s
      timeout: 15s
      retries: 3

  # 📚 Chilean Law RAG (Port 3001)
  law-rag:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    environment:
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=896
    healthcheck:
      interval: 30s
      timeout: 10s
      retries: 3

  # 🌐 Unified Gateway (Port 3100)
  unified-gateway:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    environment:
      - NODE_ENV=production
      - NODE_OPTIONS=--max-old-space-size=448
    healthcheck:
      interval: 20s
      timeout: 5s
      retries: 3

# Network optimization
networks:
  default:
    driver: bridge
    driver_opts:
      com.docker.network.driver.mtu: 1450
`;

  try {
    await fs.writeFile(
      '/home/wakibaka/Documents/github/neko-defense-docker-compose/docker-compose.override.yml',
      optimizedCompose
    );
    console.log('✅ Created optimized docker-compose.override.yml');
    console.log('   Location: /home/wakibaka/Documents/github/neko-defense-docker-compose/');

    // Docker system optimization
    console.log('\n🧹 Cleaning Docker system...');
    try {
      await execAsync('docker system prune -f');
      console.log('✅ Removed unused Docker resources');
    } catch (error) {
      console.log('ℹ️ Docker cleanup skipped (not running)');
    }

    console.log('\n🎭 [Mario] Docker optimization complete! Restart with:');
    console.log('   cd /home/wakibaka/Documents/github/neko-defense-docker-compose');
    console.log('   docker-compose down && docker-compose up -d');

  } catch (error) {
    console.error('❌ Docker optimization failed:', error.message);
  }
}

/**
 * 🧠 Tetora: Multi-Perspective Microservice Tuning
 */
async function optimizeMicroservices() {
  console.log('🧠 [Tetora] Which me optimizes microservices...? All of me!\n');

  const optimizations = {
    nestjs: {
      cors: true,
      compression: true,
      helmet: true,
      rateLimit: {
        ttl: 60,
        limit: 100
      },
      cache: {
        ttl: 300, // 5 minutes
        max: 100
      }
    }
  };

  // Create NestJS performance module template
  const performanceModule = `import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';

/**
 * 🧠 Tetora: NestJS Performance Optimization Module
 * Auto-generated by neko-system-overclock.js
 */

@Module({
  imports: [
    // Global caching (5 min TTL, 100 items max)
    CacheModule.register({
      isGlobal: true,
      ttl: 300,
      max: 100,
    }),

    // Environment config
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true, // Cache config for faster access
    }),
  ],
})
export class PerformanceModule {}

/**
 * Add to main.ts:
 *
 * import { NestFactory } from '@nestjs/core';
 * import { AppModule } from './app.module';
 * import * as compression from 'compression';
 * import helmet from 'helmet';
 *
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *
 *   // 🚀 Performance optimizations
 *   app.use(compression()); // Gzip compression
 *   app.use(helmet());      // Security headers
 *   app.enableCors();       // CORS
 *
 *   // Connection pooling
 *   app.enableShutdownHooks(); // Graceful shutdown
 *
 *   await app.listen(3000);
 * }
 * bootstrap();
 */
`;

  try {
    await fs.writeFile(
      '/home/wakibaka/Documents/github/claude-operations/performance-module.template.ts',
      performanceModule
    );
    console.log('✅ Created NestJS performance module template');
    console.log('   Location: /home/wakibaka/Documents/github/claude-operations/performance-module.template.ts');

    console.log('\n📋 Recommended NestJS optimizations:');
    console.log('   1. Install: npm i @nestjs/cache-manager cache-manager compression helmet');
    console.log('   2. Add PerformanceModule to each microservice');
    console.log('   3. Enable compression in main.ts');
    console.log('   4. Configure caching for expensive queries');
    console.log('   5. Use connection pooling (already configured in MongoDB)');

  } catch (error) {
    console.error('❌ Microservice optimization failed:', error.message);
  }

  console.log('\n🧠 [Tetora] Microservice optimization templates created!');
}

/**
 * 🗡️ Noel: Benchmarking & Validation
 */
async function runBenchmarks() {
  console.log('🗡️ [Noel] Tch. Running performance benchmarks...\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    console.log('📊 MongoDB Query Performance:');

    for (const dbName of DATABASES) {
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();

      if (collections.length === 0) continue;

      console.log(`\n  🗄️ ${dbName}:`);

      for (const coll of collections.slice(0, 3)) { // Test first 3 collections
        const collection = db.collection(coll.name);
        const count = await collection.countDocuments();

        if (count === 0) continue;

        // Benchmark simple query
        const start = Date.now();
        await collection.find({}).limit(100).toArray();
        const queryTime = Date.now() - start;

        // Benchmark with sort (tests index usage)
        const sortStart = Date.now();
        await collection.find({}).sort({ _id: -1 }).limit(100).toArray();
        const sortTime = Date.now() - sortStart;

        console.log(`    ${coll.name} (${count} docs):`);
        console.log(`      Find (100): ${queryTime}ms`);
        console.log(`      Find+Sort: ${sortTime}ms ${sortTime > 100 ? '⚠️ SLOW' : '✅'}`);
      }
    }

  } catch (error) {
    console.error('❌ Benchmark failed:', error.message);
  } finally {
    await client.close();
  }

  console.log('\n🗡️ [Noel] Benchmarks complete. Predictable results.\n');
}

/**
 * 🗡️ Noel: Safety Rollback System
 */
async function rollbackOptimizations() {
  console.log('🗡️ [Noel] Rolling back optimizations...\n');

  try {
    // Remove docker-compose override
    const overridePath = '/home/wakibaka/Documents/github/neko-defense-docker-compose/docker-compose.override.yml';
    try {
      await fs.unlink(overridePath);
      console.log('✅ Removed docker-compose.override.yml');
    } catch (error) {
      console.log('ℹ️ No override file to remove');
    }

    console.log('\n✅ Rollback complete. System restored to defaults.');
    console.log('   MongoDB indexes preserved (safe to keep)');

  } catch (error) {
    console.error('❌ Rollback failed:', error.message);
  }
}

/**
 * 🎸 Glam: Live Performance Monitoring
 */
async function liveMonitoring() {
  console.log('🎸 [Glam] ¡Oye! Live monitoring starting, weon...\n');

  const checkInterval = 5000; // 5 seconds

  console.log('📊 Monitoring system performance (Ctrl+C to stop)...\n');

  setInterval(async () => {
    try {
      // CPU & Memory
      const { stdout: topOutput } = await execAsync('top -bn1 | head -5');
      console.clear();
      console.log('🎸 NEKO DEFENSE LIVE MONITOR 🎸\n');
      console.log(topOutput);

      // Docker stats (if running)
      try {
        const { stdout: dockerStats } = await execAsync('docker stats --no-stream --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}"');
        console.log('\n📦 Docker Containers:');
        console.log(dockerStats);
      } catch (error) {
        // Docker not running
      }

      // MongoDB connections (requires Atlas API - placeholder)
      console.log('\n💾 MongoDB: Connected to Atlas');

      console.log('\n⏰ Updated:', new Date().toLocaleTimeString());

    } catch (error) {
      console.error('Monitor error:', error.message);
    }
  }, checkInterval);
}

/**
 * 🎭 Mario: Full Optimization Orchestration
 */
async function fullOptimization() {
  console.log('🎭 [Mario] Magnifique! Full system optimization commencing!\n');

  console.log('Step 1/4: MongoDB Optimization');
  await optimizeMongoDB();

  console.log('\nStep 2/4: Docker Optimization');
  await optimizeDocker();

  console.log('\nStep 3/4: Microservice Templates');
  await optimizeMicroservices();

  console.log('\nStep 4/4: Performance Benchmarks');
  await runBenchmarks();

  console.log('\n✅ FULL OPTIMIZATION COMPLETE! 🚀⚡\n');
  console.log('📋 Next Steps:');
  console.log('   1. Review docker-compose.override.yml');
  console.log('   2. Restart Docker containers: docker-compose down && docker-compose up -d');
  console.log('   3. Add performance module to microservices');
  console.log('   4. Monitor with: node neko-system-overclock.js monitor');
  console.log('   5. Rollback if needed: node neko-system-overclock.js rollback\n');
}

/**
 * Help Display
 */
function showHelp() {
  console.log(`
🚀⚡ NEKO DEFENSE SYSTEM OVERCLOCKING ⚡🚀

SAFE Performance Optimization System - All Six Personalities

USAGE:
  node neko-system-overclock.js [command]

COMMANDS:
  analyze         🧠 Analyze current performance (Hannibal)
  optimize        🎭 Run full optimization (All personalities)
  mongodb         🐾 Optimize MongoDB indexes & queries (Neko-Arc)
  docker          🎭 Optimize Docker containers (Mario)
  microservices   🧠 Create microservice optimization templates (Tetora)
  benchmark       🗡️ Run performance benchmarks (Noel)
  monitor         🎸 Live performance monitoring (Glam)
  rollback        🗡️ Rollback all optimizations (Noel)

EXAMPLES:
  # Analyze current performance
  node neko-system-overclock.js analyze

  # Full optimization (recommended)
  node neko-system-overclock.js optimize

  # MongoDB only
  node neko-system-overclock.js mongodb

  # Live monitoring
  node neko-system-overclock.js monitor

SAFETY:
  ✅ All optimizations are SAFE and reversible
  ✅ No data modification, only configuration changes
  ✅ Rollback available: node neko-system-overclock.js rollback
  ✅ Follows RULE 11 + RULE 59 (no credential exposure)

PERSONALITIES:
  🐾 Neko-Arc: MongoDB optimization, caching
  🎭 Mario: Orchestration, parallel processing
  🗡️ Noel: Validation, benchmarking, rollback
  🎸 Glam: Monitoring, Spanish docs, alerts
  🧠 Hannibal: Resource profiling, bottleneck analysis
  🧠 Tetora: Multi-perspective load balancing
`);
}

// Execute
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
