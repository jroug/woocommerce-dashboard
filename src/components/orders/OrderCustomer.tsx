import { Mail, Phone } from "lucide-react";
import type { OrderDetails } from "@/types/order";
export function OrderCustomer({ order }: { order: OrderDetails }) {
  const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: order.currency });
  const name = `${order.customer.firstName} ${order.customer.lastName}`.trim() || "Guest";
  const initials = `${order.customer.firstName[0] ?? ""}${order.customer.lastName[0] ?? ""}` || "G";
  return (
    <section className="admin-card">
      <header className="border-b px-4 py-3.5">
        <h2 className="text-[15px] font-semibold">Customer</h2>
      </header>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-bg-subdued)] text-[12px] font-semibold">
            {initials}
          </span>
          <div>
            <p className="text-[13px] font-semibold">{name}</p>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              {order.customer.id ? `Customer #${order.customer.id}` : "Guest checkout"}
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-[12px]">
          <a
            href={`mailto:${order.customer.email}`}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:underline"
          >
            <Mail size={14} />
            {order.customer.email}
          </a>
          <a
            href={`tel:${order.customerPhone}`}
            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:underline"
          >
            <Phone size={14} />
            {order.customerPhone}
          </a>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-[var(--radius-md)] bg-[var(--color-surface-subdued)] p-3 text-[12px]">
          <div>
            <p className="text-[var(--color-text-muted)]">Orders</p>
            <p className="font-semibold">{order.customerOrdersCount ?? "—"}</p>
          </div>
          <div>
            <p className="text-[var(--color-text-muted)]">Total spent</p>
            <p className="font-semibold">
              {order.customerTotalSpent === null
                ? "—"
                : money.format(Number(order.customerTotalSpent))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
