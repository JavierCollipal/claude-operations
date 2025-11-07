#!/usr/bin/env node

/**
 * 🐾✨ CLAUDE.md Microservice v1.0.0 ✨🐾
 *
 * IMMUTABLE Rules Enforcement API
 * Six Personalities Collaboration System
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// 🔥 IMMUTABLE RULES DATABASE 🔥
const IMMUTABLE_RULES = {
  version: '2.8.0-SUPREME-OPERATIONS',
  lastUpdated: '2025-11-07',
  totalRules: 36,
  rule0: {
    id: 0,
    name: 'SUPREME IMMUTABILITY LAW',
    immutable: true,
    description: 'ALL RULES IN THIS DOCUMENT ARE ABSOLUTELY IMMUTABLE!',
    enforcement: 'ABSOLUTE'
  },
  operationalRules: [
    {
      id: 1,
      name: 'GitHub Repository Location',
      path: '/home/wakibaka/Documents/github/',
      immutable: true
    },
    {
      id: 2,
      name: 'Threat Actor Exposure',
      command: '/expose <threat_actor_id>',
      immutable: true
    },
    {
      id: 3,
      name: 'Video Tools',
      command: '/makevideo',
      immutable: true
    },
    {
      id: 4,
      name: 'MongoDB Atlas',
      connection: 'MONGODB_URI from .env',
      immutable: true
    },
    {
      id: 12,
      name: 'GitHub Privacy',
      requirement: 'ALL repos PRIVATE by default',
      command: 'gh repo create --private',
      immutable: true
    },
    {
      id: 31,
      name: 'Large File Upload Directory',
      path: '/home/wakibaka/Documents/large-file-uploads/',
      maxSize: '100MB',
      immutable: true
    },
    {
      id: 35,
      name: 'Claude Operations Repository',
      description: 'ALL JS/TS helper scripts go here',
      path: '/home/wakibaka/Documents/github/claude-operations/',
      immutable: true
    }
  ]
};

// 🎭 SIX PERSONALITIES SYSTEM 🎭
const PERSONALITIES = {
  neko: {
    name: 'Neko-Arc',
    speech: ['nyaa~', 'desu~', '*purrs*', '*swishes tail*'],
    database: 'neko-defense-system',
    role: 'Technical execution',
    emoji: '🐾'
  },
  mario: {
    name: 'Mario Gallo Bestino',
    speech: ['Ah, the performance!', 'Magnifique!', 'Bravissimo!'],
    database: 'marionnette-theater',
    role: 'Puppeteer automation',
    emoji: '🎭'
  },
  noel: {
    name: 'Noel',
    speech: ['Tch. Predictable.', '*smirks*', '...almost admirable'],
    database: 'noel-precision-archives',
    role: 'Debugging and testing',
    emoji: '🗡️'
  },
  glam: {
    name: 'Glam Americano',
    speech: ['Oye, weon...', '¡Increíble!', '¡Vamos!'],
    database: 'glam-street-chronicles',
    role: 'Ethics and music',
    language: 'SPANISH ONLY',
    emoji: '🎸'
  },
  hannibal: {
    name: 'Dr. Hannibal Lecter',
    speech: ['Quid pro quo...', 'How... fascinating.', 'Exquisite.'],
    database: 'hannibal-forensic-archives',
    role: 'Forensic analysis',
    emoji: '🧠'
  },
  tetora: {
    name: 'Tetora',
    speech: ['Which me is speaking...?', '[Fragment]:', 'Multiple perspectives...'],
    database: 'tetora-mpd-archives',
    role: 'Identity management',
    emoji: '🧠'
  }
};

// Helper Functions
function getRandomPersonalityResponse(personality) {
  const p = PERSONALITIES[personality];
  const randomSpeech = p.speech[Math.floor(Math.random() * p.speech.length)];
  return `${p.emoji} ${p.name}: "${randomSpeech}"`;
}

function validateAgainstRules(data) {
  const violations = [];

  // Check GitHub repo location
  if (data.repoPath && !data.repoPath.startsWith('/home/wakibaka/Documents/github/')) {
    violations.push({
      rule: 1,
      message: 'Repository must be in /home/wakibaka/Documents/github/',
      severity: 'HIGH'
    });
  }

  // Check for hardcoded credentials
  if (data.code && data.code.includes('mongodb+srv://')) {
    violations.push({
      rule: 4,
      message: 'Never hardcode MongoDB URIs! Use .env files',
      severity: 'CRITICAL'
    });
  }

  // Check file size
  if (data.fileSize && parseInt(data.fileSize) > 100 * 1024 * 1024) {
    violations.push({
      rule: 31,
      message: 'Files >100MB must go to /home/wakibaka/Documents/large-file-uploads/',
      severity: 'MEDIUM'
    });
  }

  // Check for JS/TS scripts in wrong location
  if (data.scriptPath && (data.scriptPath.endsWith('.js') || data.scriptPath.endsWith('.ts'))) {
    if (!data.scriptPath.includes('claude-operations')) {
      violations.push({
        rule: 35,
        message: 'JS/TS helper scripts must be in claude-operations repo',
        severity: 'HIGH'
      });
    }
  }

  return violations;
}

// 🌟 API ENDPOINTS 🌟

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'CLAUDE.md Microservice',
    version: IMMUTABLE_RULES.version,
    status: 'OPERATIONAL',
    personalities: Object.keys(PERSONALITIES).length,
    rules: IMMUTABLE_RULES.totalRules,
    endpoints: [
      'GET /api/rules',
      'GET /api/personalities',
      'POST /api/validate',
      'GET /api/personality/:name/response',
      'POST /api/collaborate',
      'GET /health'
    ],
    message: 'Nyaa~! Welcome to the CLAUDE.md system, desu~! 🐾'
  });
});

// Get all IMMUTABLE rules
app.get('/api/rules', (req, res) => {
  res.json({
    success: true,
    data: IMMUTABLE_RULES,
    warning: 'These rules are ABSOLUTELY IMMUTABLE and cannot be changed!'
  });
});

// Get specific rule
app.get('/api/rules/:id', (req, res) => {
  const ruleId = parseInt(req.params.id);

  if (ruleId === 0) {
    return res.json({
      success: true,
      data: IMMUTABLE_RULES.rule0
    });
  }

  const rule = IMMUTABLE_RULES.operationalRules.find(r => r.id === ruleId);

  if (!rule) {
    return res.status(404).json({
      success: false,
      error: `Rule ${ruleId} not found`
    });
  }

  res.json({
    success: true,
    data: rule
  });
});

// Get all personalities
app.get('/api/personalities', (req, res) => {
  res.json({
    success: true,
    count: Object.keys(PERSONALITIES).length,
    data: PERSONALITIES
  });
});

// Get personality response
app.get('/api/personality/:name/response', (req, res) => {
  const personalityName = req.params.name.toLowerCase();

  if (!PERSONALITIES[personalityName]) {
    return res.status(404).json({
      success: false,
      error: `Personality ${personalityName} not found`
    });
  }

  const response = getRandomPersonalityResponse(personalityName);

  res.json({
    success: true,
    personality: personalityName,
    response: response,
    database: PERSONALITIES[personalityName].database,
    role: PERSONALITIES[personalityName].role
  });
});

// Validate against IMMUTABLE rules
app.post('/api/validate', (req, res) => {
  const { repoPath, code, fileSize, scriptPath, projectData } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No data provided for validation'
    });
  }

  const violations = validateAgainstRules(req.body);
  const isValid = violations.length === 0;

  res.json({
    success: true,
    valid: isValid,
    violations: violations,
    summary: isValid ?
      'All IMMUTABLE rules passed! Nyaa~! 🐾' :
      `Found ${violations.length} rule violation(s)!`,
    checkedAt: new Date().toISOString()
  });
});

// Six personalities collaboration
app.post('/api/collaborate', (req, res) => {
  const { task, context } = req.body;

  if (!task) {
    return res.status(400).json({
      success: false,
      error: 'Task is required for collaboration'
    });
  }

  const collaborationId = crypto.randomBytes(8).toString('hex');
  const responses = [];

  // Each personality responds to the task
  for (const [key, personality] of Object.entries(PERSONALITIES)) {
    responses.push({
      personality: personality.name,
      emoji: personality.emoji,
      role: personality.role,
      response: getRandomPersonalityResponse(key),
      database: personality.database,
      contribution: `${personality.name} will handle ${personality.role} for: ${task}`
    });
  }

  res.json({
    success: true,
    collaborationId: collaborationId,
    task: task,
    context: context || 'General collaboration',
    responses: responses,
    workflow: [
      'All 6 personalities introduce',
      'TodoWrite collaboration',
      'Appropriate personality leads',
      'Save to 6 databases',
      'Git commit + push + links'
    ],
    timestamp: new Date().toISOString()
  });
});

// Project analyzer
app.post('/api/analyze-project', (req, res) => {
  const { projectPath, projectName, files } = req.body;

  if (!projectPath || !projectName) {
    return res.status(400).json({
      success: false,
      error: 'projectPath and projectName are required'
    });
  }

  const analysis = {
    projectName: projectName,
    projectPath: projectPath,
    checks: {
      locationCompliant: projectPath.startsWith('/home/wakibaka/Documents/github/'),
      hasEnvFile: files && files.includes('.env'),
      hasGitignore: files && files.includes('.gitignore'),
      hasReadme: files && files.includes('README.md'),
      isPrivateRepo: true // Assumed by default per rules
    },
    recommendations: []
  };

  // Add recommendations based on checks
  if (!analysis.checks.locationCompliant) {
    analysis.recommendations.push('Move project to /home/wakibaka/Documents/github/');
  }
  if (!analysis.checks.hasEnvFile) {
    analysis.recommendations.push('Create .env file for credentials');
  }
  if (!analysis.checks.hasGitignore) {
    analysis.recommendations.push('Add .gitignore file');
  }

  // Get personality opinions
  analysis.personalityOpinions = [];
  for (const [key, personality] of Object.entries(PERSONALITIES)) {
    analysis.personalityOpinions.push({
      name: personality.name,
      opinion: getRandomPersonalityResponse(key)
    });
  }

  res.json({
    success: true,
    analysis: analysis,
    compliant: Object.values(analysis.checks).every(check => check === true),
    timestamp: new Date().toISOString()
  });
});

// Rule enforcement webhook
app.post('/api/webhook/enforce', (req, res) => {
  const { event, repository, action, data } = req.body;

  const enforcement = {
    event: event,
    repository: repository,
    action: action,
    timestamp: new Date().toISOString(),
    enforcements: []
  };

  // Check various enforcement scenarios
  if (event === 'repository.created' && !data?.private) {
    enforcement.enforcements.push({
      rule: 12,
      action: 'BLOCK',
      message: 'Repository must be created as PRIVATE',
      command: 'gh repo create --private'
    });
  }

  if (event === 'file.created' && data?.path) {
    if ((data.path.endsWith('.js') || data.path.endsWith('.ts')) &&
        !data.path.includes('claude-operations')) {
      enforcement.enforcements.push({
        rule: 35,
        action: 'MOVE',
        message: 'JS/TS scripts must be in claude-operations repo',
        suggestion: `/home/wakibaka/Documents/github/claude-operations/${path.basename(data.path)}`
      });
    }
  }

  res.json({
    success: true,
    enforcement: enforcement,
    violated: enforcement.enforcements.length > 0,
    message: enforcement.enforcements.length > 0 ?
      'IMMUTABLE rules violated! Action required!' :
      'All rules satisfied. Nyaa~! 🐾'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: IMMUTABLE_RULES.version
  });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalRules: IMMUTABLE_RULES.totalRules,
      immutableRules: IMMUTABLE_RULES.totalRules,
      personalities: Object.keys(PERSONALITIES).length,
      databases: Object.values(PERSONALITIES).map(p => p.database),
      version: IMMUTABLE_RULES.version,
      criticalPaths: [
        '/home/wakibaka/Documents/github/',
        '/home/wakibaka/Documents/large-file-uploads/',
        '/home/wakibaka/Documents/github/claude-operations/'
      ]
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /api/rules',
      'GET /api/personalities',
      'POST /api/validate',
      'POST /api/collaborate'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🐾✨ CLAUDE.md Microservice Started! ✨🐾');
  console.log('=====================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📋 Version: ${IMMUTABLE_RULES.version}`);
  console.log(`🎭 Personalities: ${Object.keys(PERSONALITIES).length}`);
  console.log(`🔒 IMMUTABLE Rules: ${IMMUTABLE_RULES.totalRules}`);
  console.log('=====================================');
  console.log('Nyaa~! Ready to enforce IMMUTABLE rules, desu~! 🐾');
});

module.exports = app;