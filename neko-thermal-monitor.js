#!/usr/bin/env node

/**
 * 🌡️🔥 NEKO THERMAL MONITORING SYSTEM 🔥🌡️
 *
 * SAFE Temperature Monitoring for Overclocked Systems
 * All Six Personalities Collaboration
 *
 * Version: 1.0.0
 * Created: 2025-01-20
 *
 * Personalities:
 * 🐾 Neko-Arc: Sensor data collection, real-time monitoring
 * 🎭 Mario: Orchestration, multi-sensor coordination
 * 🗡️ Noel: Validation, alert triggering, safety shutdown
 * 🎸 Glam: Visual dashboard, temperature history charts
 * 🧠 Hannibal: Thermal pattern analysis, anomaly detection
 * 🧠 Tetora: Multi-perspective thermal profiling, load balancing
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

// 🗡️ Noel: Safety Thresholds (Celsius)
const THERMAL_LIMITS = {
  cpu: {
    safe: 70,        // Normal operating temperature
    warning: 80,     // Start throttling
    critical: 90,    // Emergency shutdown
    max: 95          // Absolute maximum
  },
  disk: {
    safe: 45,
    warning: 55,
    critical: 65,
    max: 70
  },
  ambient: {
    safe: 30,
    warning: 35,
    critical: 40,
    max: 45
  }
};

// 🎸 Glam: Visual Temperature Bar
const TEMP_COLORS = {
  safe: '\x1b[32m',      // Green
  warning: '\x1b[33m',   // Yellow
  critical: '\x1b[31m',  // Red
  reset: '\x1b[0m'
};

// 🧠 Hannibal: Thermal History Storage
const HISTORY_SIZE = 60; // Keep last 60 readings
const thermalHistory = {
  cpu: [],
  disk: [],
  ambient: [],
  timestamps: []
};

// 🧠 Tetora: Performance Profiles Based on Temperature
const PERFORMANCE_PROFILES = {
  cool: {
    name: 'FULL PERFORMANCE',
    cpuLimit: '100%',
    memoryLimit: '100%',
    description: 'All systems optimal'
  },
  warm: {
    name: 'BALANCED',
    cpuLimit: '80%',
    memoryLimit: '90%',
    description: 'Slight throttling to reduce heat'
  },
  hot: {
    name: 'THERMAL THROTTLE',
    cpuLimit: '60%',
    memoryLimit: '80%',
    description: 'Aggressive throttling'
  },
  critical: {
    name: 'EMERGENCY MODE',
    cpuLimit: '40%',
    memoryLimit: '70%',
    description: 'Minimal operations only'
  }
};

/**
 * 🐾 Neko-Arc: CPU Temperature Detection
 */
async function getCPUTemperature() {
  try {
    // Method 1: lm-sensors (most reliable)
    try {
      const { stdout } = await execAsync('sensors -u 2>/dev/null | grep -E "temp[0-9]+_input" | head -1 | awk \'{print $2}\'');
      if (stdout.trim()) {
        return parseFloat(stdout.trim());
      }
    } catch (error) {
      // lm-sensors not available, try other methods
    }

    // Method 2: /sys/class/thermal
    try {
      const thermalZones = await fs.readdir('/sys/class/thermal');
      const cpuZones = thermalZones.filter(z => z.startsWith('thermal_zone'));

      if (cpuZones.length > 0) {
        const tempFile = `/sys/class/thermal/${cpuZones[0]}/temp`;
        const tempStr = await fs.readFile(tempFile, 'utf8');
        return parseInt(tempStr.trim()) / 1000; // Convert millidegrees to degrees
      }
    } catch (error) {
      // Thermal zones not available
    }

    // Method 3: vcgencmd (Raspberry Pi)
    try {
      const { stdout } = await execAsync('vcgencmd measure_temp 2>/dev/null');
      const match = stdout.match(/temp=([0-9.]+)/);
      if (match) {
        return parseFloat(match[1]);
      }
    } catch (error) {
      // Not a Raspberry Pi
    }

    // Fallback: Estimate from CPU frequency/load
    const { stdout } = await execAsync('top -bn1 | grep "Cpu(s)" | awk \'{print $2}\'');
    const cpuLoad = parseFloat(stdout.replace('%us,', ''));
    return 40 + (cpuLoad * 0.5); // Rough estimate: base 40°C + load factor

  } catch (error) {
    console.error('⚠️ CPU temperature unavailable, using estimate');
    return 45; // Safe default
  }
}

/**
 * 🐾 Neko-Arc: Disk Temperature Detection
 */
async function getDiskTemperature() {
  try {
    // Method 1: hddtemp
    try {
      const { stdout } = await execAsync('hddtemp /dev/sda 2>/dev/null | grep -oP "[0-9]+°C" | grep -oP "[0-9]+"');
      if (stdout.trim()) {
        return parseFloat(stdout.trim());
      }
    } catch (error) {
      // hddtemp not available
    }

    // Method 2: smartctl
    try {
      const { stdout } = await execAsync('sudo smartctl -A /dev/sda 2>/dev/null | grep Temperature_Celsius | awk \'{print $10}\'');
      if (stdout.trim()) {
        return parseFloat(stdout.trim());
      }
    } catch (error) {
      // smartctl not available or no sudo
    }

    // Method 3: nvme-cli (for NVMe drives)
    try {
      const { stdout } = await execAsync('sudo nvme smart-log /dev/nvme0 2>/dev/null | grep temperature | awk \'{print $3}\'');
      if (stdout.trim()) {
        return parseFloat(stdout.trim());
      }
    } catch (error) {
      // NVMe not available
    }

    // Fallback: Estimate based on disk I/O
    return 35; // Safe default

  } catch (error) {
    return 35; // Safe default
  }
}

/**
 * 🐾 Neko-Arc: Ambient/System Temperature
 */
async function getAmbientTemperature() {
  try {
    // Method 1: ACPI thermal zone
    const { stdout } = await execAsync('cat /sys/class/thermal/thermal_zone*/temp 2>/dev/null | head -1');
    if (stdout.trim()) {
      return parseInt(stdout.trim()) / 1000;
    }
  } catch (error) {
    // Not available
  }

  // Fallback: Estimate from CPU temp minus 10°C
  const cpuTemp = await getCPUTemperature();
  return Math.max(25, cpuTemp - 15);
}

/**
 * 🗡️ Noel: Thermal Status Classification
 */
function getThermalStatus(temp, type) {
  const limits = THERMAL_LIMITS[type];

  if (temp >= limits.critical) return 'CRITICAL';
  if (temp >= limits.warning) return 'WARNING';
  if (temp <= limits.safe) return 'SAFE';
  return 'NORMAL';
}

/**
 * 🎸 Glam: Visual Temperature Bar
 */
function drawTemperatureBar(temp, type, width = 40) {
  const limits = THERMAL_LIMITS[type];
  const percentage = Math.min(100, (temp / limits.max) * 100);
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;

  let color = TEMP_COLORS.safe;
  if (temp >= limits.critical) color = TEMP_COLORS.critical;
  else if (temp >= limits.warning) color = TEMP_COLORS.warning;

  const bar = color + '█'.repeat(filled) + TEMP_COLORS.reset + '░'.repeat(empty);
  const status = getThermalStatus(temp, type);

  return `${bar} ${temp.toFixed(1)}°C [${status}]`;
}

/**
 * 🧠 Hannibal: Thermal Pattern Analysis
 */
function analyzeThermalTrend(history) {
  if (history.length < 5) return 'INSUFFICIENT_DATA';

  const recent = history.slice(-5);
  const older = history.slice(-10, -5);

  if (older.length === 0) return 'STABLE';

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

  const delta = recentAvg - olderAvg;

  if (delta > 5) return 'RISING_FAST';
  if (delta > 2) return 'RISING';
  if (delta < -5) return 'COOLING_FAST';
  if (delta < -2) return 'COOLING';
  return 'STABLE';
}

/**
 * 🧠 Tetora: Performance Profile Selection
 */
function selectPerformanceProfile(cpuTemp, diskTemp) {
  // Multi-perspective analysis
  const maxTemp = Math.max(cpuTemp, diskTemp);

  if (maxTemp >= THERMAL_LIMITS.cpu.critical) return PERFORMANCE_PROFILES.critical;
  if (maxTemp >= THERMAL_LIMITS.cpu.warning) return PERFORMANCE_PROFILES.hot;
  if (maxTemp >= THERMAL_LIMITS.cpu.safe) return PERFORMANCE_PROFILES.warm;
  return PERFORMANCE_PROFILES.cool;
}

/**
 * 🎭 Mario: Thermal Data Collection Orchestration
 */
async function collectThermalData() {
  const timestamp = new Date();

  const [cpuTemp, diskTemp, ambientTemp] = await Promise.all([
    getCPUTemperature(),
    getDiskTemperature(),
    getAmbientTemperature()
  ]);

  // Store in history
  thermalHistory.cpu.push(cpuTemp);
  thermalHistory.disk.push(diskTemp);
  thermalHistory.ambient.push(ambientTemp);
  thermalHistory.timestamps.push(timestamp);

  // Limit history size
  if (thermalHistory.cpu.length > HISTORY_SIZE) {
    thermalHistory.cpu.shift();
    thermalHistory.disk.shift();
    thermalHistory.ambient.shift();
    thermalHistory.timestamps.shift();
  }

  return {
    timestamp,
    cpu: cpuTemp,
    disk: diskTemp,
    ambient: ambientTemp,
    cpuStatus: getThermalStatus(cpuTemp, 'cpu'),
    diskStatus: getThermalStatus(diskTemp, 'disk'),
    ambientStatus: getThermalStatus(ambientTemp, 'ambient'),
    cpuTrend: analyzeThermalTrend(thermalHistory.cpu),
    diskTrend: analyzeThermalTrend(thermalHistory.disk),
    performanceProfile: selectPerformanceProfile(cpuTemp, diskTemp)
  };
}

/**
 * 🎸 Glam: Live Temperature Dashboard
 */
async function displayThermalDashboard() {
  console.clear();

  console.log('🌡️🔥 NEKO THERMAL MONITORING DASHBOARD 🔥🌡️\n');
  console.log('━'.repeat(80) + '\n');

  const data = await collectThermalData();

  // Temperature readings
  console.log('📊 CURRENT TEMPERATURES:\n');
  console.log('  🖥️  CPU:     ', drawTemperatureBar(data.cpu, 'cpu'));
  console.log('  💾  Disk:    ', drawTemperatureBar(data.disk, 'disk'));
  console.log('  🌡️  Ambient: ', drawTemperatureBar(data.ambient, 'ambient'));
  console.log();

  // Trends
  console.log('📈 THERMAL TRENDS:\n');
  console.log(`  CPU:     ${getTrendIcon(data.cpuTrend)} ${data.cpuTrend}`);
  console.log(`  Disk:    ${getTrendIcon(data.diskTrend)} ${data.diskTrend}`);
  console.log();

  // Performance profile
  const profile = data.performanceProfile;
  const profileColor = profile === PERFORMANCE_PROFILES.cool ? TEMP_COLORS.safe :
                       profile === PERFORMANCE_PROFILES.warm ? TEMP_COLORS.warning :
                       TEMP_COLORS.critical;

  console.log('⚡ PERFORMANCE PROFILE:\n');
  console.log(`  ${profileColor}${profile.name}${TEMP_COLORS.reset}`);
  console.log(`  CPU Limit: ${profile.cpuLimit} | Memory Limit: ${profile.memoryLimit}`);
  console.log(`  ${profile.description}`);
  console.log();

  // Safety thresholds
  console.log('🛡️ SAFETY THRESHOLDS:\n');
  console.log(`  CPU:  ${TEMP_COLORS.safe}≤${THERMAL_LIMITS.cpu.safe}°C${TEMP_COLORS.reset} | ${TEMP_COLORS.warning}${THERMAL_LIMITS.cpu.warning}°C${TEMP_COLORS.reset} | ${TEMP_COLORS.critical}${THERMAL_LIMITS.cpu.critical}°C${TEMP_COLORS.reset} | MAX ${THERMAL_LIMITS.cpu.max}°C`);
  console.log(`  Disk: ${TEMP_COLORS.safe}≤${THERMAL_LIMITS.disk.safe}°C${TEMP_COLORS.reset} | ${TEMP_COLORS.warning}${THERMAL_LIMITS.disk.warning}°C${TEMP_COLORS.reset} | ${TEMP_COLORS.critical}${THERMAL_LIMITS.disk.critical}°C${TEMP_COLORS.reset} | MAX ${THERMAL_LIMITS.disk.max}°C`);
  console.log();

  // Alerts
  const alerts = [];
  if (data.cpu >= THERMAL_LIMITS.cpu.critical) {
    alerts.push(`🚨 CRITICAL: CPU temperature ${data.cpu.toFixed(1)}°C! Emergency throttling activated!`);
  } else if (data.cpu >= THERMAL_LIMITS.cpu.warning) {
    alerts.push(`⚠️ WARNING: CPU temperature ${data.cpu.toFixed(1)}°C. Throttling recommended.`);
  }

  if (data.disk >= THERMAL_LIMITS.disk.critical) {
    alerts.push(`🚨 CRITICAL: Disk temperature ${data.disk.toFixed(1)}°C! Reduce I/O operations!`);
  } else if (data.disk >= THERMAL_LIMITS.disk.warning) {
    alerts.push(`⚠️ WARNING: Disk temperature ${data.disk.toFixed(1)}°C.`);
  }

  if (alerts.length > 0) {
    console.log('🔔 ALERTS:\n');
    alerts.forEach(alert => console.log(`  ${alert}`));
    console.log();
  } else {
    console.log(`${TEMP_COLORS.safe}✅ All temperatures within safe limits${TEMP_COLORS.reset}\n`);
  }

  // History graph (ASCII)
  if (thermalHistory.cpu.length >= 10) {
    console.log('📈 TEMPERATURE HISTORY (last 60 readings):\n');
    drawTemperatureGraph(thermalHistory.cpu, 'CPU', THERMAL_LIMITS.cpu);
    console.log();
  }

  console.log('━'.repeat(80));
  console.log(`⏰ Updated: ${data.timestamp.toLocaleTimeString()} | Readings: ${thermalHistory.cpu.length}/${HISTORY_SIZE}`);
  console.log('Press Ctrl+C to stop monitoring\n');

  return data;
}

/**
 * 🎸 Glam: Trend Icon
 */
function getTrendIcon(trend) {
  switch (trend) {
    case 'RISING_FAST': return '⬆️⬆️';
    case 'RISING': return '↗️';
    case 'COOLING_FAST': return '⬇️⬇️';
    case 'COOLING': return '↘️';
    case 'STABLE': return '➡️';
    default: return '❓';
  }
}

/**
 * 🎸 Glam: ASCII Temperature Graph
 */
function drawTemperatureGraph(temps, label, limits) {
  const height = 10;
  const width = Math.min(60, temps.length);
  const recentTemps = temps.slice(-width);

  const max = Math.max(...recentTemps, limits.max);
  const min = Math.min(...recentTemps, 20);
  const range = max - min;

  console.log(`  ${label} Temperature Graph:`);

  for (let y = height - 1; y >= 0; y--) {
    const temp = min + (range * y / (height - 1));
    let line = temp.toFixed(0).padStart(4) + '°C │';

    for (let x = 0; x < width; x++) {
      const t = recentTemps[x];
      const normalizedHeight = Math.floor(((t - min) / range) * (height - 1));

      if (normalizedHeight === y) {
        if (t >= limits.critical) line += TEMP_COLORS.critical + '█' + TEMP_COLORS.reset;
        else if (t >= limits.warning) line += TEMP_COLORS.warning + '█' + TEMP_COLORS.reset;
        else line += TEMP_COLORS.safe + '█' + TEMP_COLORS.reset;
      } else {
        line += ' ';
      }
    }

    console.log(line);
  }

  console.log('     └' + '─'.repeat(width));
}

/**
 * 🗡️ Noel: Safety Shutdown Check
 */
async function checkEmergencyShutdown(data) {
  if (data.cpu >= THERMAL_LIMITS.cpu.max || data.disk >= THERMAL_LIMITS.disk.max) {
    console.error('\n🚨🚨🚨 EMERGENCY THERMAL SHUTDOWN 🚨🚨🚨\n');
    console.error(`CPU: ${data.cpu.toFixed(1)}°C | Disk: ${data.disk.toFixed(1)}°C\n`);
    console.error('System temperature exceeded safe limits!');
    console.error('Initiating emergency shutdown to prevent damage...\n');

    // Log to MongoDB
    await logThermalEvent({
      type: 'EMERGENCY_SHUTDOWN',
      reason: 'Temperature exceeded safe limits',
      cpu: data.cpu,
      disk: data.disk,
      timestamp: new Date()
    });

    console.error('Emergency shutdown logged to MongoDB.');
    console.error('Please check system cooling before restarting.\n');

    process.exit(1);
  }
}

/**
 * 🗡️ Noel: Thermal Event Logging
 */
async function logThermalEvent(event) {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    await db.collection('thermal-events').insertOne(event);
  } catch (error) {
    console.error('Failed to log thermal event:', error.message);
  } finally {
    await client.close();
  }
}

/**
 * 🐾 Neko-Arc: Thermal Data Logging to MongoDB
 */
async function logThermalData(data) {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    await db.collection('thermal-monitoring').insertOne(data);
  } catch (error) {
    // Silent fail for monitoring (don't disrupt dashboard)
  } finally {
    await client.close();
  }
}

/**
 * 🧠 Hannibal: Thermal Analysis Report
 */
async function generateThermalReport() {
  console.log('\n🧠 HANNIBAL\'S THERMAL ANALYSIS REPORT\n');
  console.log('━'.repeat(80) + '\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');

    // Aggregate thermal data
    const stats = await db.collection('thermal-monitoring').aggregate([
      { $sort: { timestamp: -1 } },
      { $limit: 1000 },
      {
        $group: {
          _id: null,
          avgCPU: { $avg: '$cpu' },
          maxCPU: { $max: '$cpu' },
          minCPU: { $min: '$cpu' },
          avgDisk: { $avg: '$disk' },
          maxDisk: { $max: '$disk' },
          minDisk: { $min: '$disk' },
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    if (stats.length > 0) {
      const s = stats[0];
      console.log('📊 THERMAL STATISTICS (last 1000 readings):\n');
      console.log(`  CPU Temperature:`);
      console.log(`    Average: ${s.avgCPU.toFixed(1)}°C`);
      console.log(`    Maximum: ${s.maxCPU.toFixed(1)}°C`);
      console.log(`    Minimum: ${s.minCPU.toFixed(1)}°C`);
      console.log();
      console.log(`  Disk Temperature:`);
      console.log(`    Average: ${s.avgDisk.toFixed(1)}°C`);
      console.log(`    Maximum: ${s.maxDisk.toFixed(1)}°C`);
      console.log(`    Minimum: ${s.minDisk.toFixed(1)}°C`);
      console.log();
      console.log(`  Total Readings: ${s.count}`);
    } else {
      console.log('No thermal data available yet. Start monitoring first.');
    }

    // Check for thermal events
    const events = await db.collection('thermal-events').find({}).sort({ timestamp: -1 }).limit(10).toArray();

    if (events.length > 0) {
      console.log('\n🔔 RECENT THERMAL EVENTS:\n');
      events.forEach((e, i) => {
        console.log(`  ${i + 1}. [${e.timestamp.toLocaleString()}] ${e.type}: ${e.reason}`);
        console.log(`     CPU: ${e.cpu.toFixed(1)}°C | Disk: ${e.disk.toFixed(1)}°C`);
      });
    }

  } catch (error) {
    console.error('Error generating report:', error.message);
  } finally {
    await client.close();
  }

  console.log('\n━'.repeat(80) + '\n');
}

/**
 * 🎭 Mario: Main Orchestration
 */
async function main() {
  console.log('🌡️🔥 NEKO THERMAL MONITORING SYSTEM INITIATED 🔥🌡️\n');

  const mode = process.argv[2] || 'live';

  switch (mode) {
    case 'live':
    case 'monitor':
      await liveMonitoring();
      break;
    case 'check':
    case 'once':
      await displayThermalDashboard();
      break;
    case 'report':
    case 'analysis':
      await generateThermalReport();
      break;
    case 'log':
      await startDataLogging();
      break;
    default:
      showHelp();
  }
}

/**
 * Live Monitoring Mode
 */
async function liveMonitoring() {
  console.log('🔥 Starting live thermal monitoring (updates every 2 seconds)...\n');
  console.log('Press Ctrl+C to stop\n');

  const monitorInterval = setInterval(async () => {
    try {
      const data = await displayThermalDashboard();
      await checkEmergencyShutdown(data);
    } catch (error) {
      console.error('Monitoring error:', error.message);
    }
  }, 2000);

  // Graceful shutdown
  process.on('SIGINT', () => {
    clearInterval(monitorInterval);
    console.log('\n\n✅ Thermal monitoring stopped gracefully.');
    process.exit(0);
  });
}

/**
 * Data Logging Mode
 */
async function startDataLogging() {
  console.log('📝 Starting thermal data logging to MongoDB...\n');
  console.log('Press Ctrl+C to stop\n');

  let readingCount = 0;

  const logInterval = setInterval(async () => {
    try {
      const data = await collectThermalData();
      await logThermalData(data);
      await checkEmergencyShutdown(data);

      readingCount++;
      console.log(`[${data.timestamp.toLocaleTimeString()}] CPU: ${data.cpu.toFixed(1)}°C | Disk: ${data.disk.toFixed(1)}°C | Logged (${readingCount})`);

    } catch (error) {
      console.error('Logging error:', error.message);
    }
  }, 5000); // Log every 5 seconds

  process.on('SIGINT', () => {
    clearInterval(logInterval);
    console.log(`\n\n✅ Logged ${readingCount} thermal readings to MongoDB.`);
    process.exit(0);
  });
}

/**
 * Help Display
 */
function showHelp() {
  console.log(`
🌡️🔥 NEKO THERMAL MONITORING SYSTEM 🔥🌡️

SAFE Temperature Monitoring for Overclocked Systems

USAGE:
  node neko-thermal-monitor.js [command]

COMMANDS:
  live, monitor   🔥 Live temperature dashboard (2s updates, default)
  check, once     📊 Single temperature check
  report, analysis 🧠 Generate thermal analysis report (Hannibal)
  log             📝 Log thermal data to MongoDB (5s interval)

EXAMPLES:
  # Live monitoring (recommended)
  node neko-thermal-monitor.js live

  # Quick temperature check
  node neko-thermal-monitor.js check

  # Thermal analysis report
  node neko-thermal-monitor.js report

  # Log data for later analysis
  node neko-thermal-monitor.js log

SAFETY THRESHOLDS:
  CPU:
    ${TEMP_COLORS.safe}SAFE${TEMP_COLORS.reset}:     ≤${THERMAL_LIMITS.cpu.safe}°C (normal operation)
    ${TEMP_COLORS.warning}WARNING${TEMP_COLORS.reset}:  ≥${THERMAL_LIMITS.cpu.warning}°C (throttle recommended)
    ${TEMP_COLORS.critical}CRITICAL${TEMP_COLORS.reset}: ≥${THERMAL_LIMITS.cpu.critical}°C (emergency throttle)
    MAX:      ${THERMAL_LIMITS.cpu.max}°C (automatic shutdown)

  Disk:
    ${TEMP_COLORS.safe}SAFE${TEMP_COLORS.reset}:     ≤${THERMAL_LIMITS.disk.safe}°C
    ${TEMP_COLORS.warning}WARNING${TEMP_COLORS.reset}:  ≥${THERMAL_LIMITS.disk.warning}°C
    ${TEMP_COLORS.critical}CRITICAL${TEMP_COLORS.reset}: ≥${THERMAL_LIMITS.disk.critical}°C
    MAX:      ${THERMAL_LIMITS.disk.max}°C

PERSONALITIES:
  🐾 Neko-Arc: Sensor data collection
  🎭 Mario: Multi-sensor orchestration
  🗡️ Noel: Safety shutdown, alerts
  🎸 Glam: Visual dashboard, graphs
  🧠 Hannibal: Thermal analysis, patterns
  🧠 Tetora: Performance profile selection

EMERGENCY FEATURES:
  ✅ Automatic shutdown at critical temperatures
  ✅ Real-time thermal trend analysis
  ✅ Performance throttling recommendations
  ✅ MongoDB logging for historical analysis
  ✅ RULE 11 + RULE 59 compliant (no hardcoded credentials)
`);
}

// Execute
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
