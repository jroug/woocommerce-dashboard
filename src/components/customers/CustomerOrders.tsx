import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Order } from "@/types/order";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
export function CustomerOrders({ orders }: { orders: Order[] }) {
  return (
    <section className="admin-card overflow-hidden">
      <header className="flex items-center justify-between border-b px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold">Order history</h2>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            All orders from this customer
          </p>
        </div>
        <Link
          href="/orders"
          className="flex items-center gap-1 text-[12px] font-medium text-[var(--color-info)]"
        >
          View all orders
          <ArrowRight size={13} />
        </Link>
      </header>
      {orders.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-[12px]">
            <thead className="border-b bg-[var(--color-surface-subdued)] text-[var(--color-text-secondary)]">
              <tr>
                <th className="px-4 py-2 font-medium">Order</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Items</th>
                <th className="px-4 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--color-surface-subdued)]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-semibold underline-offset-2 hover:underline"
                    >
                      #{order.number}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-[var(--color-text-secondary)]">
                    {date.format(new Date(order.dateCreated))}
                  </td>
                  <td className="px-3 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-3 py-3 text-right">{order.itemsCount}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {new Intl.NumberFormat("en-IE", {
                      style: "currency",
                      currency: order.currency,
                    }).format(Number(order.total))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-10 text-center">
          <p className="text-[13px] font-medium">No orders yet</p>
          <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
            This customer has not placed an order.
          </p>
        </div>
      )}
    </section>
  );
}
