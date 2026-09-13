import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { ProductCategory, ProductDetails, ProductType } from "@/types/product";
import { FormField, TextInput } from "./ProductFormField";
export function ProductOrganization({
  product,
  categories,
  onChange,
}: {
  product: ProductDetails;
  categories: ProductCategory[];
  onChange: (patch: Partial<ProductDetails>) => void;
}) {
  const [tag, setTag] = useState("");
  const addTag = () => {
    const value = tag.trim();
    if (value && !product.tags.includes(value)) onChange({ tags: [...product.tags, value] });
    setTag("");
  };
  const toggleCategory = (category: ProductCategory) =>
    onChange({
      categories: product.categories.some((item) => item.id === category.id)
        ? product.categories.filter((item) => item.id !== category.id)
        : [...product.categories, category],
    });
  return (
    <section className="admin-card">
      <header className="border-b px-4 py-3.5">
        <h2 className="text-[15px] font-semibold">Organization</h2>
      </header>
      <div className="space-y-4 p-4">
        <FormField label="Product type">
          <select
            value={product.type}
            onChange={(e) => onChange({ type: e.target.value as ProductType })}
            className="admin-control h-8 w-full px-2 text-[13px] outline-none"
          >
            <option value="simple">Simple product</option>
            <option value="variable">Variable product</option>
            <option value="grouped">Grouped product</option>
            <option value="external">External product</option>
          </select>
        </FormField>
        <FormField label="Brand / vendor">
          <TextInput value={product.brand} onChange={(e) => onChange({ brand: e.target.value })} />
        </FormField>
        <fieldset>
          <legend className="mb-1 text-[12px] font-medium">Categories</legend>
          <div className="space-y-1.5 rounded-[var(--radius-md)] border p-2.5">
            {categories.map((category) => (
              <label className="flex items-center gap-2 text-[12px]" key={category.id}>
                <input
                  type="checkbox"
                  checked={product.categories.some((item) => item.id === category.id)}
                  onChange={() => toggleCategory(category)}
                  className="size-3.5 accent-[#303030]"
                />
                {category.name}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <span className="mb-1 block text-[12px] font-medium">Tags</span>
          <div className="flex gap-2">
            <TextInput
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="admin-control flex size-8 shrink-0 items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.tags.map((item) => (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-hover)] px-2 py-1 text-[11px]"
                key={item}
              >
                {item}
                <button
                  type="button"
                  onClick={() =>
                    onChange({ tags: product.tags.filter((tagItem) => tagItem !== item) })
                  }
                  aria-label={`Remove ${item}`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
