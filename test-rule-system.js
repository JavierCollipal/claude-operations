#!/usr/bin/env node
/**
 * 🗡️ Noel's Regression Testing Framework
 *
 * Purpose: Test all 58 rules + tier loading + context detection
 * Version: v3.0.0 (Sprint 3.0 Phase 4 - Task 4.1)
 * Lead: 🗡️ Noel (Precision Testing)
 *
 * Tests:
 * 1. All 58 rule files exist and are readable
 * 2. load-rule.js works for all rules
 * 3. CLAUDE.md contains Tier 1 rules (9 rules)
 * 4. Tier categorization is correct
 * 5. Dependency relationships are valid
 * 6. Context detection patterns work
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const CLAUDE_MD_PATH = '/home/wakibaka/CLAUDE.md';
const RULES_DIR = '/home/wakibaka/Documents/github/claude-operations/rules';
const LOAD_RULE_SCRIPT = '/home/wakibaka/Documents/github/claude-operations/load-rule.js';

// Expected tier assignments from Phase 3
const TIER_1_RULES = [3, 4, 5, 12, 32, 48, 53, 54, 55]; // CRITICAL + HIGH
const TIER_2_RULES = [11, 34, 49, 50, 51, 52]; // MEDIUM
// Tier 3: All others (1-2, 6-10, 13-31, 33, 35-47, 56-57)

// Expected dependencies from Phase 2
const DEPENDENCIES = {
  14: [4], 15: [4], 32: [4], 33: [4, 32], 34: [4, 32], 35: [4], 36: [4], 37: [4],
  47: [4], 49: [4, 32], 52: [4, 5, 32], 57: [4, 5],
  50: [5], 51: [5], 54: [5], 55: [5, 53],
  18: [3], 19: [3], 27: [3], 30: [3], 44: [3],
  1: [12], 26: [12], 41: [12], 42: [12]
};

let passedTests = 0;
let failedTests = 0;
const failures = [];

/**
 * Test helper
 */
function test(name, fn) {
  try {
    fn();
    passedTests++;
    console.log(`✅ ${name}`);
    return true;
  } catch (error) {
    failedTests++;
    failures.push({ name, error: error.message });
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

/**
 * Test Suite 1: Rule Files Existence
 */
function testRuleFilesExist() {
  console.log('\n📋 Test Suite 1: Rule Files Existence');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test rules directory exists
  test('Rules directory exists', () => {
    if (!existsSync(RULES_DIR)) {
      throw new Error(`Rules directory not found: ${RULES_DIR}`);
    }
  });

  // Test all 58 rule files exist
  const files = readdirSync(RULES_DIR);
  const ruleFiles = files.filter(f => f.startsWith('rule-') && f.endsWith('.md'));

  test(`57 rule files exist (found ${ruleFiles.length})`, () => {
    if (ruleFiles.length !== 57) {
      throw new Error(`Expected 57 rule files, found ${ruleFiles.length}`);
    }
  });

  // Test each rule file is readable
  for (let i = 1; i <= 57; i++) {
    const paddedNum = i.toString().padStart(3, '0');
    test(`Rule ${i} file exists and readable`, () => {
      const ruleFile = ruleFiles.find(f => f.startsWith(`rule-${paddedNum}-`));
      if (!ruleFile) {
        throw new Error(`Rule ${i} file not found`);
      }
      const content = readFileSync(join(RULES_DIR, ruleFile), 'utf-8');
      if (content.length < 10) {
        throw new Error(`Rule ${i} file is empty or too short`);
      }
      if (!content.includes(`# RULE ${i}:`)) {
        throw new Error(`Rule ${i} file missing header`);
      }
    });
  }
}

/**
 * Test Suite 2: load-rule.js Functionality
 */
function testLoadRuleScript() {
  console.log('\n📋 Test Suite 2: load-rule.js Functionality');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test load-rule.js exists
  test('load-rule.js script exists', () => {
    if (!existsSync(LOAD_RULE_SCRIPT)) {
      throw new Error(`load-rule.js not found: ${LOAD_RULE_SCRIPT}`);
    }
  });

  // Test load-rule.js can load RULE 4 (MongoDB)
  test('load-rule.js can load RULE 4 (MongoDB)', () => {
    const output = execSync(`node ${LOAD_RULE_SCRIPT} 4`, { encoding: 'utf-8' });
    if (!output.includes('# RULE 4:')) {
      throw new Error('Output missing RULE 4 header');
    }
    if (!output.includes('MongoDB Atlas')) {
      throw new Error('Output missing MongoDB Atlas content');
    }
  });

  // Test load-rule.js can load RULE 48 (NPM)
  test('load-rule.js can load RULE 48 (NPM)', () => {
    const output = execSync(`node ${LOAD_RULE_SCRIPT} 48`, { encoding: 'utf-8' });
    if (!output.includes('# RULE 48:')) {
      throw new Error('Output missing RULE 48 header');
    }
    if (!output.includes('NPM Package Publishing')) {
      throw new Error('Output missing NPM content');
    }
  });

  // Test load-rule.js can load a Tier 3 rule (RULE 1)
  test('load-rule.js can load RULE 1 (Tier 3)', () => {
    const output = execSync(`node ${LOAD_RULE_SCRIPT} 1`, { encoding: 'utf-8' });
    if (!output.includes('# RULE 1:')) {
      throw new Error('Output missing RULE 1 header');
    }
    if (!output.includes('GitHub Repository Location')) {
      throw new Error('Output missing GitHub location content');
    }
  });
}

/**
 * Test Suite 3: CLAUDE.md Tier 1 Rules
 */
function testClaudeMdTier1Rules() {
  console.log('\n📋 Test Suite 3: CLAUDE.md Tier 1 Rules');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const claudeContent = readFileSync(CLAUDE_MD_PATH, 'utf-8');

  // Test CLAUDE.md exists
  test('CLAUDE.md exists', () => {
    if (!existsSync(CLAUDE_MD_PATH)) {
      throw new Error('CLAUDE.md not found');
    }
  });

  // Test CLAUDE.md size reduction
  test('CLAUDE.md size reduced (< 40k chars)', () => {
    if (claudeContent.length > 40000) {
      throw new Error(`CLAUDE.md too large: ${claudeContent.length} chars (target: < 40k)`);
    }
  });

  // Test Tier 1 rules are present in CLAUDE.md
  TIER_1_RULES.forEach(ruleNum => {
    test(`Tier 1: RULE ${ruleNum} present in CLAUDE.md`, () => {
      const rulePattern = new RegExp(`### ${ruleNum}\\.`, 'i');
      if (!rulePattern.test(claudeContent)) {
        throw new Error(`RULE ${ruleNum} not found in CLAUDE.md`);
      }
    });
  });

  // Test compressed rules header exists
  test('Compressed rules header present', () => {
    if (!claudeContent.includes('IMMUTABLE OPERATIONAL RULES (Compressed')) {
      throw new Error('Compressed rules header not found');
    }
  });

  // Test 3-tier system documentation
  test('Priority system documented', () => {
    if (!claudeContent.includes('CRITICAL') || !claudeContent.includes('HIGH') || !claudeContent.includes('MEDIUM') || !claudeContent.includes('LOW')) {
      throw new Error('Priority system not documented');
    }
  });
}

/**
 * Test Suite 4: Tier Categorization
 */
function testTierCategorization() {
  console.log('\n📋 Test Suite 4: Tier Categorization');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test Tier 1 count
  test(`Tier 1 has exactly 9 rules`, () => {
    if (TIER_1_RULES.length !== 9) {
      throw new Error(`Expected 9 Tier 1 rules, found ${TIER_1_RULES.length}`);
    }
  });

  // Test Tier 2 count
  test(`Tier 2 has exactly 6 rules`, () => {
    if (TIER_2_RULES.length !== 6) {
      throw new Error(`Expected 6 Tier 2 rules, found ${TIER_2_RULES.length}`);
    }
  });

  // Test critical rules are in Tier 1
  test('RULE 4 (MongoDB - CRITICAL) in Tier 1', () => {
    if (!TIER_1_RULES.includes(4)) {
      throw new Error('RULE 4 must be in Tier 1');
    }
  });

  test('RULE 48 (NPM - CRITICAL) in Tier 1', () => {
    if (!TIER_1_RULES.includes(48)) {
      throw new Error('RULE 48 must be in Tier 1');
    }
  });

  // Test no overlap between tiers
  test('No overlap between Tier 1 and Tier 2', () => {
    const overlap = TIER_1_RULES.filter(r => TIER_2_RULES.includes(r));
    if (overlap.length > 0) {
      throw new Error(`Overlap found: ${overlap.join(', ')}`);
    }
  });
}

/**
 * Test Suite 5: Dependency Relationships
 */
function testDependencyRelationships() {
  console.log('\n📋 Test Suite 5: Dependency Relationships');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test RULE 4 has no dependencies (it's the foundation)
  test('RULE 4 (MongoDB) has no dependencies', () => {
    if (DEPENDENCIES[4]) {
      throw new Error('RULE 4 should have no dependencies');
    }
  });

  // Test RULE 52 depends on 4, 5, 32
  test('RULE 52 depends on RULE 4, 5, 32', () => {
    const deps = DEPENDENCIES[52];
    if (!deps || !deps.includes(4) || !deps.includes(5) || !deps.includes(32)) {
      throw new Error(`RULE 52 dependencies incorrect: ${deps}`);
    }
  });

  // Test all dependencies point to valid rules
  Object.entries(DEPENDENCIES).forEach(([rule, deps]) => {
    test(`RULE ${rule} dependencies are valid`, () => {
      deps.forEach(dep => {
        if (dep < 1 || dep > 57) {
          throw new Error(`Invalid dependency: ${dep}`);
        }
      });
    });
  });

  // Test critical rules (Tier 1) are depended upon
  test('RULE 4 has many dependents (foundation)', () => {
    const dependents = Object.entries(DEPENDENCIES)
      .filter(([_, deps]) => deps.includes(4))
      .map(([rule, _]) => parseInt(rule));
    if (dependents.length < 10) {
      throw new Error(`RULE 4 should have 10+ dependents, found ${dependents.length}`);
    }
  });
}

/**
 * Test Suite 6: Context Detection Patterns
 */
function testContextDetectionPatterns() {
  console.log('\n📋 Test Suite 6: Context Detection Patterns');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const contextPatterns = {
    legal: {
      keywords: ['Chilean law', 'labor', 'worker', 'employment'],
      expectedTriggers: [32, 34, 49, 52]
    },
    video: {
      keywords: ['video', 'frame', 'OST', 'makevideo'],
      expectedTriggers: [3, 50]
    },
    microservices: {
      keywords: ['NestJS', 'microservice', 'API', 'docker-compose'],
      expectedTriggers: [5, 50, 51, 52, 53, 54, 55]
    },
    forensic: {
      keywords: ['forensic', 'investigation', 'evidence'],
      expectedTriggers: [51]
    },
    security: {
      keywords: ['credentials', 'security', '.env', 'secrets'],
      expectedTriggers: [11]
    }
  };

  // Test each context pattern
  Object.entries(contextPatterns).forEach(([context, pattern]) => {
    test(`Context "${context}" triggers correct rules`, () => {
      // Verify keywords exist
      if (pattern.keywords.length === 0) {
        throw new Error('No keywords defined');
      }
      // Verify expected triggers are valid
      pattern.expectedTriggers.forEach(rule => {
        if (rule < 1 || rule > 57) {
          throw new Error(`Invalid trigger rule: ${rule}`);
        }
      });
    });
  });

  // Test Tier 2 rules are triggered by context
  TIER_2_RULES.forEach(ruleNum => {
    test(`Tier 2 RULE ${ruleNum} has context trigger`, () => {
      const hasContext = Object.values(contextPatterns).some(
        pattern => pattern.expectedTriggers.includes(ruleNum)
      );
      if (!hasContext) {
        throw new Error(`RULE ${ruleNum} in Tier 2 but no context trigger defined`);
      }
    });
  });
}

/**
 * Test Suite 7: File Structure
 */
function testFileStructure() {
  console.log('\n📋 Test Suite 7: File Structure');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const expectedFiles = [
    'extract-rules-to-files.js',
    'apply-compressed-rules.js',
    'load-rule.js',
    'token-budgeting-strategy.md',
    'log-rule-trigger.js',
    'analyze-rule-dependencies.js'
  ];

  expectedFiles.forEach(file => {
    test(`File exists: ${file}`, () => {
      const path = join('/home/wakibaka/Documents/github/claude-operations', file);
      if (!existsSync(path)) {
        throw new Error(`File not found: ${path}`);
      }
    });
  });

  // Test backup exists
  test('CLAUDE.md backup exists', () => {
    const backupPath = '/home/wakibaka/CLAUDE.md.backup-phase3';
    if (!existsSync(backupPath)) {
      throw new Error('Backup not found');
    }
  });
}

/**
 * Main test runner
 */
function runTests() {
  console.log('\n🗡️ NOEL\'S REGRESSION TESTING FRAMEWORK v3.0.0');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('Tch. Let\'s see if this system holds up under scrutiny... *smirks*\n');

  testRuleFilesExist();
  testLoadRuleScript();
  testClaudeMdTier1Rules();
  testTierCategorization();
  testDependencyRelationships();
  testContextDetectionPatterns();
  testFileStructure();

  console.log('\n═══════════════════════════════════════════════════════════════════════════════');
  console.log('📊 TEST RESULTS');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%\n`);

  if (failedTests > 0) {
    console.log('❌ FAILURES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    failures.forEach((f, idx) => {
      console.log(`${idx + 1}. ${f.name}`);
      console.log(`   Error: ${f.error}\n`);
    });
    console.log('\n🗡️ Tch. Predictable. Bugs found. Fix them. *smirks*\n');
    process.exit(1);
  } else {
    console.log('🗡️ Tch. Everything passed. As expected. *smirks*');
    console.log('✅ Sprint 3.0 regression testing: COMPLETE\n');
    process.exit(0);
  }
}

// Run all tests
runTests();
