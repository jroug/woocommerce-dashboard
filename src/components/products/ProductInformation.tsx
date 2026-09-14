import type { ProductDetails } from "@/types/product";
import { FormField, TextInput } from "./ProductFormField";
import { RichTextEditor } from "./RichTextEditor";
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
          <RichTextEditor
            value={product.description}
            onChange={(description) => onChange({ description })}
            ariaLabel="Product description"
          />
        </FormField>
        <FormField label="Short description">
          <RichTextEditor
            value={product.shortDescription ?? ""}
            onChange={(shortDescription) => onChange({ shortDescription })}
            ariaLabel="Product short description"
          />
        </FormField>
      </div>
    </section>
  );
}
