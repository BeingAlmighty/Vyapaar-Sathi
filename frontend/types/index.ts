export interface Merchant {
  id: number;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  business_type: string;
  created_at: string;
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

export interface ProductPerformance {
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

export interface InventoryRisk {
  low_stock_count: number;
  excess_stock_count: number;
  stockout_risk_count: number;
  items: InventoryItem[];
}

export interface CustomerMetrics {
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

export interface BusinessAlert {
  type: "warning" | "opportunity" | "info";
  title: string;
  message: string;
}

export interface DashboardData {
  merchant_id: number;
  sales_summary: SalesSummary;
  top_selling_products: ProductPerformance[];
  declining_products: ProductPerformance[];
  inventory_risk: InventoryRisk;
  customer_metrics: CustomerMetrics;
  alerts_and_opportunities: BusinessAlert[];
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

export type CampaignStatus = 
  | "pending_approval" 
  | "approved" 
  | "rejected" 
  | "scheduled" 
  | "active" 
  | "completed";

export interface Campaign {
  id: number;
  merchant_id: number;
  title: string;
  description?: string;
  campaign_type: string;
  target_audience?: string;
  status: CampaignStatus;
  metrics_json?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export type ChatLanguage = "english" | "hindi" | "hinglish";

export interface ChatRequest {
  merchant_id: number;
  message: string;
  language: ChatLanguage;
}

export interface ChatVisual {
  type: "line_chart" | "bar_chart" | "pie_chart" | "metric_card";
  data_source: string;
  payload?: Record<string, unknown>;
}

export interface ChatResponse {
  message: string;
  language: ChatLanguage;
  visuals: ChatVisual[];
  suggestions: string[];
  workers: string[];
}

export interface HealthStatus {
  status?: string;
  api?: string;
  database?: string;
  n8n?: string;
  ml_service?: string;
  services?: {
    api?: string;
    database?: string;
    n8n?: string;
    ml_service?: string;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
