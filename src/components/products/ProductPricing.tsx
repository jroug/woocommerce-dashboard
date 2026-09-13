import type { ProductDetails } from "@/types/product";
import { FormField, TextInput } from "./ProductFormField";
export function ProductPricing({
  product,
  onChange,
  error,
}: {
  product: ProductDetails;
  onChange: (patch: Partial<ProductDetails>) => void;
  error?: string;
}) {
  const money = new Intl.NumberFormat("en-IE", { style: "currency", currency: product.currency });
  const symbol = money.formatToParts(0).find((part) => part.type === "currency")?.value;
  const price = Number(product.price) || 0;
  const cost = Number(product.cost) || 0;
  const profit = price - cost;
  const margin = price > 0 ? (profit / price) * 100 : 0;
  return (
    <section className="admin-card p-4 sm:p-5">
      <h2 className="mb-4 text-[15px] font-semibold">Pricing</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <FormField label="Price" error={error}>
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 text-[13px] text-[var(--color-text-muted)]">
              {symbol}
            </span>
            <TextInput
              type="number"
              min="0"
              step="0.01"
              value={product.price}
              onChange={(e) => onChange({ price: e.target.value })}
              className="pl-6"
            />
          </div>
        </FormField>
        <FormField label="Regular price">
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 text-[13px] text-[var(--color-text-muted)]">
              {symbol}
            </span>
            <TextInput
              type="number"
              min="0"
              step="0.01"
              value={product.regularPrice}
              onChange={(e) => onChange({ regularPrice: e.target.value })}
              className="pl-6"
            />
          </div>
        </FormField>
        <FormField label="Sale price">
          <TextInput
            type="number"
            min="0"
            step="0.01"
            value={product.salePrice}
            onChange={(e) => onChange({ salePrice: e.target.value })}
          />
        </FormField>
        <FormField label="Cost per item">
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 text-[13px] text-[var(--color-text-muted)]">
              {symbol}
            </span>
            <TextInput
              type="number"
              min="0"
              step="0.01"
              value={product.cost}
              onChange={(e) => onChange({ cost: e.target.value })}
              className="pl-6"
            />
          </div>
        </FormField>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-[var(--radius-md)] bg-[var(--color-surface-subdued)] p-3 text-[12px]">
        <div>
          <p className="text-[var(--color-text-muted)]">Profit</p>
          <p className={`font-semibold ${profit < 0 ? "text-[var(--color-error)]" : ""}`}>
            {product.cost === "" ? "—" : money.format(profit)}
          </p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)]">Margin</p>
          <p className="font-semibold">{product.cost === "" ? "—" : `${margin.toFixed(1)}%`}</p>
        </div>
      </div>
    </section>
  );
}
