"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Product } from "@/types/product";
import { InventoryStatus } from "./InventoryStatus";
import { ProductStatusBadge } from "./ProductStatusBadge";
function formatPrice(value: string, currency: string) {
  return value === ""
    ? "—"
    : new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(Number(value));
}
function SelectAllCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  // The mixed checkbox state is a DOM property, not a declarative HTML attribute.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label="Select all visible products"
      checked={checked}
      onChange={onChange}
      className="size-4 cursor-pointer accent-[#303030]"
    />
  );
}
export function ProductsTable({
  products,
  selected,
  onSelect,
  onSelectAll,
}: {
  products: Product[];
  selected: Set<number>;
  onSelect: (id: number) => void;
  onSelectAll: () => void;
}) {
  const selectedVisible = products.filter((product) => selected.has(product.id)).length;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] border-collapse text-left text-[13px]">
        <caption className="sr-only">Store products</caption>
        <thead className="border-b bg-[var(--color-surface-subdued)] text-[12px] text-[var(--color-text-secondary)]">
          <tr>
            <th className="w-11 px-4 py-2">
              <SelectAllCheckbox
                checked={selectedVisible === products.length && products.length > 0}
                indeterminate={selectedVisible > 0 && selectedVisible < products.length}
                onChange={onSelectAll}
              />
            </th>
            <th className="px-2 py-2 font-medium">Product (Name)</th>
            <th className="px-3 py-2 font-medium">SKU</th>
            <th className="px-3 py-2 font-medium">Stock</th>
            <th className="px-3 py-2 text-right font-medium">Price / Sale price</th>
            <th className="px-3 py-2 font-medium">Categories</th>
            <th className="px-3 py-2 font-medium">Tags</th>
            <th className="px-3 py-2 font-medium">Brands</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="w-32 min-w-32 px-4 py-2 font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product) => {
            const date = product.status === "draft" ? product.dateModified : product.datePublished;
            return (
              <tr
                key={product.id}
                className={`group transition-colors ${selected.has(product.id) ? "bg-[#f1f5f3] hover:bg-[#e8efeb]" : product.status === "draft" ? "bg-[#fff9ed] hover:bg-[var(--color-warning-bg)]" : product.status === "publish" ? "bg-[#f2faf5] hover:bg-[#e5f3eb]" : "bg-[var(--color-surface)] hover:bg-[var(--color-surface-subdued)]"}`}
              >
                <td className="px-4 py-2.5">
                  <input
                    type="checkbox"
                    aria-label={`Select ${product.name}`}
                    checked={selected.has(product.id)}
                    onChange={() => onSelect(product.id)}
                    className="size-4 cursor-pointer accent-[#303030]"
                  />
                </td>
                <td className="px-2 py-2.5">
                  <Link href={`/products/${product.id}`} className="flex items-center gap-3">
                    <Image
                      unoptimized
                      src={product.image.src}
                      alt={product.image.alt}
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-[var(--radius-sm)] border object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block whitespace-normal break-words font-semibold text-[var(--color-text)] underline-offset-2 group-hover:underline">
                        {product.name}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">
                  {product.sku || "—"}
                </td>
                <td className="px-3 py-2.5">
                  <InventoryStatus product={product} />
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums">
                  <span
                    className={
                      product.salePrice ? "text-[var(--color-text-muted)]" : "font-semibold"
                    }
                  >
                    {formatPrice(product.regularPrice || product.price, product.currency)}
                  </span>
                  {product.salePrice && (
                    <span className="block font-semibold text-[var(--color-success)]">
                      Sale: {formatPrice(product.salePrice, product.currency)}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">
                  {(product.categories ?? [product.category])
                    .map((category) => category.name)
                    .join(", ") || "—"}
                </td>
                <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">
                  {product.tags?.join(", ") || "—"}
                </td>
                <td className="px-3 py-2.5 text-[var(--color-text-secondary)]">
                  {product.brands?.join(", ") || "—"}
                </td>
                <td className="px-3 py-2.5">
                  <ProductStatusBadge status={product.status} />
                </td>
                <td className="w-32 min-w-32 px-4 py-2.5 text-[var(--color-text-secondary)]">
                  {date ? (
                    <>
                      <span className="block text-[11px]">
                        {product.status === "draft" ? "Last modified" : "Published"}
                      </span>
                      <time dateTime={date} className="block whitespace-nowrap">
                        {new Intl.DateTimeFormat("en-GB", {
                          dateStyle: "medium",
                          timeZone: "UTC",
                        }).format(new Date(date))}
                      </time>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
