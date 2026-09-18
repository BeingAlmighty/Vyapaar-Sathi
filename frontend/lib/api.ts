import { MOCK_MERCHANT, MOCK_AT_RISK_CUSTOMERS, MOCK_PROMOTIONS, MOCK_CAMPAIGNS, MOCK_CHAT_RESPONSES, MOCK_HEALTH } from './demoData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface Merchant {
  id: number;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  business_type: string;
  created_at: string;
}

export interface HealthStatus {
  api: string;
  database: string;
  n8n: string;
  ml_service: string;
}

export interface SalesSummary {
  today_sales: number;
  today_orders: number;
  monthly_sales: number;
  monthly_orders: number;
  previous_monthly_sales: number;
  sales_growth_percent: number;
  average_order_value: number;
}

export interface ProductAnalytics {
  product_id: number;
  name: string;
  category: string;
  price: number;
  current_sales: number;
  previous_sales: number;
  growth_percent: number;
  quantity_sold: number;
}

export interface InventoryItem {
  id: number;
  product_id: number;
  product_name: string;
  category: string;
  current_stock: number;
  min_reorder_level: number;
  max_stock_level: number;
  status: string;
  recommended_reorder_qty: number;
  stockout_risk: string;
  last_restocked_at?: string;
}

export interface InventoryRiskSummary {
  low_stock_count: number;
  excess_stock_count: number;
  stockout_risk_count: number;
  items: InventoryItem[];
}

export interface CustomerRetentionMetrics {
  total_customers: number;
  new_customers: number;
  returning_customers: number;
  repeat_purchase_rate: number;
  inactive_customers_count: number;
  at_risk_customers_count: number;
}

export interface AtRiskCustomer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  last_order_date?: string;
  days_inactive: number;
  total_orders: number;
  total_spend: number;
}

export interface Promotion {
  id: number;
  merchant_id: number;
  name: string;
  discount_percent: number;
  discount_amount: number;
  start_date: string;
  end_date: string;
  target_category?: string;
  status: string;
  actual_sales: number;
  incremental_sales: number;
  roi_percent: number;
  effectiveness: "high" | "moderate" | "ineffective";
}

export interface Campaign {
  id: number;
  merchant_id: number;
  title: string;
  description?: string;
  campaign_type: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'scheduled' | 'active' | 'completed';
  target_audience?: string;
  metrics_json?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  merchant_id: number;
  sales_summary: SalesSummary;
  top_selling_products: ProductAnalytics[];
  declining_products: ProductAnalytics[];
  inventory_risk: InventoryRiskSummary;
  customer_metrics: CustomerRetentionMetrics;
  alerts_and_opportunities: Array<{
    type: 'warning' | 'opportunity' | 'info';
    title: string;
    message: string;
  }>;
}

export interface VisualElement {
  type: 'line_chart' | 'bar_chart' | 'pie_chart' | 'metric_card';
  data_source: string;
  payload?: Record<string, any>;
}

export interface ChatResponseData {
  message: string;
  language: 'english' | 'hindi' | 'hinglish';
  visuals: VisualElement[];
  suggestions: string[];
  workers: string[];
}

// Global Demo State Tracker
let isDemoModeActive = false;
const listeners = new Set<(isDemo: boolean) => void>();

function setDemoState(isDemo: boolean) {
  isDemoModeActive = isDemo;
  listeners.forEach((l) => l(isDemo));
}

export function subscribeDemoState(listener: (isDemo: boolean) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getIsDemoModeActive(): boolean {
  return isDemoModeActive;
}

// STRICT FETCHER: Zero fallback data (used for Dashboard to force backend-only data)
async function fetchStrict<T>(
  endpoint: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const json: APIResponse<T> = await res.json();
    if (json.success && json.data) {
      setDemoState(false);
      return json;
    }
    throw new Error(json.error?.message || 'Invalid backend response');
  } catch (err: any) {
    console.error(`[Strict Backend Error] Fetch failed for ${endpoint}:`, err);
    return {
      success: false,
      error: { code: 'BACKEND_UNREACHABLE', message: 'Dashboard requires live backend connection at http://localhost:8000.' },
    };
  }
}

// Generic Fetcher with Automatic Fallback (for non-dashboard features)
async function fetchWithFallback<T>(
  endpoint: string,
  options?: RequestInit,
  fallbackData?: T
): Promise<APIResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const json: APIResponse<T> = await res.json();
    if (json.success && json.data) {
      setDemoState(false);
      return json;
    }
    throw new Error(json.error?.message || 'Invalid backend response');
  } catch (err) {
    console.warn(`[Backend Offline/Fallback] Fetch failed for ${endpoint}:`, err);
    setDemoState(true);
    if (fallbackData !== undefined) {
      return { success: true, data: fallbackData };
    }
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: 'Backend unreachable.' },
    };
  }
}

// ==================== API SERVICE METHODS ====================

export const api = {
  // Health
  getHealth: () =>
    fetchWithFallback<HealthStatus>('/health', { method: 'GET' }, { api: 'healthy', database: 'healthy', n8n: 'available', ml_service: 'available' }),

  // Merchant Profile
  getMerchant: (merchantId: number = 1) =>
    fetchWithFallback<Merchant>(`/api/merchants/${merchantId}`, { method: 'GET' }, MOCK_MERCHANT),

  // Dashboard Overview (STRICT BACKEND ONLY - NO FALLBACK OR MOCK VALUES)
  getDashboard: (merchantId: number = 1) =>
    fetchStrict<DashboardData>(`/api/dashboard/${merchantId}`, { method: 'GET' }),

  // Product Intelligence
  getTopProducts: (merchantId: number = 1, limit: number = 5) =>
    fetchWithFallback<ProductAnalytics[]>(`/api/products/top/${merchantId}?limit=${limit}`, { method: 'GET' }),

  getDecliningProducts: (merchantId: number = 1, limit: number = 5) =>
    fetchWithFallback<ProductAnalytics[]>(`/api/products/declining/${merchantId}?limit=${limit}`, { method: 'GET' }),

  // Inventory Intelligence
  getInventoryRisk: (merchantId: number = 1) =>
    fetchWithFallback<InventoryRiskSummary>(`/api/inventory/risk/${merchantId}`, { method: 'GET' }),

  // Customer Intelligence
  getCustomerRetention: (merchantId: number = 1) =>
    fetchWithFallback<CustomerRetentionMetrics>(`/api/customers/retention/${merchantId}`, { method: 'GET' }),

  getAtRiskCustomers: (merchantId: number = 1, minInactiveDays: number = 30) =>
    fetchWithFallback<AtRiskCustomer[]>(`/api/customers/at-risk/${merchantId}?min_inactive_days=${minInactiveDays}`, { method: 'GET' }, MOCK_AT_RISK_CUSTOMERS as unknown as AtRiskCustomer[]),

  // Promotion Intelligence
  getPromotions: (merchantId: number = 1) =>
    fetchWithFallback<Promotion[]>(`/api/promotions/${merchantId}`, { method: 'GET' }, MOCK_PROMOTIONS as unknown as Promotion[]),

  // Campaign Management
  getCampaigns: (merchantId: number = 1) =>
    fetchWithFallback<Campaign[]>(`/api/campaigns/${merchantId}`, { method: 'GET' }, MOCK_CAMPAIGNS as unknown as Campaign[]),

  approveCampaign: (campaignId: number) =>
    fetchWithFallback<{ campaign_id: number; status: string; message: string; updated_at: string }>(
      `/api/campaigns/${campaignId}/approve`,
      { method: 'POST' }
    ),

  // AI Teammate Chat
  sendChatMessage: (merchantId: number, message: string, language: 'english' | 'hindi' | 'hinglish') =>
    fetchWithFallback<ChatResponseData>(
      '/api/chat',
      {
        method: 'POST',
        body: JSON.stringify({ merchant_id: merchantId, message, language }),
      },
      MOCK_CHAT_RESPONSES.default as unknown as ChatResponseData
    ),
};
