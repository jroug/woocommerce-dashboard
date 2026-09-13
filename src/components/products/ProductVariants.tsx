import { Plus, Trash2 } from "lucide-react";
import type { ProductDetails, ProductVariant } from "@/types/product";
import { TextInput } from "./ProductFormField";
export function ProductVariants({
  product,
  onChange,
}: {
  product: ProductDetails;
  onChange: (patch: Partial<ProductDetails>) => void;
}) {
  if (product.type !== "variable") return null;
  const updateVariant = (id: number, patch: Partial<ProductVariant>) =>
    onChange({
      variants: product.variants.map((variant) =>
        variant.id === id ? { ...variant, ...patch } : variant,
      ),
    });
  // Option labels are edited independently; changing them does not regenerate variants.
  const updateOption = (id: number, values: string) =>
    onChange({
      options: product.options.map((option) =>
        option.id === id
          ? {
              ...option,
              values: values
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean),
            }
          : option,
      ),
    });
  const removeVariant = (id: number) =>
    onChange({ variants: product.variants.filter((variant) => variant.id !== id) });
  const addVariant = () =>
    onChange({
      variants: [
        ...product.variants,
        {
          id: Date.now(),
          name: "New variant",
          sku: `${product.sku}-NEW`,
          price: product.price,
          stockQuantity: 0,
          stockStatus: "instock",
        },
      ],
    });
  return (
    <section className="admin-card overflow-hidden">
      <header className="flex items-center justify-between border-b px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold">Variants</h2>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            {product.variants.length} variants
          </p>
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="admin-control flex h-8 items-center gap-1.5 px-2.5 text-[12px] font-medium"
        >
          <Plus size={13} />
          Add variant
        </button>
      </header>
      <div className="grid gap-3 border-b bg-[var(--color-surface-subdued)] px-4 py-3 sm:grid-cols-2">
        {product.options.map((option) => (
          <label key={option.id}>
            <span className="mb-1 block text-[11px] font-medium text-[var(--color-text-secondary)]">
              {option.name} values
            </span>
            <TextInput
              value={option.values.join(", ")}
              onChange={(e) => updateOption(option.id, e.target.value)}
              aria-label={`${option.name} option values`}
            />
          </label>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-[12px]">
          <thead className="border-b bg-[var(--color-surface-subdued)] text-[var(--color-text-secondary)]">
            <tr>
              <th className="px-4 py-2 font-medium">Variant</th>
              <th className="px-2 py-2 font-medium">SKU</th>
              <th className="px-2 py-2 font-medium">Price</th>
              <th className="px-2 py-2 font-medium">Stock</th>
              <th className="px-2 py-2 font-medium">Status</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {product.variants.map((variant) => (
              <tr key={variant.id}>
                <td className="px-4 py-2 font-medium">
                  <TextInput
                    value={variant.name}
                    onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                  />
                </td>
                <td className="px-2 py-2">
                  <TextInput
                    value={variant.sku}
                    onChange={(e) => updateVariant(variant.id, { sku: e.target.value })}
                  />
                </td>
                <td className="px-2 py-2">
                  <TextInput
                    type="number"
                    min="0"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => updateVariant(variant.id, { price: e.target.value })}
                  />
                </td>
                <td className="px-2 py-2">
                  <TextInput
                    type="number"
                    min="0"
                    value={variant.stockQuantity ?? ""}
                    onChange={(e) =>
                      updateVariant(variant.id, { stockQuantity: Number(e.target.value) })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${variant.stockStatus === "instock" ? "bg-[var(--color-success-bg)] text-[var(--color-success)]" : "bg-[var(--color-error-bg)] text-[var(--color-error)]"}`}
                  >
                    {variant.stockStatus === "onbackorder"
                      ? "On backorder"
                      : variant.stockStatus === "instock"
                        ? "In stock"
                        : "Out of stock"}
                  </span>
                </td>
                <td className="px-2">
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    aria-label={`Delete ${variant.name}`}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
