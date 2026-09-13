import type { ProductDetails } from "@/types/product";
import { FormField, TextArea, TextInput } from "./ProductFormField";
export function ProductInformation({
  product,
  onChange,
  error,
}: {
  product: ProductDetails;
  onChange: (patch: Partial<ProductDetails>) => void;
  error?: string;
}) {
  return (
    <section className="admin-card p-4 sm:p-5">
      <h2 className="mb-4 text-[15px] font-semibold">Product information</h2>
      <div className="space-y-4">
        <FormField label="Title" error={error}>
          <TextInput value={product.name} onChange={(e) => onChange({ name: e.target.value })} />
        </FormField>
        <FormField label="Description" helper="Describe the product's key features and materials.">
          <TextArea
            rows={7}
            value={product.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </FormField>
        {product.shortDescription && (
          <FormField label="Short description">
            <TextArea
              rows={3}
              value={product.shortDescription}
              onChange={(e) => onChange({ shortDescription: e.target.value })}
            />
          </FormField>
        )}
      </div>
    </section>
  );
}
