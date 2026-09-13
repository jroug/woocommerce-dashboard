import type { ProductDetails, ProductStatus } from "@/types/product";
import { ProductStatusBadge } from "./ProductStatusBadge";
export function ProductStatusCard({
  product,
  onChange,
}: {
  product: ProductDetails;
  onChange: (patch: Partial<ProductDetails>) => void;
}) {
  return (
    <section className="admin-card">
      <header className="flex items-center justify-between border-b px-4 py-3.5">
        <h2 className="text-[15px] font-semibold">Status</h2>
        <ProductStatusBadge status={product.status} />
      </header>
      <div className="p-4">
        <label className="block">
          <span className="mb-1 block text-[12px] font-medium">Product status</span>
          <select
            value={product.status}
            onChange={(e) => onChange({ status: e.target.value as ProductStatus })}
            className="admin-control h-8 w-full px-2 text-[13px] outline-none"
          >
            <option value="publish">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending review</option>
            <option value="private">Private</option>
            <option value="future">Scheduled</option>
            <option value="trash">Trash</option>
          </select>
        </label>
        <p className="mt-2 text-[11px] text-[var(--color-text-muted)]">
          Published products are visible in your store.
        </p>
      </div>
    </section>
  );
}
