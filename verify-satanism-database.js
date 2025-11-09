#!/usr/bin/env node

/**
 * Verify Satanism Research Data in MongoDB Cluster
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = 'satanism-on-chile-country-state-eleven-llm-digest';

async function verifyData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB Atlas');

    const db = client.db(DATABASE_NAME);
    const collection = db.collection('research-analysis');

    // Get document count
    const count = await collection.countDocuments();
    console.log(`📊 Documents in collection: ${count}`);

    // Get the research document
    const doc = await collection.findOne({ documentId: /research-aysén/ });

    if (doc) {
      console.log('✅ Research document found!');
      console.log(`📄 Document ID: ${doc._id}`);
      console.log(`🌍 Region: ${doc.region.name} (${doc.region.regionNumber})`);
      console.log(`📊 Documented Cases: ${doc.keyFindings.documentedCasesInAysén}`);
      console.log(`🔬 Forensic Evidence: ${doc.keyFindings.forensicEvidence}`);
      console.log(`🎭 Personalities: ${doc.metadata.researchTeam.length}`);
      console.log(`📅 Research Date: ${doc.researchDate}`);
      console.log(`\n💾 DATABASE STATUS: ✅ VERIFIED ON CLUSTER`);
    } else {
      console.log('❌ Research document not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

verifyData();
