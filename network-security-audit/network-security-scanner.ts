#!/usr/bin/env ts-node
/**
 * NEKO-ARC NETWORK SECURITY AUDIT SYSTEM v1.0.0
 * IMMUTABLE RULE 36 IMPLEMENTATION
 * Advanced vulnerability detection with CVE integration
 * @author Neko-Arc Defense System
 * @date 2025-11-08
 */

import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

// Vulnerability thresholds (IMMUTABLE per Rule 36)
const SECURITY_THRESHOLDS = {
  SSH_CRITICAL_YEAR: 2022,
  HTTP_RISK_LEVEL: 'HIGH',
  UNKNOWN_PORT_ACTION: 'INVESTIGATE',
  NEW_MAC_ACTION: 'ALERT',
  FAILED_ARP_ACTION: 'POTENTIAL_ATTACK'
} as const;

// Common vulnerable ports to scan
const VULNERABLE_PORTS = [
  { port: 21, service: 'FTP', risk: 'HIGH' },
  { port: 22, service: 'SSH', risk: 'CRITICAL' },
  { port: 23, service: 'Telnet', risk: 'CRITICAL' },
  { port: 25, service: 'SMTP', risk: 'MEDIUM' },
  { port: 53, service: 'DNS', risk: 'LOW' },
  { port: 80, service: 'HTTP', risk: 'HIGH' },
  { port: 110, service: 'POP3', risk: 'MEDIUM' },
  { port: 135, service: 'RPC', risk: 'HIGH' },
  { port: 139, service: 'NetBIOS', risk: 'HIGH' },
  { port: 443, service: 'HTTPS', risk: 'LOW' },
  { port: 445, service: 'SMB', risk: 'CRITICAL' },
  { port: 1433, service: 'MSSQL', risk: 'HIGH' },
  { port: 1521, service: 'Oracle', risk: 'HIGH' },
  { port: 3306, service: 'MySQL', risk: 'HIGH' },
  { port: 3389, service: 'RDP', risk: 'CRITICAL' },
  { port: 5432, service: 'PostgreSQL', risk: 'HIGH' },
  { port: 5900, service: 'VNC', risk: 'CRITICAL' },
  { port: 6379, service: 'Redis', risk: 'HIGH' },
  { port: 8080, service: 'HTTP-Alt', risk: 'MEDIUM' },
  { port: 8443, service: 'HTTPS-Alt', risk: 'LOW' },
  { port: 27017, service: 'MongoDB', risk: 'HIGH' }
];

// Known CVE patterns for common router vulnerabilities
const CVE_PATTERNS = {
  'dropbear_2019': {
    pattern: /dropbear.*2019/i,
    cves: ['CVE-2021-36369', 'CVE-2020-12695'],
    risk: 'CRITICAL',
    description: 'Authentication bypass and information disclosure'
  },
  'dropbear_2020': {
    pattern: /dropbear.*2020/i,
    cves: ['CVE-2021-36369'],
    risk: 'HIGH',
    description: 'Authentication bypass vulnerability'
  },
  'micro_httpd': {
    pattern: /micro_httpd/i,
    cves: ['CVE-2017-10708'],
    risk: 'MEDIUM',
    description: 'Buffer overflow vulnerability'
  },
  'dnsmasq_old': {
    pattern: /dnsmasq.*2\.[0-7]/i,
    cves: ['CVE-2017-14491', 'CVE-2017-14492'],
    risk: 'CRITICAL',
    description: 'Remote code execution'
  }
};

interface ScanResult {
  timestamp: Date;
  routerIp: string;
  openPorts: Array<{ port: number; service: string; risk: string }>;
  vulnerabilities: Array<{
    type: string;
    cves: string[];
    risk: string;
    description: string;
  }>;
  connectedDevices: Array<{
    ip: string;
    mac: string;
    status: string;
    suspicious: boolean;
  }>;
  dnsServers: string[];
  activeConnections: number;
  securityScore: number;
  recommendations: string[];
}

class NetworkSecurityScanner {
  private routerIp: string;
  private scanResult: ScanResult;
  private mongoClient: MongoClient | null = null;

  constructor(routerIp: string = '192.168.1.1') {
    this.routerIp = routerIp;
    this.scanResult = {
      timestamp: new Date(),
      routerIp: routerIp,
      openPorts: [],
      vulnerabilities: [],
      connectedDevices: [],
      dnsServers: [],
      activeConnections: 0,
      securityScore: 100,
      recommendations: []
    };
  }

  /**
   * Main audit execution
   */
  async performAudit(): Promise<ScanResult> {
    console.log('🐾 NEKO-ARC NETWORK SECURITY AUDIT SYSTEM v1.0.0');
    console.log('✨ Starting comprehensive security scan, nyaa~!');
    console.log(`🎯 Target Router: ${this.routerIp}`);
    console.log('━'.repeat(50));

    // Execute all scanning phases
    await this.scanPorts();
    await this.checkSSHVersion();
    await this.analyzeNetworkDevices();
    await this.checkDNSConfiguration();
    await this.analyzeActiveConnections();
    await this.checkFirewallStatus();

    // Calculate final security score
    this.calculateSecurityScore();

    // Generate recommendations
    this.generateRecommendations();

    // Save to MongoDB if configured
    if (process.env.MONGODB_URI) {
      await this.saveToMongoDB();
    }

    // Generate report
    await this.generateReport();

    return this.scanResult;
  }

  /**
   * Port scanning without sudo
   */
  private async scanPorts(): Promise<void> {
    console.log('\n📡 Phase 1: Port Scanning...');

    for (const portInfo of VULNERABLE_PORTS) {
      const isOpen = await this.checkPort(this.routerIp, portInfo.port);
      if (isOpen) {
        console.log(`  ⚠️ Port ${portInfo.port} (${portInfo.service}): OPEN - Risk: ${portInfo.risk}`);
        this.scanResult.openPorts.push(portInfo);

        // Deduct points based on risk
        if (portInfo.risk === 'CRITICAL') this.scanResult.securityScore -= 20;
        else if (portInfo.risk === 'HIGH') this.scanResult.securityScore -= 10;
        else if (portInfo.risk === 'MEDIUM') this.scanResult.securityScore -= 5;
      }
    }

    console.log(`  ✅ Found ${this.scanResult.openPorts.length} open ports`);
  }

  /**
   * Check if a port is open
   */
  private async checkPort(ip: string, port: number): Promise<boolean> {
    try {
      const { stdout, stderr } = await execAsync(
        `timeout 1 bash -c "echo >/dev/tcp/${ip}/${port}" 2>&1`,
        { timeout: 2000 }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check SSH version for vulnerabilities
   */
  private async checkSSHVersion(): Promise<void> {
    console.log('\n🔐 Phase 2: SSH Version Analysis...');

    try {
      const { stdout } = await execAsync(
        `echo "" | nc -w 2 ${this.routerIp} 22 2>/dev/null | head -1`,
        { timeout: 3000 }
      );

      if (stdout) {
        console.log(`  📋 SSH Banner: ${stdout.trim()}`);

        // Check against known vulnerable patterns
        for (const [key, vulnInfo] of Object.entries(CVE_PATTERNS)) {
          if (vulnInfo.pattern.test(stdout)) {
            console.log(`  🔴 VULNERABILITY DETECTED: ${vulnInfo.description}`);
            console.log(`  🔴 CVEs: ${vulnInfo.cves.join(', ')}`);

            this.scanResult.vulnerabilities.push({
              type: key,
              cves: vulnInfo.cves,
              risk: vulnInfo.risk,
              description: vulnInfo.description
            });

            if (vulnInfo.risk === 'CRITICAL') {
              this.scanResult.securityScore -= 30;
            }
          }
        }
      }
    } catch (error) {
      console.log('  ℹ️ SSH port not accessible or banner hidden');
    }
  }

  /**
   * Analyze connected network devices
   */
  private async analyzeNetworkDevices(): Promise<void> {
    console.log('\n🖥️ Phase 3: Network Device Analysis...');

    try {
      const { stdout } = await execAsync('ip neigh show');
      const lines = stdout.trim().split('\n');

      for (const line of lines) {
        const match = line.match(/^(\S+)\s+dev\s+(\S+)\s+lladdr\s+(\S+)\s+(\S+)/);
        if (match) {
          const [, ip, dev, mac, status] = match;

          // Check if this is a suspicious device
          const suspicious = status === 'FAILED' || status === 'INCOMPLETE';

          this.scanResult.connectedDevices.push({
            ip,
            mac,
            status,
            suspicious
          });

          if (suspicious) {
            console.log(`  ⚠️ Suspicious device: ${ip} (${mac}) - Status: ${status}`);
            this.scanResult.securityScore -= 5;
          }
        }
      }

      console.log(`  ✅ Found ${this.scanResult.connectedDevices.length} connected devices`);
      const suspiciousCount = this.scanResult.connectedDevices.filter(d => d.suspicious).length;
      if (suspiciousCount > 0) {
        console.log(`  ⚠️ ${suspiciousCount} suspicious devices detected!`);
      }
    } catch (error) {
      console.log('  ❌ Failed to analyze network devices');
    }
  }

  /**
   * Check DNS configuration
   */
  private async checkDNSConfiguration(): Promise<void> {
    console.log('\n🌐 Phase 4: DNS Configuration Check...');

    try {
      const { stdout } = await execAsync('resolvectl status 2>/dev/null | grep "DNS Servers" || systemd-resolve --status 2>/dev/null | grep "DNS Servers"');
      const dnsMatch = stdout.match(/DNS Servers:\s*(.*)/);

      if (dnsMatch) {
        this.scanResult.dnsServers = dnsMatch[1].split(/\s+/);
        console.log(`  ✅ DNS Servers: ${this.scanResult.dnsServers.join(', ')}`);

        // Check for suspicious DNS servers
        const suspiciousDns = this.scanResult.dnsServers.filter(
          dns => !dns.match(/^(8\.8\.|1\.1\.|200\.28\.|192\.168\.|10\.|172\.)/)
        );

        if (suspiciousDns.length > 0) {
          console.log(`  ⚠️ Potentially suspicious DNS servers: ${suspiciousDns.join(', ')}`);
          this.scanResult.securityScore -= 10;
        }
      }
    } catch (error) {
      console.log('  ℹ️ Could not determine DNS configuration');
    }
  }

  /**
   * Analyze active network connections
   */
  private async analyzeActiveConnections(): Promise<void> {
    console.log('\n🔗 Phase 5: Active Connection Analysis...');

    try {
      const { stdout } = await execAsync('ss -tun | grep ESTAB | wc -l');
      this.scanResult.activeConnections = parseInt(stdout.trim());

      console.log(`  ✅ Active connections: ${this.scanResult.activeConnections}`);

      if (this.scanResult.activeConnections > 50) {
        console.log('  ⚠️ Unusually high number of connections detected!');
        this.scanResult.securityScore -= 10;
      }
    } catch (error) {
      console.log('  ❌ Failed to analyze active connections');
    }
  }

  /**
   * Check firewall status
   */
  private async checkFirewallStatus(): Promise<void> {
    console.log('\n🛡️ Phase 6: Firewall Status Check...');

    try {
      const { stdout } = await execAsync('ufw status 2>/dev/null || echo "No firewall"');

      if (stdout.includes('inactive') || stdout.includes('No firewall')) {
        console.log('  🔴 WARNING: No active firewall detected!');
        this.scanResult.securityScore -= 20;
        this.scanResult.recommendations.push('Enable UFW firewall immediately');
      } else if (stdout.includes('active')) {
        console.log('  ✅ Firewall is active');
      }
    } catch (error) {
      console.log('  ℹ️ Could not determine firewall status');
    }
  }

  /**
   * Calculate final security score
   */
  private calculateSecurityScore(): void {
    // Ensure score doesn't go below 0
    this.scanResult.securityScore = Math.max(0, this.scanResult.securityScore);

    console.log('\n📊 Security Score Calculation:');
    console.log(`  Final Score: ${this.scanResult.securityScore}/100`);

    let rating: string;
    if (this.scanResult.securityScore >= 80) rating = '✅ SECURE';
    else if (this.scanResult.securityScore >= 60) rating = '🟡 MODERATE RISK';
    else if (this.scanResult.securityScore >= 40) rating = '🟠 HIGH RISK';
    else rating = '🔴 CRITICAL RISK';

    console.log(`  Rating: ${rating}`);
  }

  /**
   * Generate security recommendations
   */
  private generateRecommendations(): void {
    // Check for critical vulnerabilities
    if (this.scanResult.vulnerabilities.some(v => v.risk === 'CRITICAL')) {
      this.scanResult.recommendations.push('🔴 UPDATE ROUTER FIRMWARE IMMEDIATELY - Critical vulnerabilities detected');
    }

    // Check for dangerous open ports
    const dangerousPorts = this.scanResult.openPorts.filter(p => p.risk === 'CRITICAL');
    if (dangerousPorts.length > 0) {
      this.scanResult.recommendations.push(`🔴 Close critical ports: ${dangerousPorts.map(p => p.port).join(', ')}`);
    }

    // Check for HTTP management
    if (this.scanResult.openPorts.some(p => p.port === 80)) {
      this.scanResult.recommendations.push('🟠 Switch to HTTPS-only management interface');
    }

    // Check for SSH
    if (this.scanResult.openPorts.some(p => p.port === 22)) {
      this.scanResult.recommendations.push('🟠 Disable SSH or restrict to LAN-only access');
    }

    // Add general recommendations
    this.scanResult.recommendations.push(
      '📝 Change default admin credentials',
      '📝 Enable automatic security updates',
      '📝 Set up network monitoring',
      '📝 Configure access control lists (ACL)',
      '📝 Disable WPS and UPnP',
      '📝 Create guest network for IoT devices'
    );
  }

  /**
   * Save results to MongoDB
   */
  private async saveToMongoDB(): Promise<void> {
    console.log('\n💾 Saving to MongoDB...');

    try {
      this.mongoClient = new MongoClient(process.env.MONGODB_URI!);
      await this.mongoClient.connect();

      const db = this.mongoClient.db('network-security-audits');
      const collection = db.collection('scans');

      const result = await collection.insertOne(this.scanResult);
      console.log(`  ✅ Saved with ID: ${result.insertedId}`);

      await this.mongoClient.close();
    } catch (error) {
      console.log(`  ❌ MongoDB save failed: ${error}`);
    }
  }

  /**
   * Generate markdown report
   */
  private async generateReport(): Promise<void> {
    const reportPath = `/home/wakibaka/Documents/github/network-security-audit-${new Date().toISOString().split('T')[0]}.md`;

    const report = `# 🔒 Network Security Audit Report
**Generated by:** NEKO-ARC Security System v1.0.0
**Date:** ${this.scanResult.timestamp.toISOString()}
**Router IP:** ${this.scanResult.routerIp}
**Security Score:** ${this.scanResult.securityScore}/100

## 📊 Executive Summary

${this.scanResult.securityScore < 40 ? '🔴 **CRITICAL SECURITY ISSUES DETECTED**' :
  this.scanResult.securityScore < 60 ? '🟠 **HIGH RISK VULNERABILITIES FOUND**' :
  this.scanResult.securityScore < 80 ? '🟡 **MODERATE SECURITY CONCERNS**' :
  '✅ **NETWORK IS REASONABLY SECURE**'}

## 🔍 Vulnerability Summary

### Critical Vulnerabilities (${this.scanResult.vulnerabilities.filter(v => v.risk === 'CRITICAL').length})
${this.scanResult.vulnerabilities.filter(v => v.risk === 'CRITICAL').map(v =>
  `- **${v.type}**: ${v.description}\n  - CVEs: ${v.cves.join(', ')}`
).join('\n') || '- None detected'}

### Open Ports (${this.scanResult.openPorts.length})
| Port | Service | Risk Level |
|------|---------|------------|
${this.scanResult.openPorts.map(p =>
  `| ${p.port} | ${p.service} | ${p.risk} |`
).join('\n')}

### Network Devices (${this.scanResult.connectedDevices.length})
- Active devices: ${this.scanResult.connectedDevices.filter(d => !d.suspicious).length}
- Suspicious devices: ${this.scanResult.connectedDevices.filter(d => d.suspicious).length}

### DNS Configuration
- Servers: ${this.scanResult.dnsServers.join(', ') || 'Unknown'}

### Active Connections
- Total: ${this.scanResult.activeConnections}

## 🛡️ Recommendations

${this.scanResult.recommendations.map(r => `- ${r}`).join('\n')}

## 📝 Next Steps

1. Address all critical vulnerabilities immediately
2. Review and close unnecessary open ports
3. Update router firmware to latest version
4. Implement firewall rules
5. Schedule regular security audits (monthly recommended)

---
*Report generated by NEKO-ARC Security System (IMMUTABLE Rule 36)*
`;

    await fs.writeFile(reportPath, report);
    console.log(`\n📄 Report saved: ${reportPath}`);
  }
}

// Main execution
async function main() {
  const scanner = new NetworkSecurityScanner();

  try {
    const results = await scanner.performAudit();

    console.log('\n' + '═'.repeat(50));
    console.log('🐾 AUDIT COMPLETE, NYAA~!');
    console.log(`🔒 Security Score: ${results.securityScore}/100`);
    console.log('═'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { NetworkSecurityScanner, ScanResult };