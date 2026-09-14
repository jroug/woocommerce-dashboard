import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Order } from "@/types/order";
import { Panel } from "./Panel";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";

const date = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <Panel
      title="Recent orders"
      description="Latest activity across your store"
      action={
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-text)] hover:underline"
        >
          View all
          <ArrowUpRight size={13} />
        </Link>
      }
      className="overflow-hidden"
    >
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <caption className="sr-only">Five most recent orders</caption>
          <thead className="border-y bg-[var(--color-surface-subdued)] text-[12px] text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-5 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-5 py-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => {
              const customerName =
                `${order.customer.firstName} ${order.customer.lastName}`.trim() || "Guest";
              const initials =
                `${order.customer.firstName[0] ?? ""}${order.customer.lastName[0] ?? ""}` || "G";
              return (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-[var(--color-surface-subdued)]"
                >
                  <td className="px-5 py-2.5 font-semibold text-[var(--color-text)]">
                    <Link href={`/orders/${order.id}`} className="hover:underline">
                      #{order.number}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-[var(--color-bg-subdued)] text-[9px] font-semibold text-[var(--color-text-secondary)]">
                        {initials}
                      </span>
                      <span className="font-medium text-[var(--color-text)]">{customerName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">
                    {date.format(new Date(order.dateCreated))}
                  </td>
                  <td className="px-3 py-2.5">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-2.5 text-right font-semibold tabular-nums text-[var(--color-text)]">
                    {new Intl.NumberFormat("en-IE", {
                      style: "currency",
                      currency: order.currency,
                    }).format(Number(order.total))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
