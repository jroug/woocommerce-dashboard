import { PackageCheck, Pencil, Plus, Truck } from "lucide-react";
import type { OrderDetails } from "@/types/order";
const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});
const labels = {
  unfulfilled: "Unfulfilled",
  fulfilled: "Fulfilled",
  shipped: "Shipped",
  unknown: "Not available",
} as const;
export function OrderFulfillment({ order }: { order: OrderDetails }) {
  const complete = ["fulfilled", "shipped"].includes(order.fulfillmentStatus);
  return (
    <section className="admin-card">
      <header className="flex items-center justify-between border-b px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-2">
          <Truck size={16} />
          <h2 className="text-[15px] font-semibold">Fulfillment</h2>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${complete ? "bg-[var(--color-success-bg)] text-[var(--color-success)]" : "bg-[var(--color-warning-bg)] text-[var(--color-warning)]"}`}
        >
          {labels[order.fulfillmentStatus]}
        </span>
      </header>
      <div className="grid gap-3 p-4 text-[13px] sm:grid-cols-2 sm:p-5">
        <div>
          <p className="text-[12px] text-[var(--color-text-secondary)]">Shipping method</p>
          <p className="font-medium">{order.shippingMethod}</p>
        </div>
        <div>
          <p className="text-[12px] text-[var(--color-text-secondary)]">Carrier</p>
          <p>{order.carrier ?? "Not provided"}</p>
        </div>
        <div>
          <p className="text-[12px] text-[var(--color-text-secondary)]">Tracking number</p>
          <p className="font-mono text-[12px]">{order.trackingNumber ?? "Not provided"}</p>
        </div>
        <div>
          <p className="text-[12px] text-[var(--color-text-secondary)]">Shipped</p>
          <p>
            {order.dateFulfilled ? dateTime.format(new Date(order.dateFulfilled)) : "Not provided"}
          </p>
        </div>
      </div>
      {!order.readOnly && (
        <div className="flex flex-wrap justify-end gap-2 border-t px-4 py-3 sm:px-5">
          {complete ? (
            <button
              type="button"
              className="admin-control flex h-8 items-center gap-1.5 px-2.5 text-[12px] font-medium"
            >
              <Pencil size={13} />
              Edit tracking
            </button>
          ) : (
            <>
              <button
                type="button"
                className="admin-control flex h-8 items-center gap-1.5 px-2.5 text-[12px] font-medium"
              >
                <Plus size={13} />
                Add tracking
              </button>
              <button
                type="button"
                className="flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--color-action)] px-2.5 text-[12px] font-semibold text-white"
              >
                <PackageCheck size={13} />
                Mark as fulfilled
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
