import Link from "next/link";
import { ArrowLeft, ChevronDown, MoreHorizontal, RotateCcw, XCircle } from "lucide-react";
import type { OrderDetails } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});
export function OrderHeader({ order }: { order: OrderDetails }) {
  return (
    <header className="mb-4">
      <Link
        href="/orders"
        className="mb-3 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
      >
        <ArrowLeft size={15} />
        Orders
      </Link>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          {!order.readOnly && (
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-semibold leading-7 tracking-[-.02em]">
                #{order.number}
              </h1>
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          )}
          <p className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">
            Created {dateTime.format(new Date(order.dateCreated))}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="admin-control flex h-8 items-center gap-1.5 px-2.5">
            <span className="sr-only">Change order status</span>
            <select
              defaultValue={order.status}
              className="cursor-pointer appearance-none bg-transparent pr-4 text-[12px] font-medium outline-none"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="on-hold">On hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
            <ChevronDown size={13} className="-ml-3" />
          </label>
          <button
            type="button"
            className="admin-control flex h-8 items-center gap-1.5 px-2.5 text-[12px] font-medium"
          >
            <RotateCcw size={14} />
            Refund
          </button>
          <button
            type="button"
            className="admin-control hidden h-8 items-center gap-1.5 px-2.5 text-[12px] font-medium text-[var(--color-error)] sm:flex"
          >
            <XCircle size={14} />
            Cancel order
          </button>
          <button
            type="button"
            aria-label="More order actions"
            className="admin-control flex size-8 items-center justify-center"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
