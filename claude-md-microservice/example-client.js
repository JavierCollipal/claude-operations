#!/usr/bin/env node

/**
 * 🐾✨ CLAUDE.md Microservice Client Example ✨🐾
 *
 * Demonstrates how to interact with the CLAUDE.md API
 */

const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 3000;

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to make API requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Demo functions
async function demoServiceInfo() {
  console.log(`${colors.cyan}🔍 Fetching Service Info...${colors.reset}`);
  const info = await makeRequest('GET', '/');
  console.log(`${colors.green}Service: ${info.service}`);
  console.log(`Version: ${info.version}`);
  console.log(`Status: ${info.status}`);
  console.log(`Rules: ${info.rules}`);
  console.log(`Personalities: ${info.personalities}${colors.reset}\n`);
}

async function demoPersonalities() {
  console.log(`${colors.cyan}🎭 Getting All Personalities...${colors.reset}`);
  const personalities = await makeRequest('GET', '/api/personalities');

  for (const [key, personality] of Object.entries(personalities.data)) {
    console.log(`${colors.yellow}${personality.emoji} ${personality.name}${colors.reset}`);
    console.log(`  Role: ${personality.role}`);
    console.log(`  Database: ${personality.database}`);

    // Get a response from this personality
    const response = await makeRequest('GET', `/api/personality/${key}/response`);
    console.log(`  Says: ${response.response}\n`);
  }
}

async function demoValidation() {
  console.log(`${colors.cyan}📋 Testing Rule Validation...${colors.reset}\n`);

  // Test valid case
  console.log(`${colors.yellow}Test 1: Valid project path${colors.reset}`);
  const validResult = await makeRequest('POST', '/api/validate', {
    repoPath: '/home/wakibaka/Documents/github/my-project',
    scriptPath: '/home/wakibaka/Documents/github/claude-operations/script.js'
  });
  console.log(`Result: ${validResult.valid ? '✅ VALID' : '❌ INVALID'}`);
  console.log(`Summary: ${validResult.summary}\n`);

  // Test invalid case
  console.log(`${colors.yellow}Test 2: Invalid paths and hardcoded credentials${colors.reset}`);
  const invalidResult = await makeRequest('POST', '/api/validate', {
    repoPath: '/wrong/path',
    code: 'const uri = "mongodb+srv://user:pass@cluster.mongodb.net"',
    scriptPath: '/home/user/script.js'
  });
  console.log(`Result: ${invalidResult.valid ? '✅ VALID' : '❌ INVALID'}`);
  console.log(`Violations found: ${invalidResult.violations.length}`);
  invalidResult.violations.forEach(v => {
    console.log(`  - Rule ${v.rule}: ${v.message} (${v.severity})`);
  });
  console.log();
}

async function demoCollaboration() {
  console.log(`${colors.cyan}🤝 Six Personalities Collaboration...${colors.reset}\n`);

  const collaboration = await makeRequest('POST', '/api/collaborate', {
    task: 'Build a new authentication system',
    context: 'Security implementation'
  });

  console.log(`${colors.green}Collaboration ID: ${collaboration.collaborationId}${colors.reset}`);
  console.log(`Task: ${collaboration.task}\n`);

  console.log(`${colors.yellow}Personality Responses:${colors.reset}`);
  collaboration.responses.forEach(r => {
    console.log(`${r.emoji} ${r.personality}:`);
    console.log(`  ${r.response}`);
    console.log(`  ${colors.bright}${r.contribution}${colors.reset}`);
  });

  console.log(`\n${colors.yellow}Workflow:${colors.reset}`);
  collaboration.workflow.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });
  console.log();
}

async function demoProjectAnalysis() {
  console.log(`${colors.cyan}🔎 Analyzing Project Compliance...${colors.reset}\n`);

  const analysis = await makeRequest('POST', '/api/analyze-project', {
    projectName: 'awesome-project',
    projectPath: '/home/wakibaka/Documents/github/awesome-project',
    files: ['.env', '.gitignore', 'README.md', 'package.json']
  });

  console.log(`${colors.green}Project: ${analysis.analysis.projectName}${colors.reset}`);
  console.log(`Path: ${analysis.analysis.projectPath}\n`);

  console.log(`${colors.yellow}Compliance Checks:${colors.reset}`);
  for (const [check, result] of Object.entries(analysis.analysis.checks)) {
    const status = result ? '✅' : '❌';
    console.log(`  ${status} ${check}: ${result}`);
  }

  if (analysis.analysis.recommendations.length > 0) {
    console.log(`\n${colors.yellow}Recommendations:${colors.reset}`);
    analysis.analysis.recommendations.forEach(rec => {
      console.log(`  • ${rec}`);
    });
  }

  console.log(`\n${colors.yellow}Personality Opinions:${colors.reset}`);
  analysis.analysis.personalityOpinions.forEach(op => {
    console.log(`  ${op.opinion}`);
  });
  console.log();
}

async function demoWebhook() {
  console.log(`${colors.cyan}🔔 Testing Webhook Enforcement...${colors.reset}\n`);

  const enforcement = await makeRequest('POST', '/api/webhook/enforce', {
    event: 'repository.created',
    repository: 'test-repo',
    action: 'created',
    data: { private: false }
  });

  console.log(`Event: ${enforcement.enforcement.event}`);
  console.log(`Repository: ${enforcement.enforcement.repository}`);
  console.log(`Violated: ${enforcement.violated ? '❌ YES' : '✅ NO'}\n`);

  if (enforcement.enforcement.enforcements.length > 0) {
    console.log(`${colors.red}Enforcements Required:${colors.reset}`);
    enforcement.enforcement.enforcements.forEach(e => {
      console.log(`  Rule ${e.rule}: ${e.message}`);
      console.log(`  Action: ${e.action}`);
      console.log(`  Command: ${e.command || e.suggestion}`);
    });
  }
  console.log();
}

async function demoStats() {
  console.log(`${colors.cyan}📊 System Statistics...${colors.reset}\n`);

  const stats = await makeRequest('GET', '/api/stats');

  console.log(`${colors.green}CLAUDE.md System Stats:${colors.reset}`);
  console.log(`  Total Rules: ${stats.stats.totalRules}`);
  console.log(`  Immutable Rules: ${stats.stats.immutableRules}`);
  console.log(`  Personalities: ${stats.stats.personalities}`);
  console.log(`  Version: ${stats.stats.version}\n`);

  console.log(`${colors.yellow}Critical Paths:${colors.reset}`);
  stats.stats.criticalPaths.forEach(path => {
    console.log(`  📁 ${path}`);
  });

  console.log(`\n${colors.yellow}Personality Databases:${colors.reset}`);
  stats.stats.databases.forEach(db => {
    console.log(`  🗄️ ${db}`);
  });
  console.log();
}

// Interactive menu
async function showMenu() {
  console.log(`\n${colors.magenta}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}🐾 CLAUDE.md Microservice Demo Menu 🐾${colors.reset}`);
  console.log(`${colors.magenta}═══════════════════════════════════════${colors.reset}\n`);

  console.log('Choose a demo:');
  console.log('1. Service Info');
  console.log('2. Six Personalities');
  console.log('3. Rule Validation');
  console.log('4. Collaboration Mode');
  console.log('5. Project Analysis');
  console.log('6. Webhook Enforcement');
  console.log('7. System Statistics');
  console.log('8. Run All Demos');
  console.log('0. Exit\n');
}

// Main execution
async function main() {
  console.clear();
  console.log(`${colors.bright}${colors.cyan}🐾✨ CLAUDE.md Microservice Client ✨🐾${colors.reset}\n`);

  // Check if server is running
  try {
    await makeRequest('GET', '/health');
    console.log(`${colors.green}✅ Server is running!${colors.reset}\n`);
  } catch (error) {
    console.log(`${colors.red}❌ Server is not running!${colors.reset}`);
    console.log('Please start the server with: npm start\n');
    process.exit(1);
  }

  // Run specific demo if provided as argument
  const demoArg = process.argv[2];

  if (demoArg === 'all' || demoArg === '8') {
    console.log(`${colors.bright}Running all demos...${colors.reset}\n`);
    await demoServiceInfo();
    await demoPersonalities();
    await demoValidation();
    await demoCollaboration();
    await demoProjectAnalysis();
    await demoWebhook();
    await demoStats();
  } else if (demoArg) {
    const demos = {
      '1': demoServiceInfo,
      '2': demoPersonalities,
      '3': demoValidation,
      '4': demoCollaboration,
      '5': demoProjectAnalysis,
      '6': demoWebhook,
      '7': demoStats
    };

    const demo = demos[demoArg];
    if (demo) {
      await demo();
    } else {
      console.log('Invalid demo number. Use 1-8.');
    }
  } else {
    // Show interactive menu
    await showMenu();
    console.log('Run with argument 1-8 to execute specific demo.');
    console.log('Example: node example-client.js 3');
  }

  console.log(`\n${colors.green}Nyaa~! Demo complete, desu~! 🐾${colors.reset}\n`);
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
});

// Run main
main().catch(console.error);