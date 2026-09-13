import type { ProductDetails } from "@/types/product";
export function ProductStats({ product }: { product: ProductDetails }) {
  const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: product.currency });
  return (
    <section className="admin-card">
      <header className="border-b px-4 py-3.5">
        <h2 className="text-[15px] font-semibold">Product performance</h2>
      </header>
      <dl className="grid grid-cols-3 divide-x p-4 text-center">
        <div>
          <dt className="text-[11px] text-[var(--color-text-muted)]">Units sold</dt>
          <dd className="mt-1 text-[14px] font-semibold">{product.totalSales}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-[var(--color-text-muted)]">Revenue</dt>
          <dd className="mt-1 text-[14px] font-semibold">
            {product.revenue === null ? "—" : money.format(Number(product.revenue))}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-[var(--color-text-muted)]">Orders</dt>
          <dd className="mt-1 text-[14px] font-semibold">{product.ordersCount ?? "—"}</dd>
        </div>
      </dl>
    </section>
  );
}
