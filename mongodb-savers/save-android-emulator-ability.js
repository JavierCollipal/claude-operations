#!/usr/bin/env node

// Save Android Emulator White Hat Research Ability to MongoDB
// Created by Neko-Arc for wakibaka, nyaa~! 🐾

const { MongoClient } = require('mongodb');
require('dotenv').config();

const abilityData = {
  ability_name: "android-emulator-whitehat-research",
  version: "1.0.0",
  created_date: new Date(),
  created_by: "Neko-Arc",
  category: "security-research",
  description: "Complete Android emulator setup for terminal-based security research and ethical hacking",

  components: {
    java_version: "17.0.9",
    android_sdk_version: "34",
    emulator_version: "36.2.12.0",
    kvm_enabled: true,
    device_configuration: "Pixel 5",
    api_level: 34,
    system_image: "google_apis/x86_64"
  },

  installation_paths: {
    java_home: "$HOME/.local/share/jdk-17.0.9+9",
    android_home: "$HOME/Android/Sdk",
    emulator: "$HOME/Android/Sdk/emulator",
    platform_tools: "$HOME/Android/Sdk/platform-tools"
  },

  security_tools: [
    "adb",
    "tcpdump",
    "frida",
    "jadx",
    "apktool",
    "mitmproxy",
    "burpsuite"
  ],

  usage_scenarios: [
    "penetration_testing",
    "app_security_analysis",
    "network_traffic_analysis",
    "reverse_engineering",
    "vulnerability_research",
    "malware_analysis",
    "privacy_auditing",
    "certificate_pinning_bypass",
    "api_security_testing"
  ],

  ethical_guidelines: {
    authorized_only: true,
    educational_purpose: true,
    respect_privacy: true,
    follow_laws: true,
    responsible_disclosure: true,
    no_malicious_use: true
  },

  key_features: [
    "Hardware acceleration with KVM",
    "No root required for installation",
    "Portable JDK (no sudo needed)",
    "Full Google Play Services",
    "Terminal-based control",
    "Automated setup scripts",
    "Security research focused"
  ],

  commands_reference: {
    basic: {
      launch_emulator: "emulator -avd dev_phone",
      list_devices: "adb devices",
      install_app: "adb install app.apk",
      take_screenshot: "adb exec-out screencap -p > screenshot.png"
    },
    security: {
      extract_apk: "adb shell pm path <package> && adb pull <path>",
      capture_traffic: "adb shell tcpdump -i any -w /sdcard/capture.pcap",
      check_permissions: "adb shell dumpsys package <package> | grep permission",
      monitor_logs: "adb logcat | grep -E 'SSL|TLS|crypto|password'"
    },
    forensics: {
      extract_databases: "adb pull /data/data/<package>/databases/",
      system_info: "adb shell getprop",
      memory_dump: "adb shell dumpsys meminfo",
      running_processes: "adb shell ps -A"
    },
    reverse_engineering: {
      decompile_apk: "jadx -d output_dir app.apk",
      extract_resources: "apktool d app.apk",
      search_secrets: "grep -r 'api_key|password|secret' decompiled/",
      check_security: "grep -r 'MODE_WORLD_READABLE|MODE_WORLD_WRITEABLE' decompiled/"
    }
  },

  setup_scripts: [
    "setup-android-emulator.sh",
    "android-emulator-launch.sh",
    "android-sdk-auto-setup.sh",
    "enable-kvm-for-android.sh"
  ],

  performance_specs: {
    ram_usage: "2-4GB when running",
    disk_space: "~10GB for full setup",
    boot_time: "1-2 minutes first boot",
    cpu_acceleration: "Intel VT-x / AMD-V required"
  },

  metadata: {
    documentation_path: "/home/wakibaka/Documents/github/claude-operations/abilities/android-emulator-whitehat-research-ability.md",
    github_repo: "https://github.com/JavierCollipal/claude-operations",
    last_tested: new Date(),
    status: "active",
    effectiveness: "production-ready"
  }
};

async function saveAbility() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables!');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log('🐾 Connecting to MongoDB Atlas, nyaa~!');
    await client.connect();

    const database = client.db('neko-abilities');
    const collection = database.collection('security-research-abilities');

    // Check if ability already exists
    const existing = await collection.findOne({ ability_name: abilityData.ability_name });

    if (existing) {
      console.log('📝 Ability exists, updating...');
      const result = await collection.replaceOne(
        { ability_name: abilityData.ability_name },
        abilityData
      );
      console.log(`✅ Updated ability: ${result.modifiedCount} document modified`);
    } else {
      console.log('✨ Creating new ability...');
      const result = await collection.insertOne(abilityData);
      console.log(`✅ Created ability with ID: ${result.insertedId}`);
    }

    // Also save to main abilities collection
    const mainCollection = database.collection('all-abilities');
    await mainCollection.replaceOne(
      { ability_name: abilityData.ability_name },
      abilityData,
      { upsert: true }
    );

    console.log('🎉 Android Emulator White Hat Research Ability saved successfully, nyaa~!');
    console.log(`📊 Database: neko-abilities`);
    console.log(`📁 Collections: security-research-abilities, all-abilities`);

  } catch (error) {
    console.error('❌ Error saving ability:', error);
  } finally {
    await client.close();
    console.log('🔒 Connection closed, desu~!');
  }
}

// Run the save operation
saveAbility().catch(console.error);