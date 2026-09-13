import type { OrderStatus } from "@/types/order";

const styles: Record<OrderStatus, string> = {
  pending: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  processing: "bg-[var(--color-info-bg)] text-[var(--color-info)]",
  "on-hold": "bg-[#f2edfc] text-[#6948a5]",
  completed: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
  cancelled: "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]",
  refunded: "bg-[#f2edfc] text-[#6948a5]",
  failed: "bg-[var(--color-error-bg)] text-[var(--color-error)]",
};
const labels: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  "on-hold": "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  failed: "Failed",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[status] ?? "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"}`}
    >
      {labels[status] ?? status.replaceAll("-", " ")}
    </span>
  );
}
