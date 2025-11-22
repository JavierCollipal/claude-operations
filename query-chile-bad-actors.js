#!/usr/bin/env node
/**
 * CHILE BAD ACTOR DATABASE - QUERY UTILITIES
 * Query perpetrators, victims, and detention centers
 *
 * Usage:
 *   node query-chile-bad-actors.js                    # Show all bad actors
 *   node query-chile-bad-actors.js --unprosecuted    # Show unprosecuted only
 *   node query-chile-bad-actors.js --imprisoned      # Show currently imprisoned
 *   node query-chile-bad-actors.js --aysen           # Show Aysén region only
 *   node query-chile-bad-actors.js --victims         # Show victims
 *   node query-chile-bad-actors.js --centers         # Show detention centers
 *   node query-chile-bad-actors.js --stats           # Show statistics
 *   node query-chile-bad-actors.js --search <name>   # Search by name
 */

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gatomaestrorevised:gaborevised@free-cluster.svjei3w.mongodb.net/';
const DB_NAME = 'neko-defense-system';

async function queryBadActors(filter = {}) {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('chile-bad-actors');
    return await collection.find(filter).toArray();
  } finally {
    await client.close();
  }
}

async function queryVictims(filter = {}) {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('chile-victims');
    return await collection.find(filter).toArray();
  } finally {
    await client.close();
  }
}

async function queryCenters(filter = {}) {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('chile-detention-centers');
    return await collection.find(filter).toArray();
  } finally {
    await client.close();
  }
}

async function queryStats() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('chile-statistics');
    return await collection.findOne({});
  } finally {
    await client.close();
  }
}

function printBadActor(actor) {
  console.log('─'.repeat(60));
  console.log(`🎯 ${actor.fullName || actor.alias}`);
  console.log(`   ID: ${actor.id}`);
  console.log(`   Organization: ${actor.organization}`);
  console.log(`   Position: ${actor.position}`);
  console.log(`   Status: ${actor.status}`);
  console.log(`   Prosecution: ${actor.prosecutionStatus}`);
  if (actor.rut) console.log(`   RUT: ${actor.rut}`);
  if (actor.region) console.log(`   Region: ${actor.region}`);
  if (actor.tier !== undefined) console.log(`   Tier: ${actor.tier}`);
  if (actor.priority) console.log(`   Priority: ${actor.priority}`);
  if (actor.totalSentence) console.log(`   Sentence: ${actor.totalSentence}`);
  if (actor.crimes) console.log(`   Crimes: ${actor.crimes.join(', ')}`);
}

function printVictim(victim) {
  console.log('─'.repeat(60));
  console.log(`⚰️ ${victim.fullName}`);
  console.log(`   Status: ${victim.status}`);
  console.log(`   Date: ${victim.date}`);
  console.log(`   Location: ${victim.location}`);
  if (victim.occupation) console.log(`   Occupation: ${victim.occupation}`);
  if (victim.perpetrators) console.log(`   Perpetrators: ${victim.perpetrators.join(', ')}`);
}

function printCenter(center) {
  console.log('─'.repeat(60));
  console.log(`🏛️ ${center.name}`);
  console.log(`   Location: ${center.location}`);
  console.log(`   Period: ${center.period}`);
  console.log(`   Organization: ${center.organization}`);
  if (center.commander) console.log(`   Commander: ${center.commander}`);
  if (center.prisonersProcessed) console.log(`   Prisoners: ${center.prisonersProcessed}`);
  console.log(`   Significance: ${center.significance}`);
}

async function main() {
  const args = process.argv.slice(2);

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🐾 CHILE BAD ACTOR DATABASE - QUERY RESULTS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  if (args.includes('--stats')) {
    const stats = await queryStats();
    console.log('📊 STATISTICS');
    console.log('─'.repeat(60));
    console.log(`   DINA Agents Total: ${stats.dinaAgentsTotal}`);
    console.log(`   DINA Agents Prosecuted: ${stats.dinaAgentsProsecuted}`);
    console.log(`   DINA Agents Unprosecuted: ${stats.dinaAgentsUnprosecuted}`);
    console.log(`   Impunity Rate: ${stats.impunityRate}`);
    console.log(`   Valech Victims: ${stats.valechVictims}`);
    console.log(`   Valech Secrecy Until: ${stats.valechSecrecyUntil}`);
    console.log(`   Mass Conviction 2023: ${stats.massConviction2023} agents`);
    console.log(`   Disappeared (National): ${stats.disappearedNational}`);
    console.log(`   Executed (National): ${stats.executedNational}`);
    return;
  }

  if (args.includes('--victims')) {
    const victims = await queryVictims();
    console.log(`⚰️ VICTIMS (${victims.length} total)`);
    victims.forEach(printVictim);
    return;
  }

  if (args.includes('--centers')) {
    const centers = await queryCenters();
    console.log(`🏛️ DETENTION CENTERS (${centers.length} total)`);
    centers.forEach(printCenter);
    return;
  }

  let filter = {};

  if (args.includes('--unprosecuted')) {
    filter.prosecutionStatus = 'UNPROSECUTED';
    console.log('🔴 UNPROSECUTED BAD ACTORS');
  } else if (args.includes('--imprisoned')) {
    filter.status = 'IMPRISONED';
    console.log('🔒 CURRENTLY IMPRISONED');
  } else if (args.includes('--aysen')) {
    filter.region = { $regex: /Aysén/i };
    console.log('🗺️ AYSÉN REGION PERPETRATORS');
  } else if (args.includes('--search')) {
    const searchIdx = args.indexOf('--search');
    const searchTerm = args[searchIdx + 1];
    if (searchTerm) {
      filter.$or = [
        { fullName: { $regex: searchTerm, $options: 'i' } },
        { alias: { $regex: searchTerm, $options: 'i' } }
      ];
      console.log(`🔍 SEARCH RESULTS: "${searchTerm}"`);
    }
  } else {
    console.log('🎯 ALL BAD ACTORS');
  }

  const actors = await queryBadActors(filter);
  console.log(`   Found: ${actors.length} records`);
  console.log('');

  actors.forEach(printBadActor);

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🐾 Query complete, nyaa~!');
}

main().catch(console.error);
