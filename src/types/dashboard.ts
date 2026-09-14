export type DateRange = "7d" | "30d" | "12m";
export type TrendDirection = "up" | "down";
export type DashboardOrderStatus =
  "processing" | "pending" | "on-hold" | "completed" | "cancelled" | "refunded" | "failed";
export interface Stat {
  id: "revenue" | "orders" | "average-order-value" | "customers";
  label: string;
  value: string;
  change: number;
  direction: TrendDirection;
}
export interface RevenuePoint {
  label: string;
  revenue: number;
}
export interface DashboardPeriod {
  stats: Stat[];
  revenue: RevenuePoint[];
}

export interface DashboardLivePeriod extends DashboardPeriod {
  orderStatuses: OrderStatusSummary[];
  topProducts: TopProduct[];
}
export interface OrderStatusSummary {
  status: DashboardOrderStatus;
  label: string;
  count: number;
}
export interface TopProduct {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  color: string;
}
export interface InventorySummary {
  lowStock: number;
  outOfStock: number;
}

export interface DashboardData {
  periods: Record<DateRange, DashboardLivePeriod>;
  recentOrders: import("@/types/order").Order[];
  inventorySummary: InventorySummary;
  currency: string;
}
