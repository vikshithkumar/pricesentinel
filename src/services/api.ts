// PriceSentinel API Client Service
// Base URL pointing to Java Spring Boot backend at http://localhost:8080/api

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface DashboardSummaryResponse {
  totalMonitoredVendors: number;
  openAlertsCount: number;
  totalAnnualImpact: number;
  overallScraperHealthPercent: number;
  recentEventsCount: number;
}

export interface TrendPoint {
  date: string;
  alertCount: number;
  impactAmount: number;
  activeScrapers: number;
}

export interface TrendResponse {
  points: TrendPoint[];
}

export interface MonitorStatusResponse {
  monitorId: string;
  status: string;
  schedule: string;
  lastSuccessAt: string | null;
}

export interface VendorResponse {
  id: string;
  name: string;
  category: string;
  pricingUrl: string;
  monitor: MonitorStatusResponse;
}

export interface RunNowResponse {
  scrapeRunId: string;
  statusUrl: string;
}

export interface PlanResponse {
  id: string;
  name: string;
  normalizedName: string;
  priceAmount: number;
  currency: string;
  billingPeriod: string;
  usageLimits: any;
  features: any;
}

export interface SnapshotResponse {
  snapshotId: string;
  capturedAt: string;
  sourceUrl: string;
  extractionConfidence: number;
  plans: PlanResponse[];
}

export interface AlertResponse {
  changeEventId: string;
  vendorId: string;
  vendorName: string;
  type: string;
  baseScore: number;
  finalScore: number;
  confidence: number;
  impactSummary: string;
  status: string;
  createdAt: string;
}

export interface AlertDetailResponse extends AlertResponse {
  beforeJson: any;
  afterJson: any;
  beforeSnapshotId: string;
  afterSnapshotId: string;
}

export interface HistoryEntryResponse {
  snapshotId: string;
  capturedAt: string;
  extractionConfidence: number;
  changeEvents: AlertResponse[];
}

export interface ExposureRequest {
  currentPlan: string;
  seatCount: number;
  billingCycle: string;
  monthlySpend?: number | null;
}

export interface ExposureResponse {
  id: string;
  vendorId: string;
  currentPlan: string;
  seatCount: number;
  billingCycle: string;
  monthlySpend: number | null;
  updatedAt: string;
}

export interface SpendCategoryResponse {
  category: string;
  monthlySpend: number;
  percentage: number;
}

export interface VendorImpactScoreResponse {
  vendorId: string;
  vendorName: string;
  impactScore: number;
  coreDrivers: string[];
  annualDelta: number;
}

export interface FinancialImpactResponse {
  totalProjectedAnnualSpend: number;
  costVariancePercentage: number;
  categoryBreakdown: SpendCategoryResponse[];
  vendorImpactScores: VendorImpactScoreResponse[];
}

export interface CollectorNodeResponse {
  id: string;
  vendorId: string;
  vendorName: string;
  collectorId: string;
  category: string;
  status: string;
  successRate: number;
  latencyMs: number;
  lastScanAt: string;
}

export interface ScraperHealthCenterResponse {
  globalSuccessRate: number;
  avgLatencyMs: number;
  activeScrapers: number;
  degradedScrapers: number;
  failedScrapers: number;
  collectors: CollectorNodeResponse[];
}

export interface PipelineActivityLogResponse {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  collectorId: string;
}

export interface SelfHealingStatusResponse {
  collectorId: string;
  vendorName: string;
  status: string;
  failedSelector: string;
  repairedSelector: string;
  recoveryTimeMs: number;
  confidenceScore: number;
  fieldsRecovered: string[];
}

export interface SelfHealingLogResponse {
  id: string;
  collectorId: string;
  vendorName: string;
  failedSelector: string;
  repairedSelector: string;
  recoveryTimeMs: number;
  confidenceScore: number;
  status: string;
  fieldsRecovered: string;
  createdAt: string;
}

export interface UserSettingsResponse {
  name: string;
  email: string;
  timeZone: string;
  dateFormat: string;
  theme: string;
}

export interface UpdateSettingsRequest {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  timeZone?: string;
  dateFormat?: string;
  theme?: string;
}

export interface ScrapeRealDataResult {
  targetUrl: string;
  vendorName: string;
  httpStatus: number;
  payloadSizeBytes: number;
  contentType: string;
  serverHeader: string;
  extractedPriceText: string;
  extractedTierName: string;
  extractedTitle: string;
  liveLogs: string[];
  timestamp: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API Request failed (${res.status} ${res.statusText}): ${text}`);
  }
  if (res.status === 204) {
    return null as T;
  }
  return res.json();
}

export const api = {
  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    const res = await fetch(`${BASE_URL}/dashboard/summary`);
    return handleResponse<DashboardSummaryResponse>(res);
  },

  async getDashboardTrend(): Promise<TrendResponse> {
    const res = await fetch(`${BASE_URL}/dashboard/trend`);
    return handleResponse<TrendResponse>(res);
  },

  // Vendors
  async getVendors(): Promise<VendorResponse[]> {
    const res = await fetch(`${BASE_URL}/vendors`);
    return handleResponse<VendorResponse[]>(res);
  },

  async createVendor(name: string, category: string, pricingUrl: string, pricingPlan?: string): Promise<VendorResponse> {
    const res = await fetch(`${BASE_URL}/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, pricingUrl, pricingPlan }),
    });
    return handleResponse<VendorResponse>(res);
  },

  async triggerVendorRun(vendorId: string): Promise<RunNowResponse> {
    const res = await fetch(`${BASE_URL}/vendors/${vendorId}/run`, {
      method: 'POST',
    });
    return handleResponse<RunNowResponse>(res);
  },

  async getVendorSnapshot(vendorId: string): Promise<SnapshotResponse | null> {
    const res = await fetch(`${BASE_URL}/vendors/${vendorId}/snapshot`);
    return handleResponse<SnapshotResponse | null>(res);
  },

  async getVendorHistory(vendorId: string): Promise<HistoryEntryResponse[]> {
    const res = await fetch(`${BASE_URL}/vendors/${vendorId}/history`);
    return handleResponse<HistoryEntryResponse[]>(res);
  },

  async getVendorExposure(vendorId: string): Promise<ExposureResponse | null> {
    const res = await fetch(`${BASE_URL}/vendors/${vendorId}/exposure`);
    return handleResponse<ExposureResponse | null>(res);
  },

  async upsertVendorExposure(vendorId: string, req: ExposureRequest): Promise<ExposureResponse> {
    const res = await fetch(`${BASE_URL}/vendors/${vendorId}/exposure`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<ExposureResponse>(res);
  },

  // Alerts
  async getAlerts(status?: string): Promise<AlertResponse[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${BASE_URL}/alerts${query}`);
    return handleResponse<AlertResponse[]>(res);
  },

  async getAlertDetail(changeEventId: string): Promise<AlertDetailResponse> {
    const res = await fetch(`${BASE_URL}/alerts/${changeEventId}`);
    return handleResponse<AlertDetailResponse>(res);
  },

  async dismissAlert(changeEventId: string): Promise<AlertResponse> {
    const res = await fetch(`${BASE_URL}/alerts/${changeEventId}/dismiss`, {
      method: 'POST',
    });
    return handleResponse<AlertResponse>(res);
  },

  // Financial Impact
  async getFinancialImpact(): Promise<FinancialImpactResponse> {
    const res = await fetch(`${BASE_URL}/intelligence/financial-impact`);
    return handleResponse<FinancialImpactResponse>(res);
  },

  async downloadFinancialImpactCsv(): Promise<Blob> {
    const res = await fetch(`${BASE_URL}/intelligence/financial-impact/reports/csv`, {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(`Failed to download CSV: ${res.statusText}`);
    }
    return res.blob();
  },

  // Scrapers
  async getScraperHealthCenter(category?: string, status?: string): Promise<ScraperHealthCenterResponse> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${BASE_URL}/scrapers/health${query}`);
    return handleResponse<ScraperHealthCenterResponse>(res);
  },

  async getPipelineLogs(): Promise<PipelineActivityLogResponse[]> {
    const res = await fetch(`${BASE_URL}/scrapers/logs`);
    return handleResponse<PipelineActivityLogResponse[]>(res);
  },

  async restartCollector(collectorId: string): Promise<CollectorNodeResponse> {
    const res = await fetch(`${BASE_URL}/scrapers/${collectorId}/restart`, {
      method: 'POST',
    });
    return handleResponse<CollectorNodeResponse>(res);
  },

  async bulkRetryStaleScrapers(): Promise<CollectorNodeResponse[]> {
    const res = await fetch(`${BASE_URL}/scrapers/bulk-retry-stale`, {
      method: 'POST',
    });
    return handleResponse<CollectorNodeResponse[]>(res);
  },

  async scrapeRealData(targetUrl: string, vendorName: string): Promise<ScrapeRealDataResult> {
    const res = await fetch(`${BASE_URL}/scrapers/scrape-real`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUrl, vendorName }),
    });
    return handleResponse<ScrapeRealDataResult>(res);
  },

  // Self Healing
  async getSelfHealingStatus(collectorId: string): Promise<SelfHealingStatusResponse> {
    const res = await fetch(`${BASE_URL}/self-healing/status/${collectorId}`);
    return handleResponse<SelfHealingStatusResponse>(res);
  },

  async runBreakTest(collectorId: string, targetUrl?: string): Promise<SelfHealingStatusResponse> {
    const res = await fetch(`${BASE_URL}/self-healing/break-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collectorId, targetUrl }),
    });
    return handleResponse<SelfHealingStatusResponse>(res);
  },

  async applyRepair(collectorId: string, repairedSelector: string): Promise<SelfHealingLogResponse> {
    const res = await fetch(`${BASE_URL}/self-healing/apply-repair`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collectorId, repairedSelector }),
    });
    return handleResponse<SelfHealingLogResponse>(res);
  },

  async getSelfHealingHistory(): Promise<SelfHealingLogResponse[]> {
    const res = await fetch(`${BASE_URL}/self-healing/history`);
    return handleResponse<SelfHealingLogResponse[]>(res);
  },

  // Settings
  async getSettings(): Promise<UserSettingsResponse> {
    const res = await fetch(`${BASE_URL}/settings`);
    return handleResponse<UserSettingsResponse>(res);
  },

  async updateSettings(req: UpdateSettingsRequest): Promise<UserSettingsResponse> {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<UserSettingsResponse>(res);
  },
};
