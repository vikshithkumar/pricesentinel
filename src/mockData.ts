export interface KpiData {
  title: string;
  value: string;
  trendText?: string;
  trendType?: 'up' | 'down' | 'neutral' | 'error';
  icon: string;
  colorClass: string;
  borderColorClass: string;
  bgIndicatorClass: string;
}

export interface DetectionData {
  id: string;
  vendor: string;
  changeType: string;
  changeTypeClass: string;
  values: string;
  percentageChange: string;
  percentageChangeClass?: string;
  severity: string;
  severityClass: string;
  impact: string;
  impactClass: string;
  confidence: string;
  icon: string;
}

export interface RecommendedActionData {
  title: string;
  description: string;
  hasActionLink?: boolean;
}

export interface HealthStatData {
  status: string;
  count: number;
  percentage: number;
  colorClass: string;
}

export interface ActivityData {
  time: string;
  description: string;
  statusColorClass: string;
}

export const workspaceInfo = {
  userGreeting: "Good morning, Sarah",
  workspaceName: "Acme Corp",
  workspaceCode: "AC",
  lastVerifiedText: "Last verified: 4 mins ago",
};

export const kpiMetrics: KpiData[] = [
  {
    title: "Vendors Monitored",
    value: "542",
    trendText: "+3 this week",
    trendType: "up",
    icon: "storefront",
    colorClass: "text-primary/70",
    borderColorClass: "hover:border-primary/50",
    bgIndicatorClass: "group-hover:bg-primary/20",
  },
  {
    title: "Important Changes",
    value: "14",
    trendText: "Active alerts",
    trendType: "error",
    icon: "notifications_active",
    colorClass: "text-warning-amber/70",
    borderColorClass: "hover:border-critical-red/50",
    bgIndicatorClass: "bg-warning-amber/20",
  },
  {
    title: "Est. Annual Impact",
    value: "-$1.2M",
    trendText: "Projected Cost",
    trendType: "neutral",
    icon: "account_balance_wallet",
    colorClass: "text-primary/70",
    borderColorClass: "hover:border-primary/50",
    bgIndicatorClass: "group-hover:bg-primary/20",
  },
  {
    title: "Scraper Health",
    value: "99.2%",
    trendText: "System Stable",
    trendType: "up",
    icon: "monitor_heart",
    colorClass: "text-success-green/70",
    borderColorClass: "hover:border-success-green/50",
    bgIndicatorClass: "bg-success-green/20",
  },
];

export const detections: DetectionData[] = [
  {
    id: "openai-restructure",
    vendor: "OpenAI",
    changeType: "Plan Restructure",
    changeTypeClass: "bg-warning-amber/10 text-warning-amber border-warning-amber/20",
    values: "Pay-as-go → Tiers",
    percentageChange: "N/A",
    severity: "High",
    severityClass: "text-critical-red",
    impact: "+$45k/yr",
    impactClass: "text-critical-red",
    confidence: "99%",
    icon: "psychology",
  },
  {
    id: "aws-price-increase",
    vendor: "AWS",
    changeType: "Price Increase",
    changeTypeClass: "bg-critical-red/10 text-critical-red border-critical-red/20",
    values: "$0.02 → $0.024",
    percentageChange: "+20%",
    percentageChangeClass: "text-critical-red",
    severity: "High",
    severityClass: "text-critical-red",
    impact: "+$120k/yr",
    impactClass: "text-critical-red",
    confidence: "100%",
    icon: "cloud",
  },
  {
    id: "twilio-price-drop",
    vendor: "Twilio",
    changeType: "Price Drop",
    changeTypeClass: "bg-success-green/10 text-success-green border-success-green/20",
    values: "$0.007 → $0.006",
    percentageChange: "-14%",
    percentageChangeClass: "text-success-green",
    severity: "Low",
    severityClass: "text-success-green",
    impact: "-$12k/yr",
    impactClass: "text-success-green",
    confidence: "95%",
    icon: "integration_instructions",
  },
  {
    id: "mongodb-tc-update",
    vendor: "MongoDB",
    changeType: "T&C Update",
    changeTypeClass: "bg-warning-amber/10 text-warning-amber border-warning-amber/20",
    values: "Storage limits changed",
    percentageChange: "N/A",
    severity: "Med",
    severityClass: "text-warning-amber",
    impact: "TBD",
    impactClass: "text-secondary",
    confidence: "88%",
    icon: "database",
  },
];

export const financialImpactBars = [
  { height: "30%", active: false },
  { height: "40%", active: false },
  { height: "35%", active: false },
  { height: "50%", active: false },
  { height: "45%", active: false },
  { height: "70%", active: true, monthLabel: "Aug" },
  { height: "90%", active: true, monthLabel: "Sep" },
];

export const recommendedActions: RecommendedActionData[] = [
  {
    title: "Review OpenAI Pricing",
    description: "High priority impact detected",
    hasActionLink: true,
  },
  {
    title: "Approve Budget Update",
    description: "Q3 SaaS adjustments pending",
  },
];

export const monitoringHealth: HealthStatData[] = [
  {
    status: "Live & Syncing",
    count: 510,
    percentage: 94,
    colorClass: "bg-success-green",
  },
  {
    status: "Degraded (Delay)",
    count: 28,
    percentage: 5,
    colorClass: "bg-warning-amber",
  },
  {
    status: "Down / Offline",
    count: 4,
    percentage: 1,
    colorClass: "bg-critical-red",
  },
];

import { getFormattedCurrentDate, getFormattedCurrentTime, getRelativeDateString } from "./utils/dateUtils";

export const recentActivities: ActivityData[] = [
  {
    time: getFormattedCurrentTime(),
    description: "Scraper AWS-01 recovered",
    statusColorClass: "bg-surface-container border-canvas-white",
  },
  {
    time: "15 mins ago",
    description: "Alert: Atlassian pricing page changed",
    statusColorClass: "bg-warning-amber border-canvas-white",
  },
  {
    time: `Yesterday, ${getFormattedCurrentTime()}`,
    description: "System snapshot completed",
    statusColorClass: "bg-primary border-canvas-white",
  },
];

// --- BATCH 1 SCHEMAS & DATASETS ---

export interface ChangeMetricDiff {
  name: string;
  previous: string;
  current: string;
  status: "neutral" | "success" | "critical";
}

export interface ChangeDetailData {
  id: string;
  title: string;
  subtitle: string;
  vendorName: string;
  vendorLogoText?: string;
  vendorLogoIcon?: string;
  vendorLogoUrl?: string;
  timeText: string;
  contextText: string;
  keyDrivers: string[];
  metrics: ChangeMetricDiff[];
  monthlyDelta: string;
  spendAvg: string;
  runRate: string;
  confidenceScore: string;
  scraperStatus: "Active" | "Syncing" | "Degraded" | "Offline";
}

export interface VendorData {
  id: string;
  name: string;
  category: string;
  status: "Active" | "Syncing" | "Offline";
  pricingPlan: string;
  recentChange: string;
  recentChangeId?: string;
  annualImpact: string;
  impactType: "neutral" | "increase" | "decrease";
  scraperHealth: number;
  lastVerified: string;
  logoIcon?: string;
  logoText?: string;
  logoUrl?: string;
}

export const changeDetails: Record<string, ChangeDetailData> = {
  "openai-restructure": {
    id: "openai-restructure",
    title: "OpenAI API Credit Update",
    subtitle: "Adjustments to GPT-4 Turbo input/output token pricing and tiered credit expiration policies.",
    vendorName: "OpenAI",
    vendorLogoIcon: "view_in_ar",
    timeText: "Detected 2 hours ago via Scraper validation",
    contextText: "OpenAI has rolled out an unannounced update to their API credit system and tier thresholds. While base per-token pricing for gpt-4-turbo remains steady, the lifespan of prepaid credits has been significantly shortened from 12 months to 90 days for Tier 1 and 2 accounts. This represents an aggressive working capital shift that will likely result in increased 'breakage' revenue for the vendor.",
    keyDrivers: [
      "Accelerated credit expiration limits stockpiling strategies for seasonal spikes.",
      "Higher barrier to entry for Tier 3 status, now requiring $5,000 upfront (up from $1,000)."
    ],
    metrics: [
      { name: "GPT-4 Turbo Input", previous: "$10.00 / 1M tokens", current: "$10.00 (No Change)", status: "success" },
      { name: "Prepaid Credit Lifespan", previous: "12 Months", current: "90 Days", status: "critical" },
      { name: "Tier 3 Qualification", previous: "$1,000 Paid", current: "$5,000 Paid", status: "critical" },
      { name: "Rate Limits (Tier 2)", previous: "5,000 RPM / 300K TPM", current: "10,000 RPM / 500K TPM", status: "success" }
    ],
    monthlyDelta: "-$1,240",
    spendAvg: "$4,500",
    runRate: "$5,740",
    confidenceScore: "99.8%",
    scraperStatus: "Active"
  },
  "aws-price-increase": {
    id: "aws-price-increase",
    title: "AWS Data Transfer Price Increase",
    subtitle: "Outbound transfer base rate increases across primary US and EU regional nodes.",
    vendorName: "AWS",
    vendorLogoIcon: "cloud",
    timeText: "Detected 4 hours ago via Scraper validation",
    contextText: "Amazon Web Services is increasing the base rates for outbound data transfers to the internet across major US regions by 20%. This pricing adjustment directly impacts services utilizing cloud storage and outbound caching endpoints. While small tier usages remain covered under the free tier, enterprise volumes will incur a 20% surcharge.",
    keyDrivers: [
      "Increased baseline infrastructure overhead globally.",
      "Higher margin targets for regional transfer nodes."
    ],
    metrics: [
      { name: "Data Transfer Out (US-East)", previous: "$0.02 / GB", current: "$0.024 / GB", status: "critical" },
      { name: "Data Transfer Out (EU-Central)", previous: "$0.05 / GB", current: "$0.06 / GB", status: "critical" }
    ],
    monthlyDelta: "-$10,000",
    spendAvg: "$50,000",
    runRate: "$60,000",
    confidenceScore: "100%",
    scraperStatus: "Active"
  },
  "twilio-price-drop": {
    id: "twilio-price-drop",
    title: "Twilio Messaging Price Drop",
    subtitle: "Twilio reduces per-SMS outbound carrier rates across European corridors.",
    vendorName: "Twilio",
    vendorLogoIcon: "integration_instructions",
    timeText: "Detected 30 mins ago via Scraper validation",
    contextText: "Following successful negotiation with regional carrier aggregates, Twilio is lowering outbound SMS rates in several European markets by approximately 14%. Organizations utilizing international routing will see a direct reduction in monthly transaction messaging spend.",
    keyDrivers: [
      "Lower wholesale aggregate carrier costs in the UK and Germany.",
      "Volume discounts unlocked due to increased corporate outreach traffic."
    ],
    metrics: [
      { name: "Outbound SMS (Germany)", previous: "$0.007 / SMS", current: "$0.006 / SMS", status: "success" },
      { name: "Outbound SMS (UK)", previous: "$0.004 / SMS", current: "$0.0035 / SMS", status: "success" }
    ],
    monthlyDelta: "+$1,000",
    spendAvg: "$7,000",
    runRate: "$6,000",
    confidenceScore: "95%",
    scraperStatus: "Active"
  },
  "mongodb-tc-update": {
    id: "mongodb-tc-update",
    title: "MongoDB Atlas Storage Updates",
    subtitle: "Adjustments to base storage provisions and automatic scaling limits in shared tiers.",
    vendorName: "MongoDB",
    vendorLogoIcon: "database",
    timeText: "Detected 1 hour ago via Scraper validation",
    contextText: "MongoDB Atlas updated their Terms of Service and automated scaling thresholds. Shared sandbox tiers now cap maximum auto-expanded storage at 10GB down from 20GB. Enterprise instances are unaffected, but mid-market shared instances will see minor adjustments to overage limits.",
    keyDrivers: [
      "Storage policy migration for free and shared cluster resources.",
      "Incentivization push towards dedicated instances for growing dev setups."
    ],
    metrics: [
      { name: "Max Shared Auto-Expand", previous: "20 GB", current: "10 GB", status: "critical" },
      { name: "Overage Storage Unit Fee", previous: "$0.20 / GB", current: "$0.20 (No Change)", status: "neutral" }
    ],
    monthlyDelta: "$0",
    spendAvg: "$1,500",
    runRate: "$1,500",
    confidenceScore: "88%",
    scraperStatus: "Syncing"
  },
  "cloudforge-price-increase": {
    id: "cloudforge-price-increase",
    title: "CloudForge Pro Plan Rate Adjustment",
    subtitle: "CloudForge Inc. base subscription rate increase for professional team tiers.",
    vendorName: "CloudForge Inc.",
    vendorLogoIcon: "storefront",
    timeText: "Today, 09:41 AM via Scraper validation",
    contextText: "CloudForge Inc. has rolled out a subscription rate adjustment for their flagship 'Pro' Tier. The base rate has been increased by 26.3% from $19.00 to $24.00 per month, reflecting upgrades in developer pipelines, higher compute allowance, and enhanced integrations.",
    keyDrivers: [
      "Inclusion of 200 additional build-minutes per seat.",
      "Transition from legacy hardware runners to new Arm64 instances."
    ],
    metrics: [
      { name: "Pro Tier Base Rate", previous: "$19.00 / mo", current: "$24.00 / mo", status: "critical" },
      { name: "Build Minutes (Included)", previous: "500 mins", current: "700 mins", status: "success" }
    ],
    monthlyDelta: "-$2,400",
    spendAvg: "$9,120",
    runRate: "$11,520",
    confidenceScore: "99%",
    scraperStatus: "Active"
  },
  "synthtext-plan-restructure": {
    id: "synthtext-plan-restructure",
    title: "SynthText API Plan Restructure",
    subtitle: "SynthText API limits token counts and removes unlimited token provisions.",
    vendorName: "SynthText API",
    vendorLogoIcon: "psychology",
    timeText: "Yesterday, 14:22 PM via Scraper validation",
    contextText: "SynthText API restructured their core pricing strategy. The unlimited token volume has been eliminated from the 'Starter' tier and replaced with capped monthly credit buckets. Outbound usage exceeding these limits will trigger pay-as-you-go overages.",
    keyDrivers: [
      "Mitigation of resource consumption abuse by shared starter keys.",
      "Standardization of high-volume usage patterns under dedicated tiers."
    ],
    metrics: [
      { name: "Unlimited Token Allowance", previous: "Yes (Starter)", current: "No (Capped at 5M)", status: "critical" },
      { name: "Starter Tier Base Price", previous: "$49 / mo", current: "$49 (No Change)", status: "neutral" }
    ],
    monthlyDelta: "$0",
    spendAvg: "$2,200",
    runRate: "$2,200",
    confidenceScore: "92%",
    scraperStatus: "Active"
  },
  "datalake-new-credit": {
    id: "datalake-new-credit",
    title: "DataLake Co. New Credit Model",
    subtitle: "DataLake Co. introduces credits as the standard billing unit.",
    vendorName: "DataLake Co.",
    vendorLogoIcon: "database",
    timeText: "Oct 24, 08:00 AM via Scraper validation",
    contextText: "DataLake Co. migrated billing policies from raw storage usage metrics to Compute Credits. Under the new model, storage, querying, and pipelines consume centralized credits. The starting base exchange rate is 100 credits for $5.00.",
    keyDrivers: [
      "Centralization of multi-resource cloud invoices into a unified metric.",
      "Simplification of query billing based on compute metrics rather than run-time."
    ],
    metrics: [
      { name: "Compute Credits Base", previous: "GB/hr billing", current: "100 credits = $5.00", status: "neutral" }
    ],
    monthlyDelta: "Unknown",
    spendAvg: "$3,800",
    runRate: "$3,800",
    confidenceScore: "85%",
    scraperStatus: "Syncing"
  },
  "buildops-price-decrease": {
    id: "buildops-price-decrease",
    title: "BuildOps Enterprise Seat Discount",
    subtitle: "BuildOps lowers user seat costs for larger team deployments.",
    vendorName: "BuildOps",
    vendorLogoIcon: "precision_manufacturing",
    timeText: "Oct 23, 16:45 PM via Scraper validation",
    contextText: "BuildOps has lowered its base enterprise seat fee by 10% from $50.00 to $45.00 per user. This bulk incentive targets larger teams and is activated automatically once a team size passes the threshold of 50 active seats.",
    keyDrivers: [
      "Wider adoption incentives for enterprise developer accounts.",
      "High competitive pressure in regional deployment automation niches."
    ],
    metrics: [
      { name: "Enterprise Seat Price", previous: "$50.00 / user", current: "$45.00 / user", status: "success" },
      { name: "Seat Volume Threshold", previous: "100 seats", current: "50 seats", status: "success" }
    ],
    monthlyDelta: "+$850",
    spendAvg: "$8,500",
    runRate: "$7,650",
    confidenceScore: "96%",
    scraperStatus: "Active"
  }
};

export const vendors: VendorData[] = [
  {
    id: "openai",
    name: "OpenAI",
    category: "AI Infrastructure",
    status: "Active",
    pricingPlan: "Enterprise Usage",
    recentChange: "Compute tier price increased 12%",
    recentChangeId: "openai-restructure",
    annualImpact: "+$45,200",
    impactType: "increase",
    scraperHealth: 99.8,
    lastVerified: "12 mins ago",
    logoIcon: "view_in_ar"
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    status: "Syncing",
    pricingPlan: "Unlimited Edition",
    recentChange: "No recent changes",
    annualImpact: "--",
    impactType: "neutral",
    scraperHealth: 94.2,
    lastVerified: "2 hours ago",
    logoIcon: "cloud"
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "DevTools",
    status: "Active",
    pricingPlan: "Pro Plan",
    recentChange: "Bandwidth overage fee restructure",
    recentChangeId: "synthtext-plan-restructure",
    annualImpact: "-$1,200",
    impactType: "decrease",
    scraperHealth: 100,
    lastVerified: "Just now",
    logoIcon: "precision_manufacturing"
  },
  {
    id: "aws",
    name: "AWS",
    category: "AI Infrastructure",
    status: "Active",
    pricingPlan: "Pay-As-You-Go",
    recentChange: "Data transfer price increased 20%",
    recentChangeId: "aws-price-increase",
    annualImpact: "+$120,000",
    impactType: "increase",
    scraperHealth: 99.2,
    lastVerified: "4 mins ago",
    logoIcon: "cloud"
  },
  {
    id: "twilio",
    name: "Twilio",
    category: "DevTools",
    status: "Active",
    pricingPlan: "Volume Standard",
    recentChange: "SMS rates dropped 14%",
    recentChangeId: "twilio-price-drop",
    annualImpact: "-$12,000",
    impactType: "decrease",
    scraperHealth: 98.4,
    lastVerified: "30 mins ago",
    logoIcon: "integration_instructions"
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "DevTools",
    status: "Syncing",
    pricingPlan: "Atlas M30 Dedicated",
    recentChange: "Atlas storage capacity rules updated",
    recentChangeId: "mongodb-tc-update",
    annualImpact: "--",
    impactType: "neutral",
    scraperHealth: 95.0,
    lastVerified: "1 hour ago",
    logoIcon: "database"
  },
  {
    id: "cloudforge",
    name: "CloudForge Inc.",
    category: "DevTools",
    status: "Active",
    pricingPlan: "Pro Team Tier",
    recentChange: "Pro tier base rate adjustment",
    recentChangeId: "cloudforge-price-increase",
    annualImpact: "+$28,800",
    impactType: "increase",
    scraperHealth: 99.0,
    lastVerified: "Today, 09:41 AM",
    logoIcon: "storefront"
  },
  {
    id: "synthtext",
    name: "SynthText API",
    category: "AI Infrastructure",
    status: "Active",
    pricingPlan: "Usage Starter",
    recentChange: "Capped token volume limits",
    recentChangeId: "synthtext-plan-restructure",
    annualImpact: "--",
    impactType: "neutral",
    scraperHealth: 92.0,
    lastVerified: "Yesterday, 14:22 PM",
    logoIcon: "psychology"
  },
  {
    id: "datalake",
    name: "DataLake Co.",
    category: "DevTools",
    status: "Syncing",
    pricingPlan: "Enterprise Credit Bucket",
    recentChange: "Compute credits standardization",
    recentChangeId: "datalake-new-credit",
    annualImpact: "--",
    impactType: "neutral",
    scraperHealth: 85.0,
    lastVerified: "Oct 24, 08:00 AM",
    logoIcon: "database"
  },
  {
    id: "buildops",
    name: "BuildOps",
    category: "DevTools",
    status: "Active",
    pricingPlan: "Enterprise Team Tier",
    recentChange: "Seat price bulk discounts enabled",
    recentChangeId: "buildops-price-decrease",
    annualImpact: "-$10,200",
    impactType: "decrease",
    scraperHealth: 96.0,
    lastVerified: "Oct 23, 16:45 PM",
    logoIcon: "precision_manufacturing"
  }
];

// --- Batch 2 Mock Data Additions ---

export interface ScraperNode {
  id: string;
  vendor: string;
  collectorId: string;
  category: 'ecommerce' | 'travel' | 'financial' | 'crm' | 'infrastructure';
  status: 'healthy' | 'degraded' | 'recovering' | 'failed' | 'stale' | 'critical-stale';
  successRate: number;
  latencyMs: number | string;
  lastScanText: string;
  lastScanTime: Date;
  issueText?: string;
}

export interface PipelineActivityLog {
  id: string;
  collectorId: string;
  message: string;
  timeText: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
}

export interface VendorImpactScore {
  vendor: string;
  score: number;
  coreDrivers: string;
  annualDelta: string;
  status: 'Calculated' | 'Estimate';
  statusType: 'success' | 'warning' | 'error' | 'neutral';
  impactColor: 'red' | 'amber' | 'green';
}

export const mockScraperNodes: ScraperNode[] = [
  {
    id: "amazon",
    vendor: "Amazon",
    collectorId: "SCR-AMZ-01",
    category: "ecommerce",
    status: "healthy",
    successRate: 99.8,
    latencyMs: 245,
    lastScanText: "2 min ago",
    lastScanTime: new Date("2026-08-19T10:40:00")
  },
  {
    id: "walmart",
    vendor: "Walmart",
    collectorId: "SCR-WAL-02",
    category: "ecommerce",
    status: "stale",
    successRate: 82.4,
    latencyMs: 850,
    lastScanText: "26 hours ago",
    lastScanTime: new Date("2026-08-18T08:42:00"),
    issueText: "Rate Limited"
  },
  {
    id: "expedia",
    vendor: "Expedia",
    collectorId: "SCR-EXP-05",
    category: "travel",
    status: "critical-stale",
    successRate: 0,
    latencyMs: "--",
    lastScanText: "2 days ago",
    lastScanTime: new Date("2026-08-17T10:42:00"),
    issueText: "Connection Timeout"
  },
  {
    id: "target",
    vendor: "Target",
    collectorId: "SCR-TGT-01",
    category: "ecommerce",
    status: "failed",
    successRate: 0.0,
    latencyMs: "Timeout",
    lastScanText: "5 min ago",
    lastScanTime: new Date("2026-08-19T10:37:00"),
    issueText: "Connection Refused"
  },
  {
    id: "bestbuy",
    vendor: "BestBuy",
    collectorId: "SCR-BBY-02",
    category: "ecommerce",
    status: "healthy",
    successRate: 99.9,
    latencyMs: 310,
    lastScanText: "30 sec ago",
    lastScanTime: new Date("2026-08-19T10:41:30")
  },
  {
    id: "salesforce-health",
    vendor: "Salesforce",
    collectorId: "SCR-SFC-01",
    category: "crm",
    status: "degraded",
    successRate: 78.5,
    latencyMs: 1200,
    lastScanText: "1 hour ago",
    lastScanTime: new Date("2026-08-19T09:42:00"),
    issueText: "Proxy Rotation Delay"
  },
  {
    id: "skyscanner",
    vendor: "SkyScanner API",
    collectorId: "SCR-SKY-04",
    category: "travel",
    status: "degraded",
    successRate: 82.4,
    latencyMs: 1200,
    lastScanText: "10 min ago",
    lastScanTime: new Date("2026-08-19T10:32:00"),
    issueText: "Rate Limited"
  },
  {
    id: "eurobank",
    vendor: "EuroBank FX",
    collectorId: "SCR-EUR-09",
    category: "financial",
    status: "failed",
    successRate: 0.0,
    latencyMs: "Timeout",
    lastScanText: "10 min ago",
    lastScanTime: new Date("2026-08-19T10:32:00"),
    issueText: "Connection Refused"
  }
];

export const mockPipelineLogs: PipelineActivityLog[] = [
  {
    id: "log-1",
    collectorId: "SCR-AMZ-01",
    message: "extracted 1,240 records.",
    timeText: "Just now",
    type: "success",
    timestamp: "10:42:01 AM"
  },
  {
    id: "log-2",
    collectorId: "SCR-SKY-04",
    message: "encountered rate limit. Backing off (5s).",
    timeText: "2 min ago",
    type: "warning",
    timestamp: "10:41:55 AM"
  },
  {
    id: "log-3",
    collectorId: "SCR-WAL-02",
    message: "proxy rotated successfully.",
    timeText: "5 min ago",
    type: "info",
    timestamp: "10:41:30 AM"
  },
  {
    id: "log-4",
    collectorId: "SCR-TGT-01",
    message: "connection timeout.",
    timeText: "12 min ago",
    type: "error",
    timestamp: "10:40:12 AM"
  },
  {
    id: "log-5",
    collectorId: "SCR-BBY-02",
    message: "extraction pipeline healthy.",
    timeText: "15 min ago",
    type: "success",
    timestamp: "10:39:45 AM"
  }
];

export const mockFinancialImpactScores: VendorImpactScore[] = [
  {
    vendor: "OpenAI",
    score: 92,
    coreDrivers: "Price Increase, Limits",
    annualDelta: "+$180k",
    status: "Calculated",
    statusType: "success",
    impactColor: "red"
  },
  {
    vendor: "Salesforce",
    score: 78,
    coreDrivers: "Renewal Exp.",
    annualDelta: "+$120k",
    status: "Estimate",
    statusType: "neutral",
    impactColor: "amber"
  },
  {
    vendor: "AWS",
    score: 35,
    coreDrivers: "Usage Optimize",
    annualDelta: "-$45k",
    status: "Calculated",
    statusType: "success",
    impactColor: "green"
  }
];

export interface WatchlistData {
  id: string;
  name: string;
  description: string;
  vendorCount: number;
  healthPercentage: number;
  recentChanges: number;
  estimatedImpact: string;
  icon: string;
  archived: boolean;
}

export interface ReportData {
  id: string;
  title: string;
  dateRange: string;
  category: 'Financial' | 'Executive' | 'Technical' | 'All';
  status: 'Complete' | 'Scheduled' | 'Review Needed';
  changesCount?: number;
  impactText?: string;
  generatedTimeText?: string;
  runsTimeText?: string;
  anomaliesCount?: number;
  uptimeText?: string;
  failuresCount?: number;
}

export interface AlertData {
  id: string;
  severity: 'critical' | 'high' | 'info';
  timeText: string;
  vendorName: string;
  vendorLogoUrl: string;
  title: string;
  description: string;
  impactAmount?: string;
  affectedWatchlist?: string;
  actionByText?: string;
  potentialImpactText?: string;
  isRead: boolean;
  isSnoozed: boolean;
}

export const mockWatchlists: WatchlistData[] = [
  {
    id: "ai-infrastructure",
    name: "AI Infrastructure Stack",
    description: "Core AI and LLM providers",
    vendorCount: 12,
    healthPercentage: 98,
    recentChanges: 4,
    estimatedImpact: "+$120k",
    icon: "memory",
    archived: false
  },
  {
    id: "engineering-tooling",
    name: "Engineering Tooling",
    description: "DevTools and infra",
    vendorCount: 45,
    healthPercentage: 100,
    recentChanges: 2,
    estimatedImpact: "-$2k",
    icon: "build",
    archived: false
  },
  {
    id: "q4-renewal-risk",
    name: "Q4 Renewal Risk",
    description: "High-value renewals before year-end",
    vendorCount: 8,
    healthPercentage: 85,
    recentChanges: 1,
    estimatedImpact: "+$450k",
    icon: "warning",
    archived: false
  },
  {
    id: "competitor-feed",
    name: "Competitor Feed",
    description: "Monitoring market pricing shifts",
    vendorCount: 22,
    healthPercentage: 92,
    recentChanges: 15,
    estimatedImpact: "N/A",
    icon: "trending_up",
    archived: false
  },
  {
    id: "legacy-saas",
    name: "Legacy SaaS Services",
    description: "Backoffice software utilities",
    vendorCount: 5,
    healthPercentage: 80,
    recentChanges: 0,
    estimatedImpact: "$0",
    icon: "cloud",
    archived: true
  },
  {
    id: "marketing-adtech",
    name: "Marketing AdTech Channels",
    description: "Acquisition and campaign platforms",
    vendorCount: 14,
    healthPercentage: 100,
    recentChanges: 0,
    estimatedImpact: "$0",
    icon: "ads_click",
    archived: true
  }
];

export const mockReports: ReportData[] = [
  {
    id: "weekly-pricing-oct-31",
    title: "Weekly Pricing Report",
    dateRange: `${getRelativeDateString(7)} - ${getFormattedCurrentDate()}`,
    category: "Financial",
    status: "Complete",
    changesCount: 42,
    impactText: "+$12k",
    generatedTimeText: `Today, ${getFormattedCurrentTime()}`
  },
  {
    id: "monthly-procurement-oct",
    title: "Monthly Procurement",
    dateRange: `${getRelativeDateString(30)} - ${getFormattedCurrentDate()}`,
    category: "Executive",
    status: "Scheduled",
    runsTimeText: `${getRelativeDateString(-1)}, 12:00 AM`
  },
  {
    id: "vendor-change-q3-2024",
    title: "Vendor Change Report",
    dateRange: "Current Quarter Overview",
    category: "All",
    status: "Complete",
    changesCount: 14,
    anomaliesCount: 3,
    generatedTimeText: getRelativeDateString(5)
  },
  {
    id: "cost-impact-ytd-2024",
    title: "Cost Impact Report",
    dateRange: "YTD Overview",
    category: "Financial",
    status: "Complete",
    changesCount: 180,
    impactText: "+$845k",
    generatedTimeText: getRelativeDateString(14)
  },
  {
    id: "scraper-reliability-7d",
    title: "Scraper Reliability",
    dateRange: "Last 7 Days",
    category: "Technical",
    status: "Review Needed",
    uptimeText: "99.1%",
    failuresCount: 12,
    generatedTimeText: `Today, ${getFormattedCurrentTime()}`
  }
];

export const mockAlerts: AlertData[] = [
  {
    id: "openai-api-increase",
    severity: "critical",
    timeText: "12 mins ago",
    vendorName: "OpenAI",
    vendorLogoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTo6q0NWheGNV-ybY7NmbAAvE8TSX_tMpPXQPi7Cj90R2FX0-5IjMMA0QHGsCIOJv7ty4aCbpWsQyygAO43598mD9x_WJhEglPMAOUoPs2e79CNQyGDjboMU8qoBYhpE4h2z2yTtNjPTpFVW8A4sZi4S-VTxO7ZC0SZ0G5gQT9i4wsaZaEt7YimEODTCl_Zy8y-kqekuHBCqCJG2I6kK_UJRNZ6_wQlAl_T6JhN_fJVaJXnq9yOtS5",
    title: "OpenAI: API Price Increase",
    description: "Detected a sudden 15% increase in base API call pricing across GPT-4 tiered plans.",
    impactAmount: "+$12,450.00",
    affectedWatchlist: "Core Infrastructure",
    isRead: false,
    isSnoozed: false
  },
  {
    id: "aws-enterprise-support",
    severity: "high",
    timeText: "2 hours ago",
    vendorName: "AWS",
    vendorLogoUrl: "",
    title: "AWS: Enterprise Support Plan Structure Change",
    description: "New tiers introduced for enterprise support, deprecating the current legacy tier attached to account 8849-XXXX.",
    actionByText: getRelativeDateString(-7),
    potentialImpactText: "Service Downgrade",
    isRead: false,
    isSnoozed: false
  },
  {
    id: "stripe-dom-change",
    severity: "info",
    timeText: "5 hours ago",
    vendorName: "Stripe",
    vendorLogoUrl: "",
    title: "Stripe: Pricing Page DOM Change",
    description: "Minor structural changes detected on target URL. Scraper self-healed using fuzzy matching logic.",
    isRead: false,
    isSnoozed: false
  }
];

