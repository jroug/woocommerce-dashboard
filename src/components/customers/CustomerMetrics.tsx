import type { Customer } from "@/types/customer";
export function CustomerMetrics({
  customers,
  currency = "EUR",
}: {
  customers: Customer[];
  currency?: string;
}) {
  const money = new Intl.NumberFormat("en-IE", { style: "currency", currency });
  const totalOrders = customers.reduce((sum, customer) => sum + customer.ordersCount, 0);
  const totalSpent = customers.reduce((sum, customer) => sum + Number(customer.totalSpent), 0);
  const withAov = customers.filter((customer) => customer.hasAverageOrderValue !== false);
  const avgAov = withAov.length
    ? withAov.reduce((sum, customer) => sum + Number(customer.averageOrderValue), 0) /
      withAov.length
    : 0;
  const metrics = [
    { label: "Customers", value: customers.length.toLocaleString() },
    {
      label: "Average orders",
      value: new Intl.NumberFormat("en-IE", { maximumFractionDigits: 2 }).format(
        customers.length ? totalOrders / customers.length : 0,
      ),
    },
    {
      label: "Average lifetime spend",
      value: money.format(customers.length ? totalSpent / customers.length : 0),
    },
    { label: "Average order value", value: money.format(avgAov) },
  ];
  return (
    <section
      className="mb-4 grid grid-cols-2 overflow-hidden rounded-[var(--radius-lg)] border bg-[var(--color-surface)] sm:grid-cols-4"
      aria-label="Customer summary"
    >
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className={`px-4 py-3 ${index % 2 ? "border-l" : ""} ${index > 1 ? "border-t sm:border-t-0" : ""} sm:border-l sm:first:border-l-0`}
        >
          <p className="text-[11px] text-[var(--color-text-muted)]">{metric.label}</p>
          <p className="mt-0.5 text-[17px] font-semibold tabular-nums">{metric.value}</p>
        </div>
      ))}
    </section>
  );
}
