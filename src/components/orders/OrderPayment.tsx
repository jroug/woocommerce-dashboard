import { CreditCard, RotateCcw } from "lucide-react";
import type { OrderDetails } from "@/types/order";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});
export function OrderPayment({ order }: { order: OrderDetails }) {
  const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: order.currency });
  return (
    <section className="admin-card">
      <header className="flex items-center justify-between border-b px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-2">
          <CreditCard size={16} />
          <h2 className="text-[15px] font-semibold">Payment</h2>
        </div>
        <PaymentStatusBadge status={order.paymentStatus} />
      </header>
      <div className="grid gap-3 p-4 text-[13px] sm:grid-cols-2 sm:p-5">
        <div>
          <p className="text-[12px] text-[var(--color-text-secondary)]">Method</p>
          <p className="font-medium">{order.paymentMethodTitle}</p>
        </div>
        <div>
          <p className="text-[12px] text-[var(--color-text-secondary)]">Amount</p>
          <p className="font-semibold">{money.format(Number(order.total))}</p>
        </div>
        <div>
          <p className="text-[12px] text-[var(--color-text-secondary)]">Transaction</p>
          <p className="font-mono text-[12px]">{order.transactionId}</p>
        </div>
        <div>
          <p className="text-[12px] text-[var(--color-text-secondary)]">Payment date</p>
          <p>{order.datePaid ? dateTime.format(new Date(order.datePaid)) : "Not paid"}</p>
        </div>
      </div>
      {!order.readOnly && (
        <div className="flex justify-end gap-2 border-t px-4 py-3 sm:px-5">
          <button
            type="button"
            className="admin-control flex h-8 items-center gap-1.5 px-2.5 text-[12px] font-medium"
          >
            <RotateCcw size={13} />
            {order.paymentStatus === "paid" ? "Refund" : "Mark as paid"}
          </button>
        </div>
      )}
    </section>
  );
}
