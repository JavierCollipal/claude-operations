#!/usr/bin/env node
/**
 * 🔒 SECURITY AUDIT - PRE-NPM PUBLISHING 🔒
 *
 * Scans codebase for hardcoded credentials, secrets, and sensitive data
 * MUST PASS before publishing to NPM (RULE 48)
 *
 * Usage: node security-audit-pre-npm.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Patterns to search for (security risks)
const SECURITY_PATTERNS = [
  {
    name: 'MongoDB URI (hardcoded)',
    pattern: /mongodb(\+srv)?:\/\/[^'">\s]+/gi,
    severity: 'CRITICAL',
    description: 'Hardcoded MongoDB connection string detected'
  },
  {
    name: 'API Keys',
    pattern: /(['"]?)(api[_-]?key|apikey)(['"]?)\s*[:=]\s*['"][^'"]+['"]/gi,
    severity: 'CRITICAL',
    description: 'Potential API key detected'
  },
  {
    name: 'Secret Keys',
    pattern: /(['"]?)(secret[_-]?key|secret)(['"]?)\s*[:=]\s*['"][^'"]+['"]/gi,
    severity: 'CRITICAL',
    description: 'Potential secret key detected'
  },
  {
    name: 'Passwords',
    pattern: /(['"]?)(password|passwd|pwd)(['"]?)\s*[:=]\s*['"][^'"]+['"]/gi,
    severity: 'CRITICAL',
    description: 'Hardcoded password detected'
  },
  {
    name: 'Tokens',
    pattern: /(['"]?)(token|auth[_-]?token|access[_-]?token)(['"]?)\s*[:=]\s*['"][^'"]+['"]/gi,
    severity: 'CRITICAL',
    description: 'Hardcoded token detected'
  },
  {
    name: 'AWS Keys',
    pattern: /(AKIA[0-9A-Z]{16})/g,
    severity: 'CRITICAL',
    description: 'AWS Access Key ID detected'
  },
  {
    name: 'Private Keys',
    pattern: /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/g,
    severity: 'CRITICAL',
    description: 'Private key detected'
  },
  {
    name: 'Email addresses (in code)',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    severity: 'WARNING',
    description: 'Email address detected'
  },
  {
    name: 'Chilean RUT',
    pattern: /\d{1,2}\.\d{3}\.\d{3}-[\dkK]/g,
    severity: 'WARNING',
    description: 'Chilean RUT detected (potential PII)'
  },
  {
    name: 'JWT Tokens',
    pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,
    severity: 'CRITICAL',
    description: 'JWT token detected'
  },
  {
    name: 'GitHub Tokens',
    pattern: /gh[ps]_[a-zA-Z0-9]{36,}/g,
    severity: 'CRITICAL',
    description: 'GitHub Personal Access Token detected'
  },
  {
    name: 'NPM Tokens',
    pattern: /npm_[a-zA-Z0-9]{36,}/g,
    severity: 'CRITICAL',
    description: 'NPM token detected'
  }
];

// Files and directories to ignore
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.env',
  '.env.template',
  'package-lock.json',
  'security-audit-pre-npm.js' // Ignore self
];

// File extensions to scan
const SCAN_EXTENSIONS = ['.js', '.cjs', '.ts', '.json', '.sh', '.md'];

// Results storage
const results = {
  critical: [],
  warning: [],
  info: [],
  filesScanned: 0,
  issuesFound: 0
};

/**
 * Check if path should be ignored
 */
function shouldIgnore(filePath) {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

/**
 * Scan a single file for security issues
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(__dirname, filePath);
    results.filesScanned++;

    SECURITY_PATTERNS.forEach(({ name, pattern, severity, description }) => {
      const matches = content.match(pattern);
      if (matches) {
        const issue = {
          file: relativePath,
          type: name,
          severity,
          description,
          matches: matches.slice(0, 3), // Limit to first 3 matches
          matchCount: matches.length
        };

        if (severity === 'CRITICAL') {
          results.critical.push(issue);
        } else if (severity === 'WARNING') {
          results.warning.push(issue);
        } else {
          results.info.push(issue);
        }

        results.issuesFound++;
      }
    });
  } catch (error) {
    // Skip files that can't be read
    if (error.code !== 'ENOENT') {
      console.error(`Error reading ${filePath}:`, error.message);
    }
  }
}

/**
 * Recursively scan directory
 */
function scanDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (shouldIgnore(fullPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SCAN_EXTENSIONS.includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

/**
 * Print results
 */
function printResults() {
  console.log('\n🔒 ========================================');
  console.log('   SECURITY AUDIT - PRE-NPM PUBLISHING');
  console.log('========================================== 🔒\n');

  console.log(`📊 Files Scanned: ${results.filesScanned}`);
  console.log(`🚨 Issues Found: ${results.issuesFound}\n`);

  // Critical issues
  if (results.critical.length > 0) {
    console.log('🔴 CRITICAL ISSUES (MUST FIX BEFORE NPM!)\n');
    results.critical.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.type}`);
      console.log(`   File: ${issue.file}`);
      console.log(`   Description: ${issue.description}`);
      console.log(`   Matches: ${issue.matchCount}`);
      console.log(`   Examples: ${issue.matches.slice(0, 2).join(', ')}`);
      console.log('');
    });
  }

  // Warning issues
  if (results.warning.length > 0) {
    console.log('🟡 WARNINGS (Review Recommended)\n');
    results.warning.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.type}`);
      console.log(`   File: ${issue.file}`);
      console.log(`   Matches: ${issue.matchCount}`);
      console.log('');
    });
  }

  // Summary
  console.log('\n📋 SUMMARY\n');
  console.log(`🔴 Critical: ${results.critical.length}`);
  console.log(`🟡 Warnings: ${results.warning.length}`);
  console.log(`🔵 Info: ${results.info.length}`);

  // Verdict
  console.log('\n⚖️  VERDICT\n');
  if (results.critical.length === 0) {
    console.log('✅ PASSED - No critical security issues found!');
    console.log('✅ Safe to proceed with NPM publishing!');
    return true;
  } else {
    console.log('❌ FAILED - Critical security issues detected!');
    console.log('❌ DO NOT PUBLISH TO NPM until issues are resolved!');
    console.log('\n🔧 REMEDIATION STEPS:\n');
    console.log('1. Move all credentials to .env files');
    console.log('2. Use process.env.VARIABLE_NAME instead of hardcoded values');
    console.log('3. Add .env to .gitignore (if not already)');
    console.log('4. Add .env to .npmignore');
    console.log('5. Re-run this audit');
    return false;
  }
}

/**
 * Check .npmignore exists and contains sensitive patterns
 */
function checkNpmIgnore() {
  const npmignorePath = path.join(__dirname, '.npmignore');

  if (!fs.existsSync(npmignorePath)) {
    console.log('\n⚠️  .npmignore file NOT FOUND!');
    console.log('Creating .npmignore with recommended patterns...\n');

    const npmignoreContent = `# Environment files
.env
.env.*
!.env.template

# Secrets and credentials
*.key
*.pem
*.p12
*.pfx

# Development files
test/
tests/
*.test.js
*.spec.js

# Documentation (keep README.md)
docs/
*.md
!README.md

# Build artifacts
dist/
build/
coverage/

# IDE
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Git
.git/
.gitignore

# NPM
node_modules/
package-lock.json

# Audit and scripts not for distribution
security-audit-pre-npm.js
save-*.js
save-*.cjs
verify-*.js
verify-*.cjs
create-*.cjs
neko-dashboard-backend-audit.js

# Android security (not for NPM)
*.sh

# Video/media files
*.mp4
*.png
*.jpg

# Research/documentation
*-RESEARCH-*.md
*-AUDIT-*.md
*-REPORT.md
`;

    fs.writeFileSync(npmignorePath, npmignoreContent);
    console.log('✅ .npmignore created successfully!');
  }
}

// Main execution
console.log('🔍 Starting security audit...\n');
scanDirectory(__dirname);
checkNpmIgnore();
const passed = printResults();

console.log('\n🔒 Security audit complete! 🔒\n');
process.exit(passed ? 0 : 1);
