import type { CustomerDetails } from "@/types/customer";
const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
export function CustomerSummary({ customer }: { customer: CustomerDetails }) {
  const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: customer.currency });
  const metrics = [
    { label: "Total spent", value: money.format(Number(customer.totalSpent)) },
    { label: "Orders", value: customer.ordersCount.toString() },
    {
      label: "Average order value",
      value:
        customer.hasAverageOrderValue === false
          ? "—"
          : money.format(Number(customer.averageOrderValue)),
    },
    {
      label: "Last order",
      value: customer.lastOrderDate ? date.format(new Date(customer.lastOrderDate)) : "No orders",
    },
  ];
  return (
    <section
      className="admin-card grid grid-cols-2 overflow-hidden sm:grid-cols-4"
      aria-label="Customer summary"
    >
      {metrics.map((metric, index) => (
        <div
          className={`p-4 ${index % 2 ? "border-l" : ""} ${index > 1 ? "border-t sm:border-t-0" : ""} sm:border-l sm:first:border-l-0`}
          key={metric.label}
        >
          <p className="text-[11px] text-[var(--color-text-muted)]">{metric.label}</p>
          <p className="mt-1 text-[16px] font-semibold tabular-nums">{metric.value}</p>
        </div>
      ))}
    </section>
  );
}
