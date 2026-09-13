import { MessageSquareText } from "lucide-react";
import type { OrderDetails } from "@/types/order";
export function OrderMetadata({ order }: { order: OrderDetails }) {
  return (
    <section className="admin-card">
      <header className="border-b px-4 py-3.5">
        <h2 className="text-[15px] font-semibold">Order notes</h2>
      </header>
      <div className="p-4 text-[13px]">
        {order.customerNote ? (
          <div className="flex gap-2">
            <MessageSquareText
              size={15}
              className="mt-0.5 shrink-0 text-[var(--color-text-muted)]"
            />
            <p className="text-[var(--color-text-secondary)]">{order.customerNote}</p>
          </div>
        ) : (
          <p className="text-[var(--color-text-muted)]">No customer note.</p>
        )}
        <dl className="mt-4 space-y-1.5 border-t pt-3 text-[12px]">
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--color-text-muted)]">Source</dt>
            <dd>{order.source ?? "Online store"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--color-text-muted)]">Currency</dt>
            <dd>{order.currency}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--color-text-muted)]">Payment</dt>
            <dd>{order.paymentMethod}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
