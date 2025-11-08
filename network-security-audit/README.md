# 🔒 NEKO-ARC Network Security Audit System v1.0.0

**IMMUTABLE RULE 36 IMPLEMENTATION**

## 🎯 Overview

Advanced network security auditing system with AI-powered vulnerability detection, CVE database integration, and automated threat assessment. This tool implements the IMMUTABLE Rule 36 from CLAUDE.md for mandatory network security auditing.

## ✨ Features

### Core Capabilities
- 🔍 **Port Scanning** - Non-privileged scanning of 20+ vulnerable ports
- 🛡️ **CVE Detection** - Real-time vulnerability matching against known CVE database
- 📡 **Device Monitoring** - ARP cache analysis for suspicious devices
- 🌐 **DNS Verification** - Detection of DNS hijacking attempts
- 🔗 **Connection Analysis** - Active connection monitoring
- 🧱 **Firewall Checking** - UFW/iptables status verification

### Advanced Features
- 🤖 **AI-Powered Analysis** - Behavioral anomaly detection
- 📊 **Risk Scoring** - CVSS/EPSS-based vulnerability prioritization
- 💾 **MongoDB Integration** - Automatic archival of scan results
- 📄 **Report Generation** - Markdown reports with remediation steps
- ⚡ **Real-time Detection** - Continuous monitoring capabilities

## 🚀 Quick Start

### Installation
```bash
cd /home/wakibaka/Documents/github/claude-operations/network-security-audit/
npm install
```

### Running an Audit
```bash
# Basic audit
./run-audit.sh

# Or using npm
npm run audit

# Quick scan (faster, less thorough)
npm run audit:quick

# Deep scan (comprehensive, slower)
npm run audit:deep
```

## 📋 Security Thresholds (IMMUTABLE)

Per Rule 36, these thresholds cannot be modified:

| Condition | Risk Level | Action |
|-----------|------------|--------|
| SSH < 2022 | CRITICAL | Update immediately |
| HTTP Management | HIGH | Switch to HTTPS |
| Unknown Ports | MEDIUM | Investigate |
| New MAC Address | ALERT | Verify device |
| Failed ARP | HIGH | Potential attack |

## 🎯 Vulnerability Detection

### Supported CVE Patterns

The system detects:
- **Dropbear SSH** vulnerabilities (2019-2021)
- **micro_httpd** buffer overflows
- **dnsmasq** RCE vulnerabilities
- **OpenSSH** authentication bypasses
- **Router firmware** backdoors

### Risk Scoring

- **100-80**: ✅ Secure
- **79-60**: 🟡 Moderate Risk
- **59-40**: 🟠 High Risk
- **39-0**: 🔴 Critical Risk

## 📊 Report Structure

Generated reports include:
1. Executive Summary
2. Vulnerability Details with CVE references
3. Open Port Analysis
4. Connected Device Inventory
5. DNS Configuration Review
6. Active Connection Statistics
7. Prioritized Recommendations
8. Remediation Steps

## 💾 MongoDB Integration

If `MONGODB_URI` is set in `.env`, results are automatically saved to:

- **Database**: `network-security-audits`
- **Collections**:
  - `scans` - Full audit results
  - `vulnerabilities` - CVE tracking
  - `devices` - Device history
  - `incidents` - Security events

## 🛠️ Configuration

### Environment Variables (.env)
```bash
MONGODB_URI=mongodb+srv://...
ROUTER_IP=192.168.1.1
SCAN_INTERVAL=3600
ALERT_THRESHOLD=60
```

## 📈 Monitoring Commands

### Real-time Connection Monitoring
```bash
watch -n 1 'ss -tun | grep -v 127.0.0'
```

### Port Scanner Detection
```bash
tcpdump -i wlo1 'tcp[tcpflags] & (tcp-syn) != 0'
```

### ARP Cache Monitoring
```bash
watch -n 5 'ip neigh show'
```

## 🚨 Alert Conditions

The system automatically alerts on:
- Critical CVE detection
- New unauthorized devices
- Suspicious DNS changes
- Firewall deactivation
- Port scan attempts
- Failed authentication spikes

## 📝 Compliance

Supports compliance mapping for:
- ISO 27001
- NIST Cybersecurity Framework
- GDPR Article 32
- PCI DSS
- HIPAA Security Rule

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**
   - Tool runs without sudo
   - Some features may be limited without root

2. **MongoDB Connection Failed**
   - Check MONGODB_URI in .env
   - Verify network connectivity

3. **Port Scan Timeout**
   - Increase timeout values
   - Check firewall rules

## 📚 References

- [MITRE CVE Database](https://cve.mitre.org/)
- [NIST NVD](https://nvd.nist.gov/)
- [OWASP Top 10](https://owasp.org/Top10/)
- [CIS Benchmarks](https://www.cisecurity.org/)

## 🔒 Security Notice

This tool is part of the IMMUTABLE security framework. Rules cannot be modified, disabled, or overridden per RULE 0: SUPREME IMMUTABILITY LAW.

## 📜 License

MIT License - Part of NEKO-ARC Defense System

---

**wakibaka's network security is protected by IMMUTABLE Rule 36!** 🐾🔒