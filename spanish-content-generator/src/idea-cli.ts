#!/usr/bin/env ts-node

/**
 * Idea Tracker CLI
 *
 * Command-line interface for managing content ideas
 * and identifying gaps in Spanish educational content
 *
 * @author Glam Americano
 */

import { Command } from 'commander';
import { IdeaTracker, ContentGap, ContentIdea } from './IdeaTracker';
import dotenv from 'dotenv';
import path from 'path';
import chalk from 'chalk';

const rootDir = process.cwd();

dotenv.config({ path: path.join(rootDir, '../../../.env') });

const program = new Command();
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error(chalk.red('❌ MONGODB_URI not found in environment variables'));
  process.exit(1);
}

const tracker = new IdeaTracker(mongoUri);

program
  .name('idea-tracker')
  .description('🎸 Glam Americano - Content Idea Tracker & Gap Analyzer')
  .version('1.0.0');

// Analyze covered topics
program
  .command('analyze')
  .description('Analyze topics already covered in existing posts')
  .action(async () => {
    console.log(chalk.yellow('🔍 Analyzing covered topics...'));
    console.log('='.repeat(80));

    const topics = await tracker.analyzeCoveredTopics();

    console.log(chalk.green(`\n✅ Found ${topics.length} covered topics\n`));

    // Group by category
    const byCategory = topics.reduce((acc, topic) => {
      if (!acc[topic.category]) acc[topic.category] = [];
      acc[topic.category].push(topic);
      return acc;
    }, {} as Record<string, typeof topics>);

    for (const [category, categoryTopics] of Object.entries(byCategory)) {
      console.log(chalk.cyan(`\n📂 ${category}:`));
      console.log('─'.repeat(80));

      for (const topic of categoryTopics) {
        console.log(`  • ${topic.keyword} (${topic.occurrences} occurrences)`);
      }
    }

    console.log('\n' + '='.repeat(80));
  });

// Identify gaps
program
  .command('gaps')
  .description('Identify content gaps - topics not yet covered')
  .option('-p, --priority <level>', 'Filter by priority (high, medium, low)')
  .option('-c, --category <category>', 'Filter by category')
  .action(async (options) => {
    console.log(chalk.yellow('🔍 Identifying content gaps...'));
    console.log('='.repeat(80));

    let gaps = await tracker.identifyContentGaps();

    // Apply filters
    if (options.priority) {
      gaps = gaps.filter(g => g.priority === options.priority);
    }

    if (options.category) {
      gaps = gaps.filter(g => g.category.toLowerCase().includes(options.category.toLowerCase()));
    }

    console.log(chalk.green(`\n✅ Found ${gaps.length} content gaps\n`));

    // Group by priority
    const byPriority = {
      high: gaps.filter(g => g.priority === 'high'),
      medium: gaps.filter(g => g.priority === 'medium'),
      low: gaps.filter(g => g.priority === 'low')
    };

    for (const [priority, priorityGaps] of Object.entries(byPriority)) {
      if (priorityGaps.length === 0) continue;

      const color = priority === 'high' ? chalk.red : priority === 'medium' ? chalk.yellow : chalk.gray;
      console.log(color(`\n🎯 ${priority.toUpperCase()} Priority (${priorityGaps.length} gaps):`));
      console.log('─'.repeat(80));

      for (const gap of priorityGaps) {
        console.log(color(`\n  📌 ${gap.topic}`));
        console.log(`     Category: ${gap.category}`);
        if (gap.claudeRule) {
          console.log(`     Rule: ${gap.claudeRule}`);
        }
        console.log(`     Suggested Title: ${gap.suggestedTitle}`);
        console.log(`     Outline:`);
        gap.suggestedOutline.forEach((item, i) => {
          console.log(`       ${i + 1}. ${item}`);
        });
        if (gap.relatedTopics.length > 0) {
          console.log(`     Related: ${gap.relatedTopics.join(', ')}`);
        }
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(chalk.green(`\n💡 Use 'idea-tracker create <topic>' to generate a series from a gap`));
  });

// Check if idea exists
program
  .command('check <topics...>')
  .description('Check if an idea already exists for given topics')
  .action(async (topics: string[]) => {
    console.log(chalk.yellow(`🔍 Checking if idea exists for: ${topics.join(', ')}`));

    const exists = await tracker.ideaExists(topics);

    if (exists) {
      console.log(chalk.red(`\n❌ An idea already exists covering these topics`));
    } else {
      console.log(chalk.green(`\n✅ No existing idea found - this is a new topic!`));
    }
  });

// Create new idea from gap
program
  .command('create <topic>')
  .description('Create a new content idea from an identified gap')
  .action(async (topicName: string) => {
    console.log(chalk.yellow(`🎨 Creating new idea for: ${topicName}`));

    const gaps = await tracker.identifyContentGaps();
    const gap = gaps.find(g => g.topic.toLowerCase().includes(topicName.toLowerCase()));

    if (!gap) {
      console.log(chalk.red(`\n❌ Gap not found for topic: ${topicName}`));
      console.log(chalk.yellow(`\nAvailable gaps:`));
      gaps.forEach(g => console.log(`  • ${g.topic}`));
      return;
    }

    try {
      const idea = await tracker.generateSeriesFromGap(gap);
      const ideaId = await tracker.saveContentIdea(idea);

      console.log(chalk.green(`\n✅ Idea created successfully!`));
      console.log('='.repeat(80));
      console.log(chalk.cyan(`Idea ID: ${ideaId}`));
      console.log(`Title: ${idea.title}`);
      console.log(`Category: ${idea.category}`);
      console.log(`Topics: ${idea.topics.join(', ')}`);
      console.log(`Estimated Posts: ${idea.estimatedPosts}`);
      console.log(`Complexity: ${idea.complexity}`);
      console.log(`Status: ${idea.status}`);
      console.log('='.repeat(80));

    } catch (error) {
      if (error instanceof Error) {
        console.log(chalk.red(`\n❌ ${error.message}`));
      }
    }
  });

// List all ideas
program
  .command('list')
  .description('List all content ideas')
  .option('-s, --status <status>', 'Filter by status (idea, in-progress, completed)')
  .action(async (options) => {
    console.log(chalk.yellow('📋 Listing all content ideas...'));
    console.log('='.repeat(80));

    let ideas = await tracker.getAllIdeas();

    if (options.status) {
      ideas = ideas.filter(i => i.status === options.status);
    }

    if (ideas.length === 0) {
      console.log(chalk.gray('\nNo ideas found.'));
      return;
    }

    // Group by status
    const byStatus = {
      idea: ideas.filter(i => i.status === 'idea'),
      'in-progress': ideas.filter(i => i.status === 'in-progress'),
      completed: ideas.filter(i => i.status === 'completed')
    };

    for (const [status, statusIdeas] of Object.entries(byStatus)) {
      if (statusIdeas.length === 0) continue;

      const color = status === 'completed' ? chalk.green : status === 'in-progress' ? chalk.yellow : chalk.cyan;
      console.log(color(`\n${status.toUpperCase()} (${statusIdeas.length}):`));
      console.log('─'.repeat(80));

      for (const idea of statusIdeas) {
        console.log(color(`\n  📝 ${idea.title}`));
        console.log(`     ID: ${idea.ideaId}`);
        console.log(`     Category: ${idea.category}`);
        console.log(`     Topics: ${idea.topics.join(', ')}`);
        console.log(`     Posts: ${idea.estimatedPosts}`);
        console.log(`     Complexity: ${idea.complexity}`);
        console.log(`     Created: ${idea.createdAt.toISOString().split('T')[0]}`);
        if (idea.completedAt) {
          console.log(`     Completed: ${idea.completedAt.toISOString().split('T')[0]}`);
        }
      }
    }

    console.log('\n' + '='.repeat(80));
  });

// Report command - comprehensive overview
program
  .command('report')
  .description('Generate comprehensive content tracking report')
  .action(async () => {
    console.log(chalk.yellow('📊 Generating Content Tracking Report...'));
    console.log('='.repeat(80));

    const [covered, gaps, ideas] = await Promise.all([
      tracker.analyzeCoveredTopics(),
      tracker.identifyContentGaps(),
      tracker.getAllIdeas()
    ]);

    console.log(chalk.cyan('\n📈 CONTENT STATISTICS'));
    console.log('─'.repeat(80));
    console.log(`Topics Covered: ${covered.length}`);
    console.log(`Content Gaps: ${gaps.length}`);
    console.log(`Ideas Generated: ${ideas.length}`);

    const gapsByPriority = {
      high: gaps.filter(g => g.priority === 'high').length,
      medium: gaps.filter(g => g.priority === 'medium').length,
      low: gaps.filter(g => g.priority === 'low').length
    };

    console.log(chalk.cyan('\n🎯 GAPS BY PRIORITY'));
    console.log('─'.repeat(80));
    console.log(chalk.red(`High: ${gapsByPriority.high}`));
    console.log(chalk.yellow(`Medium: ${gapsByPriority.medium}`));
    console.log(chalk.gray(`Low: ${gapsByPriority.low}`));

    const ideasByStatus = {
      idea: ideas.filter(i => i.status === 'idea').length,
      'in-progress': ideas.filter(i => i.status === 'in-progress').length,
      completed: ideas.filter(i => i.status === 'completed').length
    };

    console.log(chalk.cyan('\n💡 IDEAS BY STATUS'));
    console.log('─'.repeat(80));
    console.log(chalk.cyan(`Ideas: ${ideasByStatus.idea}`));
    console.log(chalk.yellow(`In Progress: ${ideasByStatus['in-progress']}`));
    console.log(chalk.green(`Completed: ${ideasByStatus.completed}`));

    console.log(chalk.cyan('\n🔝 TOP 5 HIGH PRIORITY GAPS'));
    console.log('─'.repeat(80));
    gaps
      .filter(g => g.priority === 'high')
      .slice(0, 5)
      .forEach((gap, i) => {
        console.log(chalk.red(`${i + 1}. ${gap.topic} (${gap.category})`));
      });

    console.log('\n' + '='.repeat(80));
    console.log(chalk.green('🎸 Report complete! Use other commands to take action.'));
  });

program.parse();
