import type { CustomerDetails } from "@/types/customer";
const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
export function CustomerBehavior({ customer }: { customer: CustomerDetails }) {
  const days = customer.daysSinceLastOrder ?? null;
  const values = [
    {
      label: "First order",
      value: customer.firstOrderDate ? date.format(new Date(customer.firstOrderDate)) : "—",
    },
    { label: "Days since last order", value: days === null ? "—" : days.toString() },
    { label: "Refunds", value: customer.refundsCount.toString() },
    {
      label: "Last active",
      value: customer.lastActiveDate ? date.format(new Date(customer.lastActiveDate)) : "—",
    },
  ];
  return (
    <section className="admin-card">
      <header className="border-b px-4 py-3.5 sm:px-5">
        <h2 className="text-[15px] font-semibold">Customer behavior</h2>
      </header>
      <dl className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 sm:p-5">
        {values.map((item) => (
          <div key={item.label}>
            <dt className="text-[11px] text-[var(--color-text-muted)]">{item.label}</dt>
            <dd className="mt-1 text-[13px] font-semibold">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
