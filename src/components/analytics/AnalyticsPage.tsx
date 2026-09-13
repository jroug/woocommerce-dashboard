"use client";
import { useMemo, useState } from "react";
import { analyticsRanges } from "@/data/analytics";
import type {
  AnalyticsKpi,
  AnalyticsRange,
  CategoryPerformance as CategoryMetric,
  ProductPerformance as ProductMetric,
} from "@/types/analytics";
import type { Customer } from "@/types/customer";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import { AnalyticsEmpty } from "./AnalyticsStates";
import { AnalyticsHeader } from "./AnalyticsHeader";
import { AnalyticsKpis } from "./AnalyticsKpis";
import { AovTrend } from "./AovTrend";
import { CategoryPerformance } from "./CategoryPerformance";
import { ConversionFunnel } from "./ConversionFunnel";
import { CustomerAnalytics } from "./CustomerAnalytics";
import { OrderStatusAnalytics } from "./OrderStatusAnalytics";
import { OrdersChart } from "./OrdersChart";
import { ProductPerformance } from "./ProductPerformance";
import { RefundAnalytics } from "./RefundAnalytics";
import { SalesChart } from "./SalesChart";
import { SalesSources } from "./SalesSources";
const money = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});
// Date ranges follow the fixed August 2026 demo snapshot.
const cutoffs: Record<AnalyticsRange, string> = {
  today: "2026-08-30T00:00:00Z",
  "7d": "2026-08-23T00:00:00Z",
  "30d": "2026-07-31T00:00:00Z",
  "90d": "2026-06-01T00:00:00Z",
  year: "2026-01-01T00:00:00Z",
};
export function AnalyticsPage({
  orders,
  customers,
  products,
}: {
  orders: Order[];
  customers: Customer[];
  products: Product[];
}) {
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [compare, setCompare] = useState(true);
  // Charts and comparisons use synthetic fixtures; totals below come from filtered orders.
  const data = analyticsRanges[range];
  const filteredOrders = useMemo(
    () => orders.filter((order) => new Date(order.dateCreated) >= new Date(cutoffs[range])),
    [orders, range],
  );
  const selectedCustomerIds = new Set(filteredOrders.map((order) => order.customer.id));
  const filteredCustomers = customers.filter((customer) => selectedCustomerIds.has(customer.id));
  // Sales and AOV include every order status; refunds are reported separately.
  const sales = filteredOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const refunded = filteredOrders
    .filter((order) => order.status === "refunded" || order.paymentStatus === "refunded")
    .reduce((sum, order) => sum + Number(order.total), 0);
  const returning = filteredCustomers.filter((customer) => customer.ordersCount > 1).length;
  const values = [
    money.format(sales),
    filteredOrders.length.toString(),
    money.format(filteredOrders.length ? sales / filteredOrders.length : 0),
    filteredCustomers.length.toString(),
    `${filteredCustomers.length ? ((returning / filteredCustomers.length) * 100).toFixed(1) : 0}%`,
    money.format(refunded),
  ];
  const labels = [
    "Total sales",
    "Orders",
    "Average order value",
    "Customers",
    "Returning customer rate",
    "Refunds",
  ];
  const kpis: AnalyticsKpi[] = labels.map((label, index) => ({
    label,
    value: values[index],
    change: data.comparisonChanges[index],
    positive: index === 5 ? data.comparisonChanges[index] < 0 : data.comparisonChanges[index] >= 0,
  }));
  const productMetrics = useMemo<ProductMetric[]>(() => {
    const map = new Map<
      number,
      { name: string; units: number; revenue: number; orders: Set<number> }
    >();
    filteredOrders.forEach((order) =>
      order.lineItems.forEach((item) => {
        const current = map.get(item.productId) ?? {
          name: item.name,
          units: 0,
          revenue: 0,
          orders: new Set<number>(),
        };
        current.units += item.quantity;
        current.revenue += Number(item.total);
        // Multiple lines for the same product still count as one order.
        current.orders.add(order.id);
        map.set(item.productId, current);
      }),
    );
    return [...map.entries()]
      .map(([id, item]) => ({
        id,
        name: item.name,
        unitsSold: item.units,
        revenue: item.revenue,
        orders: item.orders.size,
        salesShare: sales ? (item.revenue / sales) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, sales]);
  const categories = useMemo<CategoryMetric[]>(() => {
    const productCategories = new Map(
      products.map((product) => [product.id, product.category.name]),
    );
    const map = new Map<string, { revenue: number; units: number }>();
    filteredOrders.forEach((order) =>
      order.lineItems.forEach((item) => {
        // Order fixtures use IDs absent from the catalog, so unmatched items remain in "Other".
        const name = productCategories.get(item.productId) ?? "Other";
        const current = map.get(name) ?? { revenue: 0, units: 0 };
        current.revenue += Number(item.total);
        current.units += item.quantity;
        map.set(name, current);
      }),
    );
    return [...map.entries()]
      .map(([name, item]) => ({
        name,
        revenue: item.revenue,
        unitsSold: item.units,
        salesShare: sales ? (item.revenue / sales) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, products, sales]);
  return (
    <main className="mx-auto page-container px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <AnalyticsHeader
        range={range}
        compare={compare}
        onRangeChange={setRange}
        onCompareChange={setCompare}
      />
      <AnalyticsKpis items={kpis} compare={compare} />
      {filteredOrders.length === 0 ? (
        <AnalyticsEmpty onChangeRange={() => setRange("30d")} />
      ) : (
        <div className="mt-3 space-y-3">
          <SalesChart data={data.series} compare={compare} />
          <div className="grid gap-3 lg:grid-cols-2">
            <OrdersChart data={data.series} />
            <AovTrend data={data.series} change={data.comparisonChanges[2]} />
          </div>
          <ProductPerformance products={productMetrics} />
          <div className="grid gap-3 lg:grid-cols-2">
            <CategoryPerformance categories={categories} />
            <OrderStatusAnalytics orders={filteredOrders} />
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <CustomerAnalytics customers={filteredCustomers} />
            <RefundAnalytics orders={filteredOrders} />
          </div>
          <ConversionFunnel data={data.conversion} />
          <SalesSources sources={data.sources} />
        </div>
      )}
    </main>
  );
}
