import type { ProductStatus } from "@/types/product";
const labels: Record<ProductStatus, string> = {
  publish: "Published",
  draft: "Draft",
  pending: "Pending review",
  private: "Private",
  future: "Scheduled",
  trash: "Trash",
};
export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const style =
    status === "publish"
      ? "bg-[var(--color-success-bg)] text-[var(--color-success)]"
      : ["draft", "pending", "future"].includes(status)
        ? "bg-[var(--color-warning-bg)] text-[var(--color-warning)]"
        : "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]";
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${style}`}
    >
      {labels[status]}
    </span>
  );
}
