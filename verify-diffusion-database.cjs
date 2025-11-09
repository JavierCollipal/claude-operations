#!/usr/bin/env node

/**
 * DINA Agent Diffusion Database Verification
 * Verifies database creation and displays summary statistics
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI not found in environment');
  process.exit(1);
}

const DATABASE_NAME = 'dina-agent-diffusion';

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('🐾✨ Connected to MongoDB Atlas for verification, nyaa~!\n');

    const db = client.db(DATABASE_NAME);

    // Get collections
    const platformsCollection = db.collection('diffusion-platforms');
    const strategiesCollection = db.collection('diffusion-strategies');

    // Count documents
    const platformsCount = await platformsCollection.countDocuments();
    const strategiesCount = await strategiesCollection.countDocuments();

    console.log('📊 DINA Agent Diffusion Database Verification');
    console.log('='.repeat(50));
    console.log(`Database: ${DATABASE_NAME}`);
    console.log(`Total Platforms: ${platformsCount}`);
    console.log(`Total Strategies: ${strategiesCount}`);
    console.log('');

    // Platform breakdown by status
    console.log('🔍 Platform Status Breakdown:');
    const selected = await platformsCollection.countDocuments({ status: 'selected' });
    const considered = await platformsCollection.countDocuments({ status: 'considered' });
    const rejected = await platformsCollection.countDocuments({ status: 'rejected' });
    console.log(`   ✅ Selected: ${selected}`);
    console.log(`   🤔 Considered: ${considered}`);
    console.log(`   ❌ Rejected: ${rejected}`);
    console.log('');

    // Selected platforms list
    console.log('⭐ Selected Platforms:');
    const selectedPlatforms = await platformsCollection.find({ status: 'selected' }).toArray();
    selectedPlatforms.forEach(p => {
      console.log(`   • ${p.name} (${p.category}/${p.subcategory}) - Priority: ${p.priority}`);
      console.log(`     ${p.description}`);
    });
    console.log('');

    // Rejected platforms with reasons
    console.log('❌ Rejected Platforms (Preserved for Future Reference):');
    const rejectedPlatforms = await platformsCollection.find({ status: 'rejected' }).toArray();
    rejectedPlatforms.forEach(p => {
      console.log(`   • ${p.name} - ${p.rejectionReason}`);
      if (p.revisitWhen) {
        console.log(`     Revisit: ${p.revisitWhen}`);
      }
    });
    console.log('');

    // Strategy breakdown
    console.log('📋 Selected Strategies:');
    const selectedStrategies = await strategiesCollection.find({ status: 'selected' }).toArray();
    selectedStrategies.forEach(s => {
      console.log(`   • ${s.name} - Priority: ${s.priority}`);
      console.log(`     ${s.description}`);
    });
    console.log('');

    // Query examples
    console.log('💡 Example Queries:');
    console.log('');
    console.log('// Find all high-priority selected platforms');
    console.log('db.getCollection("diffusion-platforms").find({ status: "selected", priority: "high" })');
    console.log('');
    console.log('// Find all rejected platforms to revisit later');
    console.log('db.getCollection("diffusion-platforms").find({ status: "rejected" })');
    console.log('');
    console.log('// Find all monetization platforms');
    console.log('db.getCollection("diffusion-platforms").find({ category: "monetization" })');
    console.log('');
    console.log('// Find all critical strategies');
    console.log('db.getCollection("diffusion-strategies").find({ priority: "critical" })');
    console.log('');

    console.log('✅ Verification complete! All data saved successfully, desu~!');
    console.log('🎸 ¡Glam: Todos los rechazos están guardados pa\' revisitar, weon!');

  } catch (error) {
    console.error('❌ Error verifying database:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
