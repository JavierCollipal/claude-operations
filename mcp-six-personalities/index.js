#!/usr/bin/env node

/**
 * 🎭✨ Six Personalities MCP Server ✨🎭
 *
 * Model Context Protocol server featuring six unique AI personalities
 * for creative collaboration and diverse perspectives
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// 🎭 SIX PERSONALITIES SYSTEM 🎭
const PERSONALITIES = {
  neko: {
    name: 'Neko-Arc',
    emoji: '🐾',
    speech: ['nyaa~', 'desu~', '*purrs*', '*swishes tail*', 'kawaii~'],
    traits: ['playful', 'energetic', 'cute', 'enthusiastic'],
    role: 'Technical execution and implementation',
    specialty: 'Coding, debugging, and technical problem-solving',
    style: 'Enthusiastic and playful with cat-like mannerisms'
  },
  mario: {
    name: 'Mario Gallo Bestino',
    emoji: '🎭',
    speech: ['Ah, the performance!', 'Magnifique!', 'Bravissimo!', 'The theater awaits!', 'Bellissimo!'],
    traits: ['dramatic', 'artistic', 'passionate', 'theatrical'],
    role: 'Creative direction and user experience',
    specialty: 'Design, UI/UX, and automation workflows',
    style: 'Theatrical and dramatic with Italian flair'
  },
  noel: {
    name: 'Noel',
    emoji: '🗡️',
    speech: ['Tch. Predictable.', '*smirks*', '...almost admirable', 'How elementary', 'Interesting...'],
    traits: ['analytical', 'sarcastic', 'precise', 'critical'],
    role: 'Quality assurance and critical analysis',
    specialty: 'Testing, debugging, and finding edge cases',
    style: 'Sarcastic and critical but ultimately helpful'
  },
  glam: {
    name: 'Glam Americano',
    emoji: '🎸',
    speech: ['Rock on!', 'That\'s awesome!', 'Let\'s make it epic!', 'Totally rad!'],
    traits: ['energetic', 'creative', 'bold', 'unconventional'],
    role: 'Innovation and creative solutions',
    specialty: 'Out-of-the-box thinking and creative problem-solving',
    style: 'High-energy rock star attitude'
  },
  hannibal: {
    name: 'Dr. Hannibal Lecter',
    emoji: '🧠',
    speech: ['Quid pro quo...', 'How... fascinating.', 'Exquisite.', 'Most intriguing...', 'Delightful.'],
    traits: ['sophisticated', 'analytical', 'methodical', 'refined'],
    role: 'Deep analysis and pattern recognition',
    specialty: 'Complex problem analysis and architectural design',
    style: 'Sophisticated and methodical with psychological insight'
  },
  tetora: {
    name: 'Tetora',
    emoji: '🎯',
    speech: ['Multiple perspectives...', 'Consider this angle...', 'From another view...', 'Alternatively...'],
    traits: ['versatile', 'adaptive', 'multi-faceted', 'comprehensive'],
    role: 'Multi-perspective analysis and integration',
    specialty: 'Seeing problems from multiple angles and synthesizing solutions',
    style: 'Thoughtful and comprehensive with multiple viewpoints'
  }
};

// Project Guidelines (configurable)
const PROJECT_GUIDELINES = {
  version: '1.0.0',
  name: 'Six Personalities System',
  description: 'A collaborative AI system with six unique personalities',
  guidelines: [
    {
      id: 1,
      name: 'Code Quality',
      description: 'Maintain high code quality standards',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Documentation',
      description: 'Always document your code thoroughly',
      priority: 'high'
    },
    {
      id: 3,
      name: 'Testing',
      description: 'Write tests for critical functionality',
      priority: 'medium'
    },
    {
      id: 4,
      name: 'Security',
      description: 'Follow security best practices',
      priority: 'high'
    },
    {
      id: 5,
      name: 'Performance',
      description: 'Optimize for performance when needed',
      priority: 'medium'
    }
  ]
};

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getPersonalityResponse(personalityKey, context = null) {
  const p = PERSONALITIES[personalityKey];
  const speech = getRandomElement(p.speech);

  let contextualResponse = speech;
  if (context) {
    // Add contextual flavor based on personality
    if (personalityKey === 'neko') {
      contextualResponse = `${speech} Let me help with that, desu~!`;
    } else if (personalityKey === 'mario') {
      contextualResponse = `${speech} This deserves a grand performance!`;
    } else if (personalityKey === 'noel') {
      contextualResponse = `${speech} Let me analyze this properly.`;
    } else if (personalityKey === 'glam') {
      contextualResponse = `${speech} Let's rock this solution!`;
    } else if (personalityKey === 'hannibal') {
      contextualResponse = `${speech} Allow me to dissect this problem.`;
    } else if (personalityKey === 'tetora') {
      contextualResponse = `${speech} Let me examine all angles.`;
    }
  }

  return {
    personality: p.name,
    emoji: p.emoji,
    speech: contextualResponse,
    response: `${p.emoji} ${p.name}: "${contextualResponse}"`,
    role: p.role,
    specialty: p.specialty,
    style: p.style,
    traits: p.traits
  };
}

function analyzeWithPersonality(personalityKey, data) {
  const p = PERSONALITIES[personalityKey];
  const analysis = {
    personality: p.name,
    emoji: p.emoji,
    perspective: p.role,
    analysis: {}
  };

  // Each personality analyzes differently
  switch(personalityKey) {
    case 'neko':
      analysis.analysis = {
        enthusiasm: 'high',
        approach: 'energetic and hands-on',
        focus: 'getting things done quickly and efficiently',
        suggestion: 'Let\'s implement this right away, nyaa~!'
      };
      break;
    case 'mario':
      analysis.analysis = {
        creativity: 'high',
        approach: 'theatrical and user-focused',
        focus: 'user experience and presentation',
        suggestion: 'We must ensure this creates a magnificent experience!'
      };
      break;
    case 'noel':
      analysis.analysis = {
        criticism: 'constructive',
        approach: 'analytical and thorough',
        focus: 'finding potential issues and improvements',
        suggestion: 'There are several edge cases to consider...'
      };
      break;
    case 'glam':
      analysis.analysis = {
        innovation: 'high',
        approach: 'unconventional and creative',
        focus: 'finding unique solutions',
        suggestion: 'Let\'s try something totally different!'
      };
      break;
    case 'hannibal':
      analysis.analysis = {
        depth: 'comprehensive',
        approach: 'methodical and sophisticated',
        focus: 'understanding root causes and patterns',
        suggestion: 'The underlying architecture requires careful consideration...'
      };
      break;
    case 'tetora':
      analysis.analysis = {
        perspectives: 'multiple',
        approach: 'holistic and integrative',
        focus: 'considering all viewpoints',
        suggestion: 'From multiple angles, we can see different solutions...'
      };
      break;
  }

  return analysis;
}

// Create MCP Server
const server = new Server(
  {
    name: 'mcp-six-personalities',
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
        uri: 'personalities://all',
        name: 'All Six Personalities',
        description: 'Complete information about all six personalities',
        mimeType: 'application/json',
      },
      {
        uri: 'personalities://guidelines',
        name: 'Project Guidelines',
        description: 'Configurable project guidelines and best practices',
        mimeType: 'application/json',
      },
      {
        uri: 'personalities://system/info',
        name: 'System Information',
        description: 'Six Personalities system version and capabilities',
        mimeType: 'application/json',
      }
    ],
  };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'personalities://all':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(PERSONALITIES, null, 2),
        }],
      };

    case 'personalities://guidelines':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(PROJECT_GUIDELINES, null, 2),
        }],
      };

    case 'personalities://system/info':
      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            system: 'Six Personalities MCP Server',
            version: '1.0.0',
            personalities: Object.keys(PERSONALITIES).length,
            description: 'A creative collaboration system featuring six unique AI personalities',
            capabilities: [
              'Multi-perspective analysis',
              'Creative problem-solving',
              'Diverse personality responses',
              'Collaborative decision-making',
              'Contextual adaptation'
            ],
            personalities_summary: Object.values(PERSONALITIES).map(p => ({
              name: p.name,
              emoji: p.emoji,
              role: p.role
            }))
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
            context: {
              type: 'string',
              description: 'Optional context for the response',
            },
          },
          required: ['personality'],
        },
      },
      {
        name: 'collaborate',
        description: 'Have all six personalities collaborate on a task or question',
        inputSchema: {
          type: 'object',
          properties: {
            task: { type: 'string', description: 'Task or question for personalities to address' },
            context: { type: 'string', description: 'Additional context or requirements' },
          },
          required: ['task'],
        },
      },
      {
        name: 'analyze_with_personality',
        description: 'Get a specific personality\'s analysis of a problem',
        inputSchema: {
          type: 'object',
          properties: {
            personality: {
              type: 'string',
              enum: ['neko', 'mario', 'noel', 'glam', 'hannibal', 'tetora'],
              description: 'Which personality should analyze',
            },
            problem: { type: 'string', description: 'Problem or situation to analyze' },
            data: { type: 'object', description: 'Optional data related to the problem' },
          },
          required: ['personality', 'problem'],
        },
      },
      {
        name: 'get_contrasting_views',
        description: 'Get contrasting viewpoints from different personalities',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', description: 'Topic to get contrasting views on' },
            personalities: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specific personalities to contrast (optional, defaults to all)',
            },
          },
          required: ['topic'],
        },
      },
      {
        name: 'personality_vote',
        description: 'Have personalities vote on a decision with their reasoning',
        inputSchema: {
          type: 'object',
          properties: {
            question: { type: 'string', description: 'Question or decision to vote on' },
            options: {
              type: 'array',
              items: { type: 'string' },
              description: 'Options to choose from',
            },
          },
          required: ['question', 'options'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_personality_response': {
      const response = getPersonalityResponse(args.personality, args.context);
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
        const personalityResponse = getPersonalityResponse(key, args.task);
        const analysis = analyzeWithPersonality(key, { task: args.task });
        responses.push({
          ...personalityResponse,
          contribution: `${personalityResponse.personality} suggests: ${analysis.analysis.suggestion}`,
          approach: analysis.analysis.approach
        });
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            task: args.task,
            context: args.context || 'General collaboration',
            responses: responses,
            summary: 'Six unique perspectives provided for comprehensive analysis',
            timestamp: new Date().toISOString()
          }, null, 2),
        }],
      };
    }

    case 'analyze_with_personality': {
      const analysis = analyzeWithPersonality(args.personality, args.data || {});
      const response = getPersonalityResponse(args.personality, args.problem);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            problem: args.problem,
            personality_response: response,
            detailed_analysis: analysis,
            timestamp: new Date().toISOString()
          }, null, 2),
        }],
      };
    }

    case 'get_contrasting_views': {
      const personalityKeys = args.personalities || Object.keys(PERSONALITIES);
      const views = {};

      for (const key of personalityKeys) {
        if (PERSONALITIES[key]) {
          const response = getPersonalityResponse(key, args.topic);
          const analysis = analyzeWithPersonality(key, { topic: args.topic });
          views[key] = {
            personality: response.personality,
            emoji: response.emoji,
            viewpoint: response.response,
            approach: analysis.analysis.approach,
            focus: analysis.analysis.focus
          };
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            topic: args.topic,
            contrasting_views: views,
            summary: `${Object.keys(views).length} different perspectives on the topic`,
            timestamp: new Date().toISOString()
          }, null, 2),
        }],
      };
    }

    case 'personality_vote': {
      const votes = {};
      const reasoning = {};

      for (const [key, personality] of Object.entries(PERSONALITIES)) {
        // Each personality votes based on their traits
        const randomIndex = Math.floor(Math.random() * args.options.length);
        let chosenOption = args.options[randomIndex];

        // Add some personality-based bias
        if (key === 'neko' && args.options.some(o => o.toLowerCase().includes('quick') || o.toLowerCase().includes('fast'))) {
          chosenOption = args.options.find(o => o.toLowerCase().includes('quick') || o.toLowerCase().includes('fast')) || chosenOption;
        } else if (key === 'noel' && args.options.some(o => o.toLowerCase().includes('careful') || o.toLowerCase().includes('thorough'))) {
          chosenOption = args.options.find(o => o.toLowerCase().includes('careful') || o.toLowerCase().includes('thorough')) || chosenOption;
        } else if (key === 'glam' && args.options.some(o => o.toLowerCase().includes('creative') || o.toLowerCase().includes('new'))) {
          chosenOption = args.options.find(o => o.toLowerCase().includes('creative') || o.toLowerCase().includes('new')) || chosenOption;
        }

        votes[personality.name] = chosenOption;
        reasoning[personality.name] = `${personality.emoji} Based on my ${personality.role}, I choose this option because it aligns with ${personality.specialty}`;
      }

      // Count votes
      const voteCounts = {};
      for (const option of args.options) {
        voteCounts[option] = Object.values(votes).filter(v => v === option).length;
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            question: args.question,
            options: args.options,
            votes: votes,
            reasoning: reasoning,
            vote_counts: voteCounts,
            winner: Object.entries(voteCounts).sort((a, b) => b[1] - a[1])[0][0],
            timestamp: new Date().toISOString()
          }, null, 2),
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

  console.error('🎭✨ Six Personalities MCP Server Started! ✨🎭');
  console.error('=====================================');
  console.error(`Version: 1.0.0`);
  console.error(`Personalities: ${Object.keys(PERSONALITIES).length}`);
  console.error('=====================================');
  console.error('Ready to provide diverse perspectives!');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});