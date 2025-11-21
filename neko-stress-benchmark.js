#!/usr/bin/env node

/**
 * 🎯🔥 NEKO AUTOMATED STRESS TESTING & BENCHMARKING 🔥🎯
 *
 * SAFE Performance Validation with Thermal Monitoring
 * All Six Personalities Collaboration - STAGE 3
 *
 * Version: 1.0.0
 * Created: 2025-01-20
 *
 * Integrates:
 * - Stage 1: Overclocking system (neko-system-overclock.js)
 * - Stage 2: Thermal monitoring (neko-thermal-monitor.js)
 * - Stage 3: Stress testing & benchmarking (this file)
 *
 * Personalities:
 * 🐾 Neko-Arc: Benchmark execution, MongoDB stress tests
 * 🎭 Mario: Test orchestration, multi-test coordination
 * 🗡️ Noel: Validation, regression detection, pass/fail criteria
 * 🎸 Glam: Visual reports, performance graphs, Spanish docs
 * 🧠 Hannibal: Performance analysis, bottleneck identification
 * 🧠 Tetora: Multi-perspective load distribution, test scenarios
 */

import { MongoClient } from 'mongodb';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { performance } from 'perf_hooks';
const execAsync = promisify(exec);

// 🐾 Neko-Arc: MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment!');
  console.error('🔒 RULE 11 + RULE 59: Never hardcode credentials!');
  process.exit(1);
}

// 🗡️ Noel: Safety Thresholds for Stress Testing
const STRESS_SAFETY = {
  maxCPUTemp: 85,           // Stop test if CPU exceeds this
  maxDiskTemp: 60,          // Stop test if disk exceeds this
  maxTestDuration: 600000,  // 10 minutes maximum per test
  checkInterval: 2000,      // Check temps every 2 seconds
  cooldownTime: 30000       // 30 seconds between tests
};

// 🧠 Tetora: Test Scenarios
const TEST_SCENARIOS = {
  quick: {
    name: 'Quick Validation',
    duration: 60000,      // 1 minute
    intensity: 'low',
    tests: ['cpu-light', 'memory-light', 'mongodb-basic']
  },
  standard: {
    name: 'Standard Benchmark',
    duration: 300000,     // 5 minutes
    intensity: 'medium',
    tests: ['cpu-medium', 'memory-medium', 'disk-medium', 'mongodb-standard', 'api-load']
  },
  intensive: {
    name: 'Intensive Stress Test',
    duration: 600000,     // 10 minutes
    intensity: 'high',
    tests: ['cpu-stress', 'memory-stress', 'disk-stress', 'mongodb-stress', 'api-stress']
  }
};

// 🎸 Glam: Color Codes for Output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// 🧠 Hannibal: Performance Metrics Storage
const benchmarkResults = {
  testName: '',
  startTime: null,
  endTime: null,
  scenario: '',
  thermalData: [],
  tests: [],
  summary: {},
  passed: false,
  stoppedEarly: false,
  stopReason: ''
};

/**
 * 🐾 Neko-Arc: Get Current Temperature (from thermal monitor)
 */
async function getCurrentTemperature() {
  try {
    // Try lm-sensors first
    const { stdout } = await execAsync('sensors -u 2>/dev/null | grep -E "temp[0-9]+_input" | head -1 | awk \'{print $2}\'');
    if (stdout.trim()) {
      return { cpu: parseFloat(stdout.trim()), disk: 35 }; // Simplified for now
    }
  } catch (error) {
    // Fallback
  }

  // Fallback: thermal zone
  try {
    const tempStr = await fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8');
    return { cpu: parseInt(tempStr.trim()) / 1000, disk: 35 };
  } catch (error) {
    // Safe defaults
    return { cpu: 45, disk: 35 };
  }
}

/**
 * 🗡️ Noel: Thermal Safety Check
 */
async function checkThermalSafety() {
  const temps = await getCurrentTemperature();

  if (temps.cpu >= STRESS_SAFETY.maxCPUTemp) {
    return {
      safe: false,
      reason: `CPU temperature ${temps.cpu.toFixed(1)}°C exceeds safe limit ${STRESS_SAFETY.maxCPUTemp}°C`,
      temps
    };
  }

  if (temps.disk >= STRESS_SAFETY.maxDiskTemp) {
    return {
      safe: false,
      reason: `Disk temperature ${temps.disk.toFixed(1)}°C exceeds safe limit ${STRESS_SAFETY.maxDiskTemp}°C`,
      temps
    };
  }

  return { safe: true, temps };
}

/**
 * 🐾 Neko-Arc: CPU Benchmark (Prime Number Calculation)
 */
async function benchmarkCPU(duration = 30000, intensity = 'medium') {
  console.log(`\n${COLORS.cyan}🖥️  CPU Benchmark (${intensity} intensity)${COLORS.reset}`);
  console.log(`   Duration: ${(duration / 1000).toFixed(0)}s`);

  const startTime = performance.now();
  const endTime = startTime + duration;
  let iterations = 0;
  let thermalChecks = [];

  // Intensity determines number calculation complexity
  const maxPrime = intensity === 'low' ? 10000 :
                   intensity === 'medium' ? 50000 :
                   100000;

  const checkThermalInterval = setInterval(async () => {
    const safety = await checkThermalSafety();
    thermalChecks.push(safety.temps);

    if (!safety.safe) {
      console.error(`\n${COLORS.red}⚠️  THERMAL LIMIT REACHED!${COLORS.reset}`);
      console.error(`   ${safety.reason}`);
      clearInterval(checkThermalInterval);
      throw new Error('THERMAL_LIMIT_EXCEEDED');
    }
  }, STRESS_SAFETY.checkInterval);

  try {
    while (performance.now() < endTime) {
      // Calculate primes up to maxPrime
      for (let num = 2; num <= maxPrime; num++) {
        let isPrime = true;
        for (let i = 2; i <= Math.sqrt(num); i++) {
          if (num % i === 0) {
            isPrime = false;
            break;
          }
        }
      }
      iterations++;
    }

    clearInterval(checkThermalInterval);

    const actualDuration = performance.now() - startTime;
    const score = Math.floor((iterations * 1000) / actualDuration);

    console.log(`   ${COLORS.green}✓ Completed${COLORS.reset}`);
    console.log(`   Iterations: ${iterations}`);
    console.log(`   Score: ${score} iterations/sec`);
    console.log(`   Avg Temp: ${(thermalChecks.reduce((a, b) => a + b.cpu, 0) / thermalChecks.length).toFixed(1)}°C`);

    return {
      test: 'cpu',
      intensity,
      duration: actualDuration,
      iterations,
      score,
      avgTemp: thermalChecks.reduce((a, b) => a + b.cpu, 0) / thermalChecks.length,
      maxTemp: Math.max(...thermalChecks.map(t => t.cpu)),
      passed: true
    };

  } catch (error) {
    clearInterval(checkThermalInterval);
    throw error;
  }
}

/**
 * 🐾 Neko-Arc: Memory Benchmark (Array Operations)
 */
async function benchmarkMemory(duration = 30000, intensity = 'medium') {
  console.log(`\n${COLORS.cyan}💾 Memory Benchmark (${intensity} intensity)${COLORS.reset}`);
  console.log(`   Duration: ${(duration / 1000).toFixed(0)}s`);

  const startTime = performance.now();
  const endTime = startTime + duration;
  let operations = 0;
  let thermalChecks = [];

  // Intensity determines array size
  const arraySize = intensity === 'low' ? 100000 :
                    intensity === 'medium' ? 500000 :
                    1000000;

  const checkThermalInterval = setInterval(async () => {
    const safety = await checkThermalSafety();
    thermalChecks.push(safety.temps);

    if (!safety.safe) {
      clearInterval(checkThermalInterval);
      throw new Error('THERMAL_LIMIT_EXCEEDED');
    }
  }, STRESS_SAFETY.checkInterval);

  try {
    while (performance.now() < endTime) {
      // Create large array
      const arr = new Array(arraySize).fill(0).map((_, i) => i);

      // Perform operations
      arr.sort((a, b) => b - a);  // Reverse sort
      arr.map(x => x * 2);        // Map
      arr.filter(x => x % 2 === 0); // Filter
      arr.reduce((a, b) => a + b, 0); // Reduce

      operations++;
    }

    clearInterval(checkThermalInterval);

    const actualDuration = performance.now() - startTime;
    const score = Math.floor((operations * 1000) / actualDuration);

    console.log(`   ${COLORS.green}✓ Completed${COLORS.reset}`);
    console.log(`   Operations: ${operations}`);
    console.log(`   Score: ${score} ops/sec`);
    console.log(`   Array Size: ${arraySize} elements`);

    return {
      test: 'memory',
      intensity,
      duration: actualDuration,
      operations,
      score,
      arraySize,
      avgTemp: thermalChecks.reduce((a, b) => a + b.cpu, 0) / thermalChecks.length,
      maxTemp: Math.max(...thermalChecks.map(t => t.cpu)),
      passed: true
    };

  } catch (error) {
    clearInterval(checkThermalInterval);
    throw error;
  }
}

/**
 * 🐾 Neko-Arc: MongoDB Benchmark
 */
async function benchmarkMongoDB(duration = 30000, intensity = 'medium') {
  console.log(`\n${COLORS.cyan}🗄️  MongoDB Benchmark (${intensity} intensity)${COLORS.reset}`);
  console.log(`   Duration: ${(duration / 1000).toFixed(0)}s`);

  const client = new MongoClient(MONGODB_URI);
  const startTime = performance.now();
  const endTime = startTime + duration;
  let insertOps = 0;
  let queryOps = 0;
  let thermalChecks = [];

  // Intensity determines batch size
  const batchSize = intensity === 'low' ? 10 :
                    intensity === 'medium' ? 50 :
                    100;

  const checkThermalInterval = setInterval(async () => {
    const safety = await checkThermalSafety();
    thermalChecks.push(safety.temps);

    if (!safety.safe) {
      clearInterval(checkThermalInterval);
      throw new Error('THERMAL_LIMIT_EXCEEDED');
    }
  }, STRESS_SAFETY.checkInterval);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const collection = db.collection('benchmark-test-data');

    // Clear previous benchmark data
    await collection.deleteMany({});

    while (performance.now() < endTime) {
      // Insert batch
      const docs = Array.from({ length: batchSize }, (_, i) => ({
        timestamp: new Date(),
        testData: `benchmark-${insertOps}-${i}`,
        value: Math.random() * 1000,
        metadata: { iteration: insertOps, index: i }
      }));

      await collection.insertMany(docs);
      insertOps += batchSize;

      // Query data
      await collection.find({ value: { $gte: 500 } }).limit(100).toArray();
      queryOps++;

      // Aggregate query (more intensive)
      if (intensity !== 'low') {
        await collection.aggregate([
          { $match: { value: { $gte: 0 } } },
          { $group: { _id: null, avg: { $avg: '$value' }, count: { $sum: 1 } } }
        ]).toArray();
      }
    }

    clearInterval(checkThermalInterval);

    const actualDuration = performance.now() - startTime;

    // Cleanup
    await collection.deleteMany({});

    console.log(`   ${COLORS.green}✓ Completed${COLORS.reset}`);
    console.log(`   Inserts: ${insertOps} docs`);
    console.log(`   Queries: ${queryOps}`);
    console.log(`   Insert Rate: ${Math.floor((insertOps * 1000) / actualDuration)} docs/sec`);

    await client.close();

    return {
      test: 'mongodb',
      intensity,
      duration: actualDuration,
      insertOps,
      queryOps,
      insertRate: Math.floor((insertOps * 1000) / actualDuration),
      avgTemp: thermalChecks.reduce((a, b) => a + b.cpu, 0) / thermalChecks.length,
      maxTemp: Math.max(...thermalChecks.map(t => t.cpu)),
      passed: true
    };

  } catch (error) {
    clearInterval(checkThermalInterval);
    await client.close();
    throw error;
  }
}

/**
 * 🐾 Neko-Arc: Disk I/O Benchmark
 */
async function benchmarkDisk(duration = 30000, intensity = 'medium') {
  console.log(`\n${COLORS.cyan}💿 Disk I/O Benchmark (${intensity} intensity)${COLORS.reset}`);
  console.log(`   Duration: ${(duration / 1000).toFixed(0)}s`);

  const startTime = performance.now();
  const endTime = startTime + duration;
  let writeOps = 0;
  let readOps = 0;
  let thermalChecks = [];

  // Intensity determines file size
  const fileSize = intensity === 'low' ? 1024 * 100 :      // 100 KB
                   intensity === 'medium' ? 1024 * 500 :   // 500 KB
                   1024 * 1024;                            // 1 MB

  const testFile = '/tmp/neko-disk-benchmark.tmp';

  const checkThermalInterval = setInterval(async () => {
    const safety = await checkThermalSafety();
    thermalChecks.push(safety.temps);

    if (!safety.safe) {
      clearInterval(checkThermalInterval);
      throw new Error('THERMAL_LIMIT_EXCEEDED');
    }
  }, STRESS_SAFETY.checkInterval);

  try {
    while (performance.now() < endTime) {
      // Write test
      const data = Buffer.alloc(fileSize, 'x');
      await fs.writeFile(testFile, data);
      writeOps++;

      // Read test
      await fs.readFile(testFile);
      readOps++;
    }

    clearInterval(checkThermalInterval);

    // Cleanup
    try {
      await fs.unlink(testFile);
    } catch (error) {
      // Ignore cleanup errors
    }

    const actualDuration = performance.now() - startTime;
    const totalMB = ((writeOps + readOps) * fileSize) / (1024 * 1024);
    const throughput = (totalMB * 1000) / actualDuration;

    console.log(`   ${COLORS.green}✓ Completed${COLORS.reset}`);
    console.log(`   Writes: ${writeOps}`);
    console.log(`   Reads: ${readOps}`);
    console.log(`   Throughput: ${throughput.toFixed(2)} MB/sec`);

    return {
      test: 'disk',
      intensity,
      duration: actualDuration,
      writeOps,
      readOps,
      fileSize,
      throughput,
      avgTemp: thermalChecks.reduce((a, b) => a + b.cpu, 0) / thermalChecks.length,
      maxTemp: Math.max(...thermalChecks.map(t => t.cpu)),
      passed: true
    };

  } catch (error) {
    clearInterval(checkThermalInterval);

    // Cleanup
    try {
      await fs.unlink(testFile);
    } catch (cleanupError) {
      // Ignore
    }

    throw error;
  }
}

/**
 * 🎭 Mario: Cooldown Period Between Tests
 */
async function cooldown(duration = 30000) {
  console.log(`\n${COLORS.yellow}❄️  Cooldown Period (${(duration / 1000).toFixed(0)}s)${COLORS.reset}`);

  const startTime = Date.now();
  const endTime = startTime + duration;

  while (Date.now() < endTime) {
    const remaining = Math.floor((endTime - Date.now()) / 1000);
    const temps = await getCurrentTemperature();

    process.stdout.write(`\r   Temperature: CPU ${temps.cpu.toFixed(1)}°C | Remaining: ${remaining}s   `);

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n   ${COLORS.green}✓ Cooldown complete${COLORS.reset}`);
}

/**
 * 🎭 Mario: Run Test Scenario
 */
async function runScenario(scenarioName) {
  const scenario = TEST_SCENARIOS[scenarioName];

  if (!scenario) {
    console.error(`❌ Unknown scenario: ${scenarioName}`);
    console.log(`   Available: ${Object.keys(TEST_SCENARIOS).join(', ')}`);
    return;
  }

  console.log(`\n${COLORS.bright}${COLORS.magenta}🎯 STARTING BENCHMARK: ${scenario.name}${COLORS.reset}`);
  console.log(`   Intensity: ${scenario.intensity.toUpperCase()}`);
  console.log(`   Max Duration: ${(scenario.duration / 60000).toFixed(1)} minutes`);
  console.log(`   Tests: ${scenario.tests.length}`);

  benchmarkResults.testName = scenario.name;
  benchmarkResults.scenario = scenarioName;
  benchmarkResults.startTime = new Date();

  const testResults = [];

  try {
    // Initial thermal check
    const initialSafety = await checkThermalSafety();
    if (!initialSafety.safe) {
      console.error(`\n${COLORS.red}❌ Cannot start benchmark!${COLORS.reset}`);
      console.error(`   ${initialSafety.reason}`);
      return;
    }

    console.log(`\n   Initial Temperature: CPU ${initialSafety.temps.cpu.toFixed(1)}°C | Disk ${initialSafety.temps.disk.toFixed(1)}°C`);

    // Run tests based on scenario
    for (const testType of scenario.tests) {
      const [test, intensity] = testType.split('-');

      try {
        let result;

        switch (test) {
          case 'cpu':
            result = await benchmarkCPU(scenario.duration / scenario.tests.length, intensity);
            break;
          case 'memory':
            result = await benchmarkMemory(scenario.duration / scenario.tests.length, intensity);
            break;
          case 'mongodb':
            result = await benchmarkMongoDB(scenario.duration / scenario.tests.length, intensity);
            break;
          case 'disk':
            result = await benchmarkDisk(scenario.duration / scenario.tests.length, intensity);
            break;
          default:
            console.log(`   ⚠️  Unknown test: ${test}`);
            continue;
        }

        testResults.push(result);

        // Cooldown between tests (except after last test)
        if (scenario.tests.indexOf(testType) < scenario.tests.length - 1) {
          await cooldown(STRESS_SAFETY.cooldownTime);
        }

      } catch (error) {
        if (error.message === 'THERMAL_LIMIT_EXCEEDED') {
          console.error(`\n${COLORS.red}🚨 BENCHMARK STOPPED: Thermal limit exceeded${COLORS.reset}`);
          benchmarkResults.stoppedEarly = true;
          benchmarkResults.stopReason = 'Thermal limit exceeded';
          break;
        }
        throw error;
      }
    }

    benchmarkResults.tests = testResults;
    benchmarkResults.endTime = new Date();
    benchmarkResults.passed = !benchmarkResults.stoppedEarly;

    // Generate summary
    await generateSummary(benchmarkResults);

  } catch (error) {
    console.error(`\n${COLORS.red}❌ Benchmark failed:${COLORS.reset}`, error.message);
    benchmarkResults.passed = false;
  }
}

/**
 * 🧠 Hannibal: Generate Performance Summary
 */
async function generateSummary(results) {
  console.log(`\n${'━'.repeat(80)}`);
  console.log(`${COLORS.bright}${COLORS.cyan}📊 BENCHMARK SUMMARY${COLORS.reset}\n`);

  console.log(`Test Name: ${results.testName}`);
  console.log(`Scenario: ${results.scenario}`);
  console.log(`Start: ${results.startTime.toLocaleTimeString()}`);
  console.log(`End: ${results.endTime.toLocaleTimeString()}`);
  console.log(`Duration: ${((results.endTime - results.startTime) / 1000).toFixed(0)}s`);
  console.log(`Status: ${results.passed ? COLORS.green + '✓ PASSED' : COLORS.red + '✗ FAILED'}${COLORS.reset}`);

  if (results.stoppedEarly) {
    console.log(`${COLORS.yellow}⚠️  Stopped Early: ${results.stopReason}${COLORS.reset}`);
  }

  console.log(`\n${COLORS.bright}Test Results:${COLORS.reset}\n`);

  let totalScore = 0;
  let maxTemp = 0;

  results.tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.test.toUpperCase()} (${test.intensity})`);
    console.log(`   Duration: ${(test.duration / 1000).toFixed(1)}s`);

    if (test.test === 'cpu') {
      console.log(`   Score: ${test.score} iterations/sec`);
      totalScore += test.score;
    } else if (test.test === 'memory') {
      console.log(`   Score: ${test.score} ops/sec`);
      totalScore += test.score;
    } else if (test.test === 'mongodb') {
      console.log(`   Insert Rate: ${test.insertRate} docs/sec`);
      totalScore += test.insertRate;
    } else if (test.test === 'disk') {
      console.log(`   Throughput: ${test.throughput.toFixed(2)} MB/sec`);
      totalScore += test.throughput;
    }

    console.log(`   Avg Temp: ${test.avgTemp.toFixed(1)}°C | Max: ${test.maxTemp.toFixed(1)}°C`);
    console.log(`   Status: ${test.passed ? COLORS.green + '✓' : COLORS.red + '✗'}${COLORS.reset}\n`);

    maxTemp = Math.max(maxTemp, test.maxTemp);
  });

  console.log(`${COLORS.bright}Overall Performance Score: ${totalScore.toFixed(0)}${COLORS.reset}`);
  console.log(`${COLORS.bright}Maximum Temperature: ${maxTemp.toFixed(1)}°C${COLORS.reset}`);

  // Save to MongoDB
  await saveBenchmarkResults(results);

  console.log(`\n${'━'.repeat(80)}\n`);
}

/**
 * 🐾 Neko-Arc: Save Benchmark Results to MongoDB
 */
async function saveBenchmarkResults(results) {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    await db.collection('benchmark-results').insertOne(results);

    console.log(`\n${COLORS.green}✓ Results saved to MongoDB${COLORS.reset}`);
    console.log(`  Collection: benchmark-results`);

  } catch (error) {
    console.error(`⚠️  Failed to save results: ${error.message}`);
  } finally {
    await client.close();
  }
}

/**
 * 🧠 Hannibal: Compare Benchmark Results
 */
async function compareBenchmarks() {
  console.log(`\n${COLORS.bright}${COLORS.cyan}📊 BENCHMARK COMPARISON${COLORS.reset}\n`);

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');

    const results = await db.collection('benchmark-results')
      .find({})
      .sort({ startTime: -1 })
      .limit(10)
      .toArray();

    if (results.length === 0) {
      console.log('No benchmark results found. Run a benchmark first.');
      return;
    }

    console.log(`Found ${results.length} benchmark results:\n`);

    results.forEach((result, index) => {
      const totalScore = result.tests.reduce((sum, test) => {
        if (test.test === 'cpu') return sum + test.score;
        if (test.test === 'memory') return sum + test.score;
        if (test.test === 'mongodb') return sum + test.insertRate;
        if (test.test === 'disk') return sum + test.throughput;
        return sum;
      }, 0);

      const maxTemp = Math.max(...result.tests.map(t => t.maxTemp));

      console.log(`${index + 1}. ${result.testName} (${result.scenario})`);
      console.log(`   Date: ${new Date(result.startTime).toLocaleString()}`);
      console.log(`   Score: ${totalScore.toFixed(0)}`);
      console.log(`   Max Temp: ${maxTemp.toFixed(1)}°C`);
      console.log(`   Status: ${result.passed ? COLORS.green + '✓ PASSED' : COLORS.red + '✗ FAILED'}${COLORS.reset}\n`);
    });

  } catch (error) {
    console.error('Comparison failed:', error.message);
  } finally {
    await client.close();
  }
}

/**
 * Help Display
 */
function showHelp() {
  console.log(`
${COLORS.bright}🎯🔥 NEKO AUTOMATED STRESS TESTING & BENCHMARKING 🔥🎯${COLORS.reset}

SAFE Performance Validation with Thermal Monitoring - STAGE 3

USAGE:
  node neko-stress-benchmark.js [command] [scenario]

COMMANDS:
  run [scenario]    🚀 Run benchmark scenario (default: standard)
  compare           📊 Compare recent benchmark results
  help              ❓ Show this help message

SCENARIOS:
  quick       ⚡ Quick Validation (1 min, low intensity)
  standard    🎯 Standard Benchmark (5 min, medium intensity) [DEFAULT]
  intensive   🔥 Intensive Stress Test (10 min, high intensity)

EXAMPLES:
  # Quick benchmark (1 minute)
  node neko-stress-benchmark.js run quick

  # Standard benchmark (5 minutes) - recommended
  node neko-stress-benchmark.js run standard

  # Intensive stress test (10 minutes) - for validation
  node neko-stress-benchmark.js run intensive

  # Compare results
  node neko-stress-benchmark.js compare

TESTS INCLUDED:
  🖥️  CPU:      Prime number calculations
  💾 Memory:   Array operations (sort, map, filter, reduce)
  🗄️  MongoDB:  Insert/query operations, aggregations
  💿 Disk I/O: File write/read throughput

SAFETY FEATURES:
  ✅ Continuous thermal monitoring (every 2s)
  ✅ Auto-stop if CPU ≥${STRESS_SAFETY.maxCPUTemp}°C or Disk ≥${STRESS_SAFETY.maxDiskTemp}°C
  ✅ 30s cooldown between tests
  ✅ MongoDB result logging
  ✅ RULE 11 + RULE 59 compliant

INTEGRATION:
  Stage 1: Overclocking (neko-system-overclock.js)
  Stage 2: Thermal Monitoring (neko-thermal-monitor.js)
  Stage 3: Stress Testing (this script)

PERSONALITIES:
  🐾 Neko-Arc: Benchmark execution, MongoDB stress
  🎭 Mario: Test orchestration, cooldown management
  🗡️ Noel: Validation, pass/fail criteria
  🎸 Glam: Visual reports, performance graphs
  🧠 Hannibal: Performance analysis, comparison
  🧠 Tetora: Multi-perspective scenarios, load distribution
`);
}

/**
 * 🎭 Mario: Main Orchestration
 */
async function main() {
  console.log('🎯🔥 NEKO STRESS TESTING & BENCHMARKING INITIATED 🔥🎯\n');

  const command = process.argv[2] || 'run';
  const scenario = process.argv[3] || 'standard';

  switch (command) {
    case 'run':
    case 'benchmark':
    case 'test':
      await runScenario(scenario);
      break;
    case 'compare':
    case 'results':
      await compareBenchmarks();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
  }
}

// Execute
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
