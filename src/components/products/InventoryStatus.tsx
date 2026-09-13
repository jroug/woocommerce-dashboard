import type { Product } from "@/types/product";
export type InventoryState = "in-stock" | "low-stock" | "out-of-stock";
// Explicit unavailability or zero quantity wins; low-stock warnings require tracked inventory.
export function getInventoryState(product: Product): InventoryState {
  if (product.stockStatus === "outofstock" || product.stockQuantity === 0) return "out-of-stock";
  if (
    product.manageStock &&
    product.stockQuantity !== null &&
    product.stockQuantity <= product.lowStockThreshold
  )
    return "low-stock";
  return "in-stock";
}
const styles: Record<InventoryState, string> = {
  "in-stock": "text-[var(--color-text-secondary)]",
  "low-stock": "text-[var(--color-warning)]",
  "out-of-stock": "text-[var(--color-error)]",
};
export function InventoryStatus({ product }: { product: Product }) {
  const state = getInventoryState(product);
  const text =
    product.stockStatus === "onbackorder"
      ? "On backorder"
      : state === "out-of-stock"
        ? "Out of stock"
        : product.manageStock && product.stockQuantity !== null
          ? `${product.stockQuantity} in stock`
          : "In stock";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] ${styles[state]}`}
    >
      <span
        className={`size-1.5 rounded-full ${state === "in-stock" ? "bg-[var(--color-success)]" : state === "low-stock" ? "bg-[var(--color-warning)]" : "bg-[var(--color-error)]"}`}
      />
      {text}
    </span>
  );
}
