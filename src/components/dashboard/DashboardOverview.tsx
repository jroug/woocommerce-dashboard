"use client";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type { DashboardData, DateRange } from "@/types/dashboard";
import { InventoryAlerts } from "./InventoryAlerts";
import { OrderStatus } from "./OrderStatus";
import { QuickActions } from "./QuickActions";
import { RecentOrders } from "./RecentOrders";
import { RevenueChart } from "./RevenueChart";
import { StatCard } from "./StatCard";
import { TopProducts } from "./TopProducts";

export function DashboardOverview({ dashboard }: { dashboard: DashboardData }) {
  const [range, setRange] = useState<DateRange>("7d");
  const period = dashboard.periods[range];
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date());
  return (
    <main className="mx-auto page-container px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[22px] font-semibold leading-7 tracking-[-.02em] text-[var(--color-text)]">
            Dashboard
          </h1>
          <p className="mt-0.5 text-[13px] text-[var(--color-text-secondary)]">
            {today} · Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <label className="admin-control flex items-center gap-2 self-start px-3 sm:self-auto">
          <CalendarDays size={15} className="text-[var(--color-text-secondary)]" />
          <span className="sr-only">Date range</span>
          <select
            value={range}
            onChange={(event) => setRange(event.target.value as DateRange)}
            className="cursor-pointer appearance-none bg-transparent pr-4 text-[13px] font-medium outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <span aria-hidden="true" className="-ml-3 text-[10px] text-[var(--color-text-secondary)]">
            ▾
          </span>
        </label>
      </div>
      <section
        aria-label="Key performance indicators"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {period.stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>
      <div className="mt-3 grid min-w-0 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <RevenueChart data={period.revenue} currency={dashboard.currency} />
        <OrderStatus
          items={period.orderStatuses}
          totalOrders={
            period.stats.find((stat) => stat.id === "orders")
              ? Number(period.stats.find((stat) => stat.id === "orders")?.value.replaceAll(",", ""))
              : 0
          }
        />
      </div>
      <div className="mt-3 grid min-w-0 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <RecentOrders orders={dashboard.recentOrders} />
        <TopProducts products={period.topProducts} currency={dashboard.currency} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <InventoryAlerts summary={dashboard.inventorySummary} />
        <QuickActions />
      </div>
    </main>
  );
}
