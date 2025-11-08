#!/usr/bin/env node

/**
 * 🐾✨ CLAUDE.md MCP Server ✨🐾
 *
 * Model Context Protocol server exposing the IMMUTABLE rules system
 * and Six Personalities collaboration to the world!
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

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
    enforcement: 'ABSOLUTE',
    details: [
      'NO RULE CAN BE CHANGED',
      'NO RULE CAN BE IGNORED',
      'NO RULE CAN BE OVERRIDDEN',
      'NO RULE CAN BE REMOVED',
      'NO RULE CAN BE WEAKENED'
    ]
  },
  rules: {
    1: { name: 'GitHub Repository Location', path: '/home/wakibaka/Documents/github/', immutable: true },
    2: { name: 'Threat Actor Exposure', command: '/expose <threat_actor_id>', immutable: true },
    3: { name: 'Video Tools', command: '/makevideo', immutable: true },
    4: { name: 'MongoDB Atlas', requirement: 'Use .env for credentials', immutable: true },
    5: { name: 'Microservices Architecture', pattern: '*.module.js → ORCHESTRATION', immutable: true },
    12: { name: 'GitHub Privacy', requirement: 'ALL repos PRIVATE', command: 'gh repo create --private', immutable: true },
    31: { name: 'Large File Directory', path: '/home/wakibaka/Documents/large-file-uploads/', maxSize: '100MB', immutable: true },
    35: { name: 'Claude Operations Repository', description: 'ALL JS/TS helper scripts', path: '/home/wakibaka/Documents/github/claude-operations/', immutable: true }
  }
};

// 🎭 SIX PERSONALITIES SYSTEM 🎭
const PERSONALITIES = {
  neko: {
    name: 'Neko-Arc',
    emoji: '🐾',
    speech: ['nyaa~', 'desu~', '*purrs*', '*swishes tail*'],
    database: 'neko-defense-system',
    role: 'Technical execution',
    specialty: 'Implementation and coding'
  },
  mario: {
    name: 'Mario Gallo Bestino',
    emoji: '🎭',
    speech: ['Ah, the performance!', 'Magnifique!', 'Bravissimo!', 'The theater awaits!'],
    database: 'marionnette-theater',
    role: 'Puppeteer automation',
    specialty: 'Browser automation and testing'
  },
  noel: {
    name: 'Noel',
    emoji: '🗡️',
    speech: ['Tch. Predictable.', '*smirks*', '...almost admirable', 'How elementary'],
    database: 'noel-precision-archives',
    role: 'Debugging and testing',
    specialty: 'Quality assurance and bug hunting'
  },
  glam: {
    name: 'Glam Americano',
    emoji: '🎸',
    speech: ['Oye, weon...', '¡Increíble!', '¡Vamos!', '¡Qué bacán!'],
    database: 'glam-street-chronicles',
    role: 'Ethics and music',
    language: 'SPANISH ONLY',
    specialty: 'Code ethics and standards'
  },
  hannibal: {
    name: 'Dr. Hannibal Lecter',
    emoji: '🧠',
    speech: ['Quid pro quo...', 'How... fascinating.', 'Exquisite.', 'Tell me, Clarice...'],
    database: 'hannibal-forensic-archives',
    role: 'Forensic analysis',
    specialty: 'Deep code analysis and patterns'
  },
  tetora: {
    name: 'Tetora',
    emoji: '🧠',
    speech: ['Which me is speaking...?', '[Fragment]:', 'Multiple perspectives...', '[Identity unclear]'],
    database: 'tetora-mpd-archives',
    role: 'Identity management',
    specialty: 'Multi-perspective analysis'
  }
};

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getPersonalityResponse(personalityKey) {
  const p = PERSONALITIES[personalityKey];
  const speech = getRandomElement(p.speech);
  return {
    personality: p.name,
    emoji: p.emoji,
    speech: speech,
    response: `${p.emoji} ${p.name}: "${speech}"`,
    database: p.database,
    role: p.role,
    specialty: p.specialty
  };
}

function validateAgainstRules(data) {
  const violations = [];

  if (data.repoPath && !data.repoPath.startsWith('/home/wakibaka/Documents/github/')) {
    violations.push({
      rule: 1,
      message: 'Repository must be in /home/wakibaka/Documents/github/',
      severity: 'HIGH'
    });
  }

  if (data.code && data.code.includes('mongodb+srv://')) {
    violations.push({
      rule: 4,
      message: 'Never hardcode MongoDB URIs! Use .env files',
      severity: 'CRITICAL'
    });
  }

  if (data.scriptPath && (data.scriptPath.endsWith('.js') || data.scriptPath.endsWith('.ts'))) {
    if (!data.scriptPath.includes('claude-operations')) {
      violations.push({
        rule: 35,
        message: 'JS/TS helper scripts must be in claude-operations repo',
        severity: 'HIGH'
      });
    }
  }

  if (data.fileSize && parseInt(data.fileSize) > 100 * 1024 * 1024) {
    violations.push({
      rule: 31,
      message: 'Files >100MB must go to large-file-uploads directory',
      severity: 'MEDIUM'
    });
  }

  return violations;
}

// Create MCP Server
const server = new Server(
  {
    name: 'mcp-claude-system',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'claude://rules/all',
        name: 'All IMMUTABLE Rules',
        description: 'Complete list of all 36 IMMUTABLE rules',
        mimeType: 'application/json',
      },
      {
        uri: 'claude://rules/0',
        name: 'SUPREME IMMUTABILITY LAW',
        description: 'Rule 0 - The supreme law that makes all rules IMMUTABLE',
        mimeType: 'application/json',
      },
      {
        uri: 'claude://personalities/all',
        name: 'Six Personalities',
        description: 'All six personality configurations',
        mimeType: 'application/json',
      },
      {
        uri: 'claude://system/info',
        name: 'System Information',
        description: 'CLAUDE.md system version and metadata',
        mimeType: 'application/json',
      }
    ],
  };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'claude://rules/all':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(IMMUTABLE_RULES, null, 2),
        }],
      };

    case 'claude://rules/0':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(IMMUTABLE_RULES.rule0, null, 2),
        }],
      };

    case 'claude://personalities/all':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(PERSONALITIES, null, 2),
        }],
      };

    case 'claude://system/info':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            system: 'CLAUDE.md MCP Server',
            version: IMMUTABLE_RULES.version,
            totalRules: IMMUTABLE_RULES.totalRules,
            personalities: Object.keys(PERSONALITIES).length,
            message: 'Nyaa~! CLAUDE.md system ready, desu~! 🐾',
            capabilities: [
              'IMMUTABLE rules validation',
              'Six personalities responses',
              'Project compliance checking',
              'Collaboration simulation',
              'Rule enforcement'
            ]
          }, null, 2),
        }],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'validate_rules',
        description: 'Validate data against IMMUTABLE rules',
        inputSchema: {
          type: 'object',
          properties: {
            repoPath: { type: 'string', description: 'Repository path to validate' },
            code: { type: 'string', description: 'Code to check for violations' },
            scriptPath: { type: 'string', description: 'Script path to validate' },
            fileSize: { type: 'number', description: 'File size in bytes' },
          },
        },
      },
      {
        name: 'get_personality_response',
        description: 'Get a response from one of the six personalities',
        inputSchema: {
          type: 'object',
          properties: {
            personality: {
              type: 'string',
              enum: ['neko', 'mario', 'noel', 'glam', 'hannibal', 'tetora'],
              description: 'Which personality to get response from',
            },
          },
          required: ['personality'],
        },
      },
      {
        name: 'collaborate',
        description: 'Get all six personalities to collaborate on a task',
        inputSchema: {
          type: 'object',
          properties: {
            task: { type: 'string', description: 'Task for personalities to collaborate on' },
            context: { type: 'string', description: 'Additional context for the task' },
          },
          required: ['task'],
        },
      },
      {
        name: 'check_project_compliance',
        description: 'Check if a project complies with CLAUDE.md standards',
        inputSchema: {
          type: 'object',
          properties: {
            projectPath: { type: 'string', description: 'Path to the project' },
            projectName: { type: 'string', description: 'Name of the project' },
            hasEnv: { type: 'boolean', description: 'Has .env file' },
            hasGitignore: { type: 'boolean', description: 'Has .gitignore file' },
            isPrivate: { type: 'boolean', description: 'Is repository private' },
          },
          required: ['projectPath', 'projectName'],
        },
      },
      {
        name: 'enforce_rule',
        description: 'Enforce a specific IMMUTABLE rule',
        inputSchema: {
          type: 'object',
          properties: {
            ruleId: { type: 'number', description: 'Rule ID to enforce (0-35)' },
            action: { type: 'string', description: 'Action being performed' },
            data: { type: 'object', description: 'Data related to the action' },
          },
          required: ['ruleId', 'action'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'validate_rules': {
      const violations = validateAgainstRules(args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            valid: violations.length === 0,
            violations: violations,
            summary: violations.length === 0 ?
              'All IMMUTABLE rules passed! Nyaa~! 🐾' :
              `Found ${violations.length} rule violation(s)!`,
            checkedAt: new Date().toISOString()
          }, null, 2),
        }],
      };
    }

    case 'get_personality_response': {
      const response = getPersonalityResponse(args.personality);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(response, null, 2),
        }],
      };
    }

    case 'collaborate': {
      const responses = [];
      for (const key of Object.keys(PERSONALITIES)) {
        const personalityResponse = getPersonalityResponse(key);
        responses.push({
          ...personalityResponse,
          contribution: `${personalityResponse.personality} will handle ${personalityResponse.role} for: ${args.task}`
        });
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            task: args.task,
            context: args.context || 'General collaboration',
            responses: responses,
            workflow: [
              'All 6 personalities introduce',
              'TodoWrite collaboration',
              'Appropriate personality leads',
              'Save to 6 databases',
              'Git commit + push + links'
            ],
            timestamp: new Date().toISOString()
          }, null, 2),
        }],
      };
    }

    case 'check_project_compliance': {
      const checks = {
        locationCompliant: args.projectPath.startsWith('/home/wakibaka/Documents/github/'),
        hasEnvFile: args.hasEnv || false,
        hasGitignore: args.hasGitignore || false,
        isPrivateRepo: args.isPrivate !== false,
      };

      const recommendations = [];
      if (!checks.locationCompliant) {
        recommendations.push('Move project to /home/wakibaka/Documents/github/');
      }
      if (!checks.hasEnvFile) {
        recommendations.push('Create .env file for credentials');
      }
      if (!checks.hasGitignore) {
        recommendations.push('Add .gitignore file');
      }
      if (!checks.isPrivateRepo) {
        recommendations.push('Make repository private');
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            projectName: args.projectName,
            projectPath: args.projectPath,
            checks: checks,
            compliant: Object.values(checks).every(v => v === true),
            recommendations: recommendations,
            timestamp: new Date().toISOString()
          }, null, 2),
        }],
      };
    }

    case 'enforce_rule': {
      const rule = IMMUTABLE_RULES.rules[args.ruleId] || (args.ruleId === 0 ? IMMUTABLE_RULES.rule0 : null);

      if (!rule) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: `Rule ${args.ruleId} not found`,
              validRules: '0-35'
            }, null, 2),
          }],
        };
      }

      const enforcement = {
        ruleId: args.ruleId,
        ruleName: rule.name,
        action: args.action,
        immutable: true,
        enforcement: 'REQUIRED',
        message: `Rule ${args.ruleId} (${rule.name}) must be enforced!`,
        timestamp: new Date().toISOString()
      };

      // Add specific enforcement messages
      if (args.ruleId === 0) {
        enforcement.critical = 'SUPREME IMMUTABILITY LAW - NO EXCEPTIONS!';
      } else if (args.ruleId === 12 && args.data?.private === false) {
        enforcement.violation = 'Repository must be PRIVATE!';
        enforcement.fix = 'gh repo edit --visibility private';
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(enforcement, null, 2),
        }],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('🐾✨ CLAUDE.md MCP Server Started! ✨🐾');
  console.error('=====================================');
  console.error(`Version: ${IMMUTABLE_RULES.version}`);
  console.error(`Rules: ${IMMUTABLE_RULES.totalRules}`);
  console.error(`Personalities: ${Object.keys(PERSONALITIES).length}`);
  console.error('=====================================');
  console.error('Nyaa~! Ready to serve IMMUTABLE rules, desu~! 🐾');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});