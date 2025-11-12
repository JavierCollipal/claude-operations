#!/usr/bin/env node
/**
 * Get Enterprise Sprint 2.0 Status
 * Retrieves remaining phases and displays progress
 * Run this on session start to remind about pending work
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = 'enterprise-sprint-tracker';

async function getSprintStatus() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);

    // Get sprint metadata
    const metadata = await db.collection('sprint-metadata').findOne({
      sprintId: 'enterprise-sprint-2.0',
    });

    if (!metadata) {
      console.log('❌ No active enterprise sprint found.\n');
      return;
    }

    // Get pending phases
    const pendingPhases = await db
      .collection('sprint-phases')
      .find({ status: 'PENDING' })
      .sort({ phaseId: 1 })
      .toArray();

    // Get active reminders
    const reminders = await db
      .collection('reminders')
      .find({ isActive: true, expiresAt: { $gt: new Date() } })
      .toArray();

    // Get latest progress
    const latestProgress = await db
      .collection('sprint-progress')
      .find({ sprintId: 'enterprise-sprint-2.0' })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    // Display results
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🏢 ENTERPRISE SPRINT 2.0 - STATUS REPORT');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log(`📦 Project: ${metadata.project}`);
    console.log(`📊 Status: ${metadata.status}`);
    console.log(
      `📈 Progress: ${metadata.progress.completed}/${metadata.progress.total} phases (${metadata.progress.percentage.toFixed(1)}%)\n`,
    );

    console.log('✅ Completed Phases:');
    metadata.completedPhases.forEach((phase) => {
      console.log(`   - ${phase}`);
    });

    if (latestProgress.length > 0) {
      const latest = latestProgress[0];
      console.log(`\n💾 Latest Commit: ${latest.commit}`);
      console.log(`📝 Files Changed: ${latest.filesChanged}`);
      console.log(`➕ Lines Added: ${latest.linesAdded}`);
      if (latest.securityScore) {
        console.log(
          `🔐 Security Score: ${latest.securityScore.before}/100 → ${latest.securityScore.after}/100 (+${latest.securityScore.improvement.toFixed(2)})`,
        );
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`⏳ REMAINING PHASES (${pendingPhases.length})`);
    console.log('═══════════════════════════════════════════════════════════\n');

    let totalTime = 0;
    pendingPhases.forEach((phase, index) => {
      console.log(
        `${index + 1}. ${phase.name} (${phase.estimatedTime} min) - ${phase.priority}`,
      );
      console.log(`   Tasks: ${phase.tasks.length}`);
      console.log(`   Status: ${phase.status}\n`);
      totalTime += phase.estimatedTime;
    });

    console.log(`⏱️  Total Estimated Time: ${totalTime} minutes (${(totalTime / 60).toFixed(1)} hours)\n`);

    // Display active reminders
    if (reminders.length > 0) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('⏰ ACTIVE REMINDERS');
      console.log('═══════════════════════════════════════════════════════════\n');

      reminders.forEach((reminder) => {
        console.log(`📌 ${reminder.title}`);
        console.log(`   Priority: ${reminder.priority}`);
        console.log(`   ${reminder.message}\n`);
      });
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 QUICK COMMANDS');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('View phase details:');
    console.log('  node get-enterprise-sprint-phases.js <phase-number>\n');
    console.log('Continue sprint:');
    console.log('  Tell Claude: "Continue with Phase 2 of Enterprise Sprint"\n');
    console.log('Mark phase complete:');
    console.log('  node complete-enterprise-sprint-phase.js <phase-number>\n');

    console.log('🐾✨ Ready to continue enterprise transformation, nyaa~!\n');
  } catch (error) {
    console.error('❌ Error retrieving sprint status:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run the function
getSprintStatus();

export { getSprintStatus };
