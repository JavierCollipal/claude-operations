/**
 * 🚩 SUSPICIOUS COMPANY DATABASE SCHEMA 🚩
 *
 * Purpose: Track companies with red flags for fraud detection,
 *          worker protection, and threat intelligence
 *
 * Database: suspicious-companies
 * Collection: companies
 *
 * Created: 2025-11-10
 * Version: 1.0.0
 */

export interface SuspiciousCompany {
  // === IDENTIFICATION ===
  companyId: string;                    // Format: "company-<timestamp>"
  legalName: string;                    // Full legal name
  commercialName?: string;              // Brand/trade name (if different)
  rut?: string;                        // Chilean Tax ID (if known)
  country: string;                     // "Chile", etc.
  region?: string;                     // "Patagonia", "Metropolitana", etc.
  industry: string;                    // "Tourism", "Construction", etc.
  companyType: string;                 // "SPA", "LTDA", "SA", etc.

  // === RED FLAGS ===
  redFlags: RedFlag[];                 // Array of identified red flags
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  overallThreatScore: number;          // 0-100 calculated score

  // === INVESTIGATION STATUS ===
  investigationStatus: "INITIAL" | "ACTIVE" | "VERIFIED" | "RESOLVED" | "ARCHIVED";
  investigatedBy: string[];            // Personalities involved
  investigationStartDate: Date;
  lastUpdated: Date;

  // === DIGITAL PRESENCE ===
  digitalFootprint: {
    hasWebsite: boolean;
    websiteUrl?: string;
    hasSocialMedia: boolean;
    socialMediaLinks?: string[];
    hasReviews: boolean;
    reviewPlatforms?: string[];        // TripAdvisor, Google, etc.
    hasBusinessListings: boolean;
    searchResultCount: number;         // Number of Google results
    digitalPresenceScore: number;      // 0-100 (0 = ghost company)
  };

  // === LEGAL STATUS ===
  legalStatus: {
    registrationVerified: boolean;
    registrationDate?: Date;
    isActive: boolean;
    isDormant: boolean;
    isDefunct: boolean;
    hasPendingLitigation: boolean;
    litigationDetails?: string[];
    hasLaborViolations: boolean;
    laborViolationDetails?: string[];
  };

  // === EVIDENCE ===
  evidence: Evidence[];
  sources: Source[];

  // === PATTERNS ===
  suspiciousPatterns: string[];        // Identified behavior patterns
  similarCompanies?: string[];         // Links to other suspicious entities

  // === IMPACT ===
  affectedIndividuals?: {
    count: number;
    types: string[];                   // "employees", "customers", "investors"
    reportedLosses?: number;           // Financial impact (CLP)
  };

  // === ACTIONS TAKEN ===
  actionsTaken: Action[];

  // === METADATA ===
  reportedBy?: string;                 // Who initiated investigation
  reportedDate?: Date;
  tags: string[];                      // "fraud", "labor-abuse", "tax-evasion", etc.
  notes: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface RedFlag {
  flagId: string;                      // Format: "flag-<timestamp>"
  category: RedFlagCategory;
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;                       // Short description
  description: string;                 // Detailed explanation
  discoveredDate: Date;
  discoveredBy: string;                // Personality name
  evidenceIds?: string[];              // Links to evidence documents
  verified: boolean;
  verificationMethod?: string;
}

export type RedFlagCategory =
  | "NO_DIGITAL_PRESENCE"
  | "FAKE_CREDENTIALS"
  | "LABOR_VIOLATIONS"
  | "UNPAID_WAGES"
  | "FRAUDULENT_ACTIVITY"
  | "TAX_EVASION"
  | "HARASSMENT"
  | "WRONGFUL_TERMINATION"
  | "SHELL_COMPANY"
  | "DEFUNCT_BUSINESS"
  | "SUSPICIOUS_REGISTRATION"
  | "NO_PHYSICAL_ADDRESS"
  | "UNREACHABLE"
  | "FAKE_JOB_POSTINGS"
  | "INVESTMENT_SCAM"
  | "OTHER";

export interface Evidence {
  evidenceId: string;                  // Format: "evidence-<timestamp>"
  type: "SCREENSHOT" | "DOCUMENT" | "TESTIMONY" | "WEB_SEARCH" | "REGISTRY_CHECK" | "OTHER";
  description: string;
  filePath?: string;                   // If file stored
  url?: string;                        // If online source
  collectedDate: Date;
  collectedBy: string;
  notes?: string;
}

export interface Source {
  sourceId: string;
  type: "WEB_SEARCH" | "GOVERNMENT_REGISTRY" | "NEWS_ARTICLE" | "SOCIAL_MEDIA" | "DIRECT_REPORT" | "OTHER";
  name: string;                        // Source name/platform
  url?: string;
  dateAccessed: Date;
  reliability: "HIGH" | "MEDIUM" | "LOW";
  notes?: string;
}

export interface Action {
  actionId: string;
  actionType: "REPORT_FILED" | "INVESTIGATION_OPENED" | "LEGAL_ACTION" | "WARNING_ISSUED" | "CASE_CLOSED" | "OTHER";
  description: string;
  takenBy: string;                     // Personality or authority
  takenDate: Date;
  authority?: string;                  // "Dirección del Trabajo", "SII", etc.
  referenceNumber?: string;            // Case/ticket number
  outcome?: string;
  documents?: string[];                // Related document IDs
}

/**
 * THREAT SCORE CALCULATION
 *
 * Points added for each red flag:
 * - CRITICAL severity: +25 points
 * - WARNING severity: +15 points
 * - INFO severity: +5 points
 *
 * Digital presence penalty:
 * - No website: +20 points
 * - No social media: +15 points
 * - No reviews: +10 points
 * - Search result count < 5: +15 points
 *
 * Risk Levels:
 * - 0-25: LOW
 * - 26-50: MEDIUM
 * - 51-75: HIGH
 * - 76-100: CRITICAL
 */

export function calculateThreatScore(company: SuspiciousCompany): number {
  let score = 0;

  // Red flag scoring
  company.redFlags.forEach(flag => {
    switch (flag.severity) {
      case "CRITICAL": score += 25; break;
      case "WARNING": score += 15; break;
      case "INFO": score += 5; break;
    }
  });

  // Digital presence penalty
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

export function getRiskLevel(score: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  if (score >= 76) return "CRITICAL";
  if (score >= 51) return "HIGH";
  if (score >= 26) return "MEDIUM";
  return "LOW";
}
