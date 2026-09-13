import type { OrderDetails } from "@/types/order";
export function OrderTotals({ order }: { order: OrderDetails }) {
  const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: order.currency });
  const rows = [
    { label: "Subtotal", value: Number(order.subtotal) },
    { label: "Discount", value: -Number(order.discountTotal) },
    { label: "Shipping", value: Number(order.shippingTotal) },
    ...(order.fees ?? []).map((fee) => ({ label: fee.name, value: Number(fee.total) })),
    { label: "Tax", value: Number(order.taxTotal) },
  ];
  return (
    <section className="admin-card p-4 sm:p-5">
      <h2 className="mb-3 text-[15px] font-semibold">Order totals</h2>
      <dl className="ml-auto max-w-sm space-y-2 text-[13px]">
        {rows.map((row) => (
          <div className="flex justify-between gap-8" key={row.label}>
            <dt className="text-[var(--color-text-secondary)]">{row.label}</dt>
            <dd className="tabular-nums">
              {row.value < 0 ? `-${money.format(Math.abs(row.value))}` : money.format(row.value)}
            </dd>
          </div>
        ))}
        <div className="flex justify-between gap-8 border-t pt-2.5 font-semibold">
          <dt>Order total</dt>
          <dd className="text-[15px] tabular-nums">{money.format(Number(order.total))}</dd>
        </div>
        <div className="flex justify-between gap-8 text-[var(--color-success)]">
          <dt>Amount paid</dt>
          <dd className="font-semibold tabular-nums">
            {order.amountPaid === null ? "Not recorded" : money.format(Number(order.amountPaid))}
          </dd>
        </div>
        {Number(order.refundedTotal) > 0 && (
          <div className="flex justify-between gap-8">
            <dt>Refunded</dt>
            <dd>{money.format(Number(order.refundedTotal))}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
