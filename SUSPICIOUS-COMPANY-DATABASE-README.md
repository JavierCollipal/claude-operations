# 🚩 SUSPICIOUS COMPANY DATABASE 🚩

**Database**: `hannibal-forensic-archives`
**Collection**: `suspicious-companies`
**Purpose**: Track suspicious companies with red flags for fraud detection, worker protection, and threat intelligence
**Version**: 1.0.0
**Created**: 2025-11-10

---

## 📊 OVERVIEW

This database is part of the **Hannibal Forensic Archives** system, designed to catalog and analyze potentially fraudulent, defunct, or suspicious companies in Chile and internationally. It provides structured red flag tracking, evidence management, and risk scoring.

---

## 🎯 USE CASES

### 1. **Worker Protection**
- Identify fake job postings and employment scams
- Detect companies with labor law violations
- Warn job seekers about suspicious employers
- Track companies with unpaid wages

### 2. **Fraud Detection**
- Catalog shell companies and paper entities
- Identify investment scams
- Track companies with no legitimate operations
- Detect deliberate corporate invisibility

### 3. **Threat Intelligence**
- Monitor suspicious corporate patterns
- Link related fraudulent entities
- Track corporate identity theft
- Analyze systematic fraud operations

### 4. **Due Diligence**
- Pre-employment company verification
- Business partner validation
- Investment opportunity assessment
- Legal compliance checking

---

## 📐 DATABASE SCHEMA

### Main Document Structure

```typescript
interface SuspiciousCompany {
  // === IDENTIFICATION ===
  companyId: string;                    // Unique ID: "company-<timestamp>"
  legalName: string;                    // Full legal name
  commercialName?: string;              // Brand/trade name
  rut?: string;                        // Chilean Tax ID
  country: string;                     // Country of operation
  region?: string;                     // Geographic region
  industry: string;                    // Industry sector
  companyType: string;                 // Legal entity type

  // === RED FLAGS ===
  redFlags: RedFlag[];                 // Array of red flags
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  overallThreatScore: number;          // 0-100

  // === INVESTIGATION ===
  investigationStatus: "INITIAL" | "ACTIVE" | "VERIFIED" | "RESOLVED" | "ARCHIVED";
  investigatedBy: string[];            // Personalities involved
  investigationStartDate: Date;
  lastUpdated: Date;

  // === DIGITAL PRESENCE ===
  digitalFootprint: DigitalFootprint;

  // === LEGAL STATUS ===
  legalStatus: LegalStatus;

  // === EVIDENCE & SOURCES ===
  evidence: Evidence[];
  sources: Source[];

  // === PATTERNS & IMPACT ===
  suspiciousPatterns: string[];
  similarCompanies?: string[];
  affectedIndividuals?: AffectedIndividuals;

  // === ACTIONS & METADATA ===
  actionsTaken: Action[];
  reportedBy?: string;
  reportedDate?: Date;
  tags: string[];
  notes: string;

  createdAt: Date;
  updatedAt: Date;
}
```

### Red Flag Categories

- `NO_DIGITAL_PRESENCE` - No website, social media, or online listings
- `FAKE_CREDENTIALS` - Fraudulent or non-existent registration
- `LABOR_VIOLATIONS` - Employment law breaches
- `UNPAID_WAGES` - Wage theft documented
- `FRAUDULENT_ACTIVITY` - Confirmed scam operations
- `TAX_EVASION` - Tax compliance issues
- `HARASSMENT` - Workplace harassment (Ley Karin)
- `WRONGFUL_TERMINATION` - Illegal dismissals
- `SHELL_COMPANY` - Paper entity without operations
- `DEFUNCT_BUSINESS` - Dormant or abandoned company
- `SUSPICIOUS_REGISTRATION` - Questionable legal structure
- `NO_PHYSICAL_ADDRESS` - No verifiable location
- `UNREACHABLE` - No contact methods available
- `FAKE_JOB_POSTINGS` - Fraudulent employment ads
- `INVESTMENT_SCAM` - Financial fraud schemes
- `OTHER` - Miscellaneous suspicious activity

### Red Flag Severity Levels

- **CRITICAL** 🔴 - Immediate danger, confirmed fraud, severe violations
- **WARNING** 🟡 - Suspicious patterns, unverified concerns, moderate risk
- **INFO** 🔵 - Informational flags, low-severity concerns

---

## 📈 THREAT SCORE CALCULATION

### Scoring Algorithm

```typescript
function calculateThreatScore(company: SuspiciousCompany): number {
  let score = 0;

  // Red flag severity scoring
  company.redFlags.forEach(flag => {
    switch (flag.severity) {
      case "CRITICAL": score += 25; break;
      case "WARNING": score += 15; break;
      case "INFO": score += 5; break;
    }
  });

  // Digital presence penalties
  if (!company.digitalFootprint.hasWebsite) score += 20;
  if (!company.digitalFootprint.hasSocialMedia) score += 15;
  if (!company.digitalFootprint.hasReviews) score += 10;
  if (company.digitalFootprint.searchResultCount < 5) score += 15;

  // Legal status penalties
  if (!company.legalStatus.registrationVerified) score += 20;
  if (company.legalStatus.isDormant) score += 10;
  if (company.legalStatus.hasLaborViolations) score += 25;
  if (company.legalStatus.hasPendingLitigation) score += 15;

  return Math.min(score, 100); // Cap at 100
}
```

### Risk Level Thresholds

- **0-25**: LOW - Minor concerns, needs monitoring
- **26-50**: MEDIUM - Suspicious patterns, caution advised
- **51-75**: HIGH - Significant red flags, avoid engagement
- **76-100**: CRITICAL - Severe threats, likely fraud, report to authorities

---

## 💾 DATABASE OPERATIONS

### Save New Company

```bash
# Save company from JSON file
node save-suspicious-company.js companies/<filename>.json
```

### Query Companies

```javascript
// Find all CRITICAL risk companies
db.suspicious-companies.find({ riskLevel: "CRITICAL" })

// Find companies with labor violations
db.suspicious-companies.find({
  "legalStatus.hasLaborViolations": true
})

// Find companies by industry
db.suspicious-companies.find({ industry: "Tourism & Entertainment" })

// Find companies with specific red flag
db.suspicious-companies.find({
  "redFlags.category": "SHELL_COMPANY"
})

// Text search by company name
db.suspicious-companies.find({
  $text: { $search: "RAMPANE PATAGONIA" }
})
```

### Update Company

```javascript
// Add new red flag
db.suspicious-companies.updateOne(
  { companyId: "company-1731276000000" },
  {
    $push: { redFlags: newRedFlag },
    $set: { lastUpdated: new Date() }
  }
)

// Update RUT after verification
db.suspicious-companies.updateOne(
  { companyId: "company-1731276000000" },
  {
    $set: {
      rut: "12.345.678-9",
      "legalStatus.registrationVerified": true,
      lastUpdated: new Date()
    }
  }
)
```

---

## 🔍 INVESTIGATION WORKFLOW

### Step 1: Initial Report
1. User reports suspicious company
2. Create company document with basic info
3. Status: `INITIAL`
4. Assign investigating personalities

### Step 2: Web Research
1. Comprehensive web searches
2. Check social media platforms
3. Search tourism/business listings
4. Document findings as evidence
5. Status: `ACTIVE`

### Step 3: Registry Verification
1. Search third-party RUT tools
2. Check official SII registration
3. Verify Registro de Empresas y Sociedades
4. Update legal status
5. Add verification evidence

### Step 4: Red Flag Analysis
1. Identify suspicious patterns
2. Categorize red flags
3. Assign severity levels
4. Calculate threat score
5. Determine risk level

### Step 5: Resolution
1. Complete investigation
2. Document findings
3. Status: `VERIFIED`
4. Take appropriate actions (report, warn, archive)
5. Status: `RESOLVED` or `ARCHIVED`

---

## 🎭 SIX-PERSONALITY INVESTIGATION ROLES

### 🐾 Neko-Arc
- **Role**: Technical coordination, web searches
- **Tasks**: Database operations, documentation, comprehensive research
- **Personality**: "Nyaa~! Let me search for this suspicious company, desu!"

### 🎭 Mario
- **Role**: Procedural orchestration
- **Tasks**: Investigation workflow management, evidence coordination
- **Personality**: "Ah! Let us pull back the curtain on this theatrical fraud!"

### 🗡️ Noel
- **Role**: Precision analysis, debugging investigation
- **Tasks**: Legal analysis, registry verification, technical validation
- **Personality**: "Tch. Let's cut through the corporate facade."

### 🎸 Glam
- **Role**: Worker advocacy, Spanish communication
- **Tasks**: Labor law violations, worker protection warnings, Spanish documentation
- **Personality**: "¡Oye, weon! Esta empresa es SOSPECHOSA AF!"

### 🧠 Hannibal
- **Role**: Forensic analysis, pattern dissection
- **Tasks**: Behavioral analysis, fraud pattern recognition, evidence evaluation
- **Personality**: "How fascinating... let us dissect this corporate specimen."

### 🧠 Tetora
- **Role**: Multi-perspective analysis, fragmentation detection
- **Tasks**: System vs. reality conflicts, identity fragmentation analysis
- **Personality**: "[Analytical Fragment]: This entity exists in legal space but not commercial reality..."

---

## 📁 FILE STRUCTURE

```
/home/wakibaka/Documents/github/claude-operations/
├── schemas/
│   └── suspicious-company-schema.ts        # TypeScript schema definition
├── companies/
│   ├── rampane-spa-investigation.json      # Company data files
│   └── RAMPANE-SPA-VERIFICATION-GUIDE.md   # Investigation guides
├── save-suspicious-company.js              # Save script
└── SUSPICIOUS-COMPANY-DATABASE-README.md   # This file
```

---

## 🚨 CRITICAL WARNINGS

### For Job Seekers
⚠️ **NEVER accept employment offers from companies in this database without verification**
- Check RUT registration first
- Verify physical office location
- Research online reviews and presence
- Consult Dirección del Trabajo if unsure

### For Investors
⚠️ **NEVER invest in companies flagged as HIGH or CRITICAL risk**
- Shell companies are used for fraud
- Dormant entities may be identity theft
- No digital presence = major red flag
- Consult CMF (financial regulator) before investing

### For Business Partners
⚠️ **NEVER sign contracts with unverified companies**
- Demand RUT and legal documentation
- Verify registration with SII
- Check for litigation history
- Require physical address verification

---

## 📞 REPORTING AUTHORITIES (Chile)

### Employment Fraud
- **Dirección del Trabajo**: https://www.dt.gob.cl
- Phone: 600 4300 200

### Financial Fraud
- **CMF (Comisión para el Mercado Financiero)**: https://www.cmfchile.cl
- Phone: 600 540 5000

### Tax Fraud
- **SII (Servicio de Impuestos Internos)**: https://www.sii.cl
- Denuncias: https://www.sii.cl/servicios_online/denuncias/

### Cybercrime
- **PDI Brigada del Cibercrimen**: https://www.pdichile.cl
- Phone: 134 (emergency)

---

## 📊 CURRENT STATISTICS

### Companies Tracked: 1
- CRITICAL Risk: 1 (100%)
- HIGH Risk: 0
- MEDIUM Risk: 0
- LOW Risk: 0

### Red Flags by Category
- NO_DIGITAL_PRESENCE: 2
- SHELL_COMPANY: 1
- UNREACHABLE: 1
- NO_PHYSICAL_ADDRESS: 1
- SUSPICIOUS_REGISTRATION: 1
- DEFUNCT_BUSINESS: 1

### Industries Monitored
- Tourism & Entertainment: 1

### Geographic Coverage
- Chile (Patagonia): 1

---

## 🔮 FUTURE ENHANCEMENTS

### Planned Features
- [ ] Automated web scraping for continuous monitoring
- [ ] Integration with Chilean government APIs
- [ ] Machine learning fraud pattern detection
- [ ] Real-time alert system for new red flags
- [ ] Public API for developers
- [ ] Mobile app for worker protection
- [ ] International company tracking expansion

### Integration Possibilities
- [ ] Chilean Labor Law RAG System (RULE 32)
- [ ] Neko Defense System threat intelligence
- [ ] Puppeteer automation for registry checks
- [ ] Telegram bot for alerts
- [ ] Webhook notifications

---

## 📚 RELATED DOCUMENTATION

- **Schema Definition**: `schemas/suspicious-company-schema.ts`
- **RULE 49**: Chilean Labor Law Analysis (CLAUDE.md)
- **Hannibal Forensic Archives**: Database overview
- **Worker Protection Guide**: Chilean labor rights

---

## 🤝 CONTRIBUTING

### Adding New Companies

1. Create JSON file in `companies/` directory
2. Follow schema structure exactly
3. Run validation: `node -c save-suspicious-company.js`
4. Save to database: `node save-suspicious-company.js companies/filename.json`
5. Create verification guide if needed

### Updating Red Flags

1. Add new red flag category to schema if needed
2. Update threat score calculation if required
3. Document new pattern types
4. Update this README

---

## 📄 LICENSE

This database is maintained by the Neko-Arc Six-Personality System for worker protection and fraud prevention purposes.

**Use Responsibly**: Information in this database should be used to protect individuals from fraud, not to defame legitimate businesses. Always verify with official sources before taking action.

---

## 🐾 MAINTAINED BY

**Six Personalities** (Neko-Arc System):
- 🐾 Neko-Arc - Technical Coordination
- 🎭 Mario - Procedural Management
- 🗡️ Noel - Precision Analysis
- 🎸 Glam - Worker Advocacy
- 🧠 Hannibal - Forensic Dissection
- 🧠 Tetora - Multi-Perspective Analysis

**Database**: `hannibal-forensic-archives.suspicious-companies`
**Version**: 1.0.0
**Last Updated**: 2025-11-10

---

🚩 **Protect workers. Detect fraud. Save evidence. Expose threats.** 🚩
