import { api, getIsDemoModeActive, subscribeDemoState, APIResponse, DashboardData, ProductAnalytics, InventoryRiskSummary, CustomerRetentionMetrics, AtRiskCustomer, Promotion, Campaign, ChatResponseData, HealthStatus } from '../api';
import { Merchant } from '@/types';
import { MOCK_MERCHANT } from '../demoData';

export { api, getIsDemoModeActive as isDemoModeActive, subscribeDemoState as subscribeDemoMode };

export async function getHealth() {
  const res = await api.getHealth();
  return res.data || { status: 'ok', services: { api: 'healthy', database: 'healthy', n8n: 'available', ml_service: 'available' } };
}

export async function getMerchant(merchantId: number = 1): Promise<Merchant> {
  const res = await api.getMerchant(merchantId);
  return res.data || MOCK_MERCHANT;
}

export async function getDashboard(merchantId: number = 1) {
  const res = await api.getDashboard(merchantId);
  if (!res.success || !res.data) {
    throw new Error(res.error?.message || "Dashboard live backend unreachable.");
  }
  return res.data;
}

export async function getTopProducts(merchantId: number = 1, limit: number = 5) {
  const res = await api.getTopProducts(merchantId, limit);
  return res.data || [];
}

export async function getDecliningProducts(merchantId: number = 1, limit: number = 5) {
  const res = await api.getDecliningProducts(merchantId, limit);
  return res.data || [];
}

export async function getInventoryRisk(merchantId: number = 1) {
  const res = await api.getInventoryRisk(merchantId);
  return res.data!;
}

export async function getCustomerRetention(merchantId: number = 1) {
  const res = await api.getCustomerRetention(merchantId);
  return res.data!;
}

export async function getAtRiskCustomers(merchantId: number = 1, minInactiveDays: number = 30) {
  const res = await api.getAtRiskCustomers(merchantId, minInactiveDays);
  return res.data!;
}

export async function getPromotions(merchantId: number = 1) {
  const res = await api.getPromotions(merchantId);
  return res.data!;
}

export async function getCampaigns(merchantId: number = 1) {
  const res = await api.getCampaigns(merchantId);
  return res.data!;
}

export async function approveCampaign(campaignId: number) {
  const res = await api.approveCampaign(campaignId);
  return res.data!;
}

export async function sendChatMessage(req: { merchant_id: number; message: string; language: 'english' | 'hindi' | 'hinglish' }) {
  const res = await api.sendChatMessage(req.merchant_id, req.message, req.language);
  return res.data!;
}
