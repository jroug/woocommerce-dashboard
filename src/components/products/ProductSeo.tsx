import type { ProductDetails } from "@/types/product";
import { FormField, TextArea, TextInput } from "./ProductFormField";
export function ProductSeo({
  product,
  onChange,
}: {
  product: ProductDetails;
  onChange: (patch: Partial<ProductDetails>) => void;
}) {
  const updateSeo = (key: keyof ProductDetails["seo"], value: string) =>
    onChange({ seo: { ...product.seo, [key]: value } });
  return (
    <section className="admin-card p-4 sm:p-5">
      <h2 className="text-[15px] font-semibold">Search engine listing</h2>
      <div className="my-4 rounded-[var(--radius-md)] border bg-[var(--color-surface-subdued)] p-3">
        <p className="truncate text-[14px] font-medium text-[#1a0dab]">
          {product.seo.title || product.name}
        </p>
        <p className="mt-0.5 text-[11px] text-[var(--color-success)]">
          {product.permalink || `/${product.slug}`}
        </p>
        <p className="mt-1 line-clamp-2 text-[12px] text-[var(--color-text-secondary)]">
          {product.seo.description}
        </p>
      </div>
      <div className="space-y-3">
        <FormField label="SEO title" helper={`${product.seo.title.length}/60 characters`}>
          <TextInput
            maxLength={60}
            value={product.seo.title}
            onChange={(e) => updateSeo("title", e.target.value)}
          />
        </FormField>
        <FormField
          label="Meta description"
          helper={`${product.seo.description.length}/160 characters`}
        >
          <TextArea
            rows={3}
            maxLength={160}
            value={product.seo.description}
            onChange={(e) => updateSeo("description", e.target.value)}
          />
        </FormField>
        <FormField label="URL slug">
          <TextInput
            value={product.slug}
            onChange={(e) =>
              onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
            }
          />
        </FormField>
      </div>
    </section>
  );
}
