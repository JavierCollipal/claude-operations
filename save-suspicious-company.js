#!/usr/bin/env node
/**
 * 🚩 SUSPICIOUS COMPANY DATABASE SAVER 🚩
 *
 * Saves suspicious company investigations to MongoDB Atlas
 *
 * Database: hannibal-forensic-archives
 * Collection: suspicious-companies
 *
 * Usage:
 *   node save-suspicious-company.js <path-to-json-file>
 *
 * Example:
 *   node save-suspicious-company.js companies/rampane-spa-investigation.json
 */

import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = 'hannibal-forensic-archives';
const COLLECTION_NAME = 'suspicious-companies';

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI not found in environment variables!');
  console.error('Please ensure .env file exists with MONGODB_URI');
  process.exit(1);
}

async function saveSuspiciousCompany(jsonFilePath) {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected successfully!');

    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Read JSON file
    const fullPath = path.resolve(__dirname, jsonFilePath);
    console.log(`📄 Reading file: ${fullPath}`);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }

    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const companyData = JSON.parse(fileContent);

    // Convert date strings to Date objects
    console.log('📅 Converting date strings to Date objects...');
    convertDates(companyData);

    // Check if company already exists
    const existingCompany = await collection.findOne({
      companyId: companyData.companyId
    });

    if (existingCompany) {
      console.log('⚠️  Company already exists. Updating...');
      const result = await collection.replaceOne(
        { companyId: companyData.companyId },
        companyData
      );
      console.log(`✅ Company updated! Modified: ${result.modifiedCount}`);
    } else {
      console.log('💾 Inserting new company...');
      const result = await collection.insertOne(companyData);
      console.log(`✅ Company saved! ID: ${result.insertedId}`);
    }

    // Display summary
    console.log('\n🚩 === SUSPICIOUS COMPANY SAVED === 🚩');
    console.log(`📛 Legal Name: ${companyData.legalName}`);
    console.log(`🆔 Company ID: ${companyData.companyId}`);
    console.log(`⚠️  Risk Level: ${companyData.riskLevel}`);
    console.log(`📊 Threat Score: ${companyData.overallThreatScore}/100`);
    console.log(`🚩 Red Flags: ${companyData.redFlags.length}`);
    console.log(`🔍 Investigation Status: ${companyData.investigationStatus}`);
    console.log(`👥 Investigated By: ${companyData.investigatedBy.join(', ')}`);

    console.log('\n🚩 Red Flags Summary:');
    companyData.redFlags.forEach((flag, index) => {
      const severityEmoji = {
        'CRITICAL': '🔴',
        'WARNING': '🟡',
        'INFO': '🔵'
      };
      console.log(`  ${index + 1}. ${severityEmoji[flag.severity]} [${flag.severity}] ${flag.title}`);
    });

    console.log(`\n✅ Saved to: ${DATABASE_NAME}.${COLLECTION_NAME}`);

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Connection closed.');
  }
}

function convertDates(obj) {
  for (const key in obj) {
    if (obj[key] !== null && typeof obj[key] === 'object') {
      convertDates(obj[key]);
    } else if (typeof obj[key] === 'string' && isISODateString(obj[key])) {
      obj[key] = new Date(obj[key]);
    }
  }
}

function isISODateString(str) {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  return isoDateRegex.test(str);
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Usage: node save-suspicious-company.js <path-to-json-file>');
  console.error('Example: node save-suspicious-company.js companies/rampane-spa-investigation.json');
  process.exit(1);
}

const jsonFilePath = args[0];
saveSuspiciousCompany(jsonFilePath)
  .then(() => {
    console.log('\n🎯 Operation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Operation failed!');
    process.exit(1);
  });
