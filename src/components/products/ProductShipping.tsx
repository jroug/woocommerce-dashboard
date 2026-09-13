import type { ProductDetails } from "@/types/product";
import { FormField, TextInput, Toggle } from "./ProductFormField";
export function ProductShipping({
  product,
  onChange,
}: {
  product: ProductDetails;
  onChange: (patch: Partial<ProductDetails>) => void;
}) {
  const updateDimensions = (key: keyof ProductDetails["dimensions"], value: string) =>
    onChange({ dimensions: { ...product.dimensions, [key]: value } });
  return (
    <section className="admin-card p-4 sm:p-5">
      <h2 className="mb-4 text-[15px] font-semibold">Shipping</h2>
      <Toggle
        checked={product.physicalProduct}
        onChange={(physicalProduct) => onChange({ physicalProduct })}
        label="This is a physical product"
      />
      {product.physicalProduct && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <FormField label="Weight" helper={product.weightUnit ?? "kg"}>
            <TextInput
              type="number"
              min="0"
              step="0.01"
              value={product.weight}
              onChange={(e) => onChange({ weight: e.target.value })}
            />
          </FormField>
          <FormField label="Shipping class">
            <select
              value={product.shippingClass}
              onChange={(e) => onChange({ shippingClass: e.target.value })}
              className="admin-control h-8 w-full px-2 text-[13px] outline-none"
            >
              <option>{product.shippingClass}</option>
              <option>Standard</option>
              <option>Bulky</option>
              <option>Fragile</option>
            </select>
          </FormField>
          <div className="grid grid-cols-3 gap-2 sm:col-span-2">
            {(["length", "width", "height"] as const).map((key) => (
              <FormField
                label={`${key[0].toUpperCase()}${key.slice(1)} (${product.dimensionUnit ?? "cm"})`}
                key={key}
              >
                <TextInput
                  type="number"
                  min="0"
                  value={product.dimensions[key]}
                  onChange={(e) => updateDimensions(key, e.target.value)}
                />
              </FormField>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
