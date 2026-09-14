import type { TopProduct } from "@/types/dashboard";
import { Panel } from "./Panel";
export function TopProducts({ products, currency }: { products: TopProduct[]; currency: string }) {
  const money = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return (
    <Panel title="Top products" description="Best sellers by revenue">
      <ol className="mt-3 divide-y px-4 pb-2 sm:px-5">
        {products.length === 0 && (
          <li className="py-6 text-center text-[12px] text-[var(--color-text-muted)]">
            No paid product sales in this period.
          </li>
        )}
        {products.map((product, index) => (
          <li
            className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 py-2.5"
            key={product.id}
          >
            <span className="w-3 text-[11px] text-[var(--color-text-muted)]">{index + 1}</span>
            <span className="flex min-w-0 items-center gap-2.5">
              <span
                className="size-8 shrink-0 rounded-[var(--radius-sm)] opacity-80"
                style={{ backgroundColor: product.color }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium text-[var(--color-text)]">
                  {product.name}
                </span>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  {product.unitsSold} units · {product.category}
                </span>
              </span>
            </span>
            <span className="text-[13px] font-semibold tabular-nums text-[var(--color-text)]">
              {money.format(product.revenue)}
            </span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
