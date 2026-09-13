import Image from "next/image";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import type { ProductDetails } from "@/types/product";
export function ProductMedia({
  product,
  onChange,
}: {
  product: ProductDetails;
  onChange: (patch: Partial<ProductDetails>) => void;
}) {
  const remove = (id: number) =>
    onChange({ images: product.images.filter((image) => image.id !== id) });
  // Simulate adding media by cycling through bundled assets; no file upload occurs.
  const add = () => {
    const sources = ["/products/apparel.svg", "/products/accessory.svg", "/products/home.svg"];
    const id = Date.now();
    onChange({
      images: [
        ...product.images,
        {
          id,
          src: sources[product.images.length % sources.length],
          alt: `${product.name} mock media ${product.images.length + 1}`,
        },
      ],
    });
  };
  return (
    <section className="admin-card">
      <header className="flex items-center justify-between border-b px-4 py-3.5 sm:px-5">
        <h2 className="text-[15px] font-semibold">Media</h2>
        <button
          type="button"
          onClick={add}
          className="admin-control flex h-8 items-center gap-1.5 px-2.5 text-[12px] font-medium"
        >
          <Plus size={13} />
          Add media
        </button>
      </header>
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5">
        {product.images.length === 0 && (
          <p className="col-span-full text-[13px] text-[var(--color-text-muted)]">
            No product images.
          </p>
        )}
        {product.images.map((image, index) => (
          <div
            className={`group relative overflow-hidden rounded-[var(--radius-md)] border bg-[var(--color-surface-subdued)] ${index === 0 ? "col-span-2 row-span-2 sm:col-span-2" : ""}`}
            key={image.id}
          >
            <Image
              unoptimized
              src={image.src}
              alt={image.alt}
              width={index === 0 ? 480 : 220}
              height={index === 0 ? 360 : 180}
              className={`w-full object-cover ${index === 0 ? "aspect-[4/3]" : "aspect-square"}`}
            />
            <span className="absolute left-2 top-2 flex size-6 cursor-grab items-center justify-center rounded-[var(--radius-sm)] bg-white/90 text-[var(--color-text-secondary)] opacity-0 shadow-sm group-hover:opacity-100">
              <GripVertical size={14} />
            </span>
            <button
              type="button"
              onClick={() => remove(image.id)}
              aria-label={`Remove ${image.alt}`}
              className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-[var(--radius-sm)] bg-white/90 text-[var(--color-error)] opacity-0 shadow-sm group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </button>
            {index === 0 && (
              <span className="absolute bottom-2 left-2 rounded-[var(--radius-sm)] bg-black/65 px-2 py-0.5 text-[11px] font-medium text-white">
                Primary
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
